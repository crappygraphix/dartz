module Main exposing (main)

import Browser
import Html exposing (Html, h1, a, div, label, ul, li, span, text, option, button, select, input, tr, td, table)
import Html.Attributes exposing (class, placeholder, style, selected, value, href)
import Html.Events exposing (onClick, onInput)
import Json.Decode as JD
import Json.Encode as JE
import Svg as S
import Svg.Attributes as SA
import Svg.Events as SE

import Game as Game
import Ports exposing (store_state)
import Types exposing (..)
import Types.Decode exposing (..)
import Types.Dom exposing (..)
import Types.Encode exposing (..)
import Types.Text exposing (..)

main : Program JE.Value AppState Action
main = Browser.element 
  { init = init
  , update = update
  , view = view 
  , subscriptions = \_ -> Sub.none
  }

game_list : List GameState
game_list = 
  [ NoGame
  , Numbers301 BasicIn BasicOut 0 [] []
  , Numbers501 BasicIn BasicOut 0 [] []
  , Numbers701 BasicIn BasicOut 0 [] []
  , Cricket BasicCricket 0 [] []
  , Baseball BasicBaseball 0 [] (Inning 0) []
  , AroundTheClock NoBullOut 0 [] []
  , AroundTheClock180 DoubleBonus 0 [] []
  , ChaseTheDragon BasicDragon 0 [] []
  ]

clean_state : AppState
clean_state = 
  { players = []
  , game = NoGame
  , screen = Home
  , playing = False
  }

init : JE.Value -> (AppState, Cmd Action)
init s = case JD.decodeValue app_state_decoder s of
  Err _ -> (clean_state, Cmd.none) -- TODO: Surface Error
  Ok state -> (state, Cmd.none)
  
update : Action -> AppState -> (AppState, Cmd Action)
update action state = 
  let
    id_num (PlayerID i) = i

    new_player (NewPlayerName n) (NewPlayerInitials s) i = { name = PlayerName n, initials = PlayerInitials s, hits = PlayerHits [], id = PlayerID i }
    
    available_id = 
      let
        consumed = List.sort <| List.map (\p -> id_num p.id) state.players
        check v acc = 
          if v == acc
          then v + 1
          else acc
      in
        List.foldl check 0 consumed

    add_player l n i =
      let
        empty (NewPlayerName s) (NewPlayerInitials ni) = (String.isEmpty <| String.trim s) || (String.isEmpty <| String.trim ni)        
      in
        if empty n i
        then l 
        else l ++ [ new_player n i available_id ]
    
    digest_initials (NewPlayerInitials i) = NewPlayerInitials <| String.toUpper <| String.left 2 <| String.trim i

    move_player_up l i =
      let
        to_the_left p acc = 
          if p.id == i
          then (List.take (List.length acc - 1) acc) ++ [ p ] ++ (List.drop (List.length acc - 1) acc)
          else acc ++ [ p ]
      in
        List.foldl to_the_left [] l

    move_player_down l i = List.reverse <| move_player_up (List.reverse l) i

    delete_player l i = List.filter (\p -> p.id /= i) l

    post_delete_player s = { s | game = Game.player_removed s.players s.game }
    post_add_player s = { s | game = Game.player_added s.players s.game }

    new_state = 
      case action of
        GoHome -> { state | screen = Home }
        GoEditPlayers -> { state | screen = EditPlayers (NewPlayerName "") (NewPlayerInitials "")}
        GoSelectGame -> { state | screen = SelectGame }
        StartGame -> { state | screen = PlayGame Nothing, game = Game.new_game state.game state.players, playing = True }
        ResumeGame -> { state | screen = PlayGame Nothing }
        EndGame -> { state | screen = Home, game = Game.new_game state.game state.players, playing = False }
        GameSelected mode -> { state | game = mode }
        NewPlayerInput p i -> { state | screen = EditPlayers p (digest_initials i) }
        NewPlayerCommit p i -> 
          { state | players = add_player state.players p i, screen = EditPlayers (NewPlayerName "") (NewPlayerInitials "") }
          |> post_add_player
        DeletePlayer i -> 
          { state | players = delete_player state.players i } 
          |> post_delete_player
        Toss h -> { state | screen = PlayGame (Just <| SelectSubHit h) }
        TossModalSelect h -> { state | screen = PlayGame Nothing, game = Game.record_toss h state.game }
        TossModalCancel -> { state | screen = PlayGame Nothing }
        FinishTurnModal -> { state | screen = PlayGame (Just <| FinalizeTurn)}
        CancelFinishTurn -> { state | screen = PlayGame Nothing }
        FinishTurn -> { state | screen = PlayGame Nothing , game = Game.finalize_turn state.game }
        MovePlayerUp i -> { state | players = move_player_up state.players i }
        MovePlayerDown i -> { state | players = move_player_down state.players i }
    save_state = store_state << JE.encode 0 <| encode_app_state new_state
  in (new_state, save_state)

view : AppState -> Html Action
view state =
  let 
    block_scroll modal =
      case modal of
         Just _ -> div [ class "modal-open main" ]
         Nothing -> div [ class "main" ]
    render = 
      case state.screen of
        Home -> div [ class "main" ] <| render_home state
        EditPlayers np ni -> div [ class "main" ] <| render_edit_players state np ni
        SelectGame -> div [ class "main" ] <| render_select_game state.game
        PlayGame modal -> block_scroll modal <| render_game state modal
  in
    render    

render_home : AppState -> List (Html Action)
render_home state =
  let
    start_game =  
      if List.length state.players > 0 && state.game /= NoGame && state.playing == False
      then [ li [ class "nav-item" ] [ a [ onClick StartGame, class "nav-link" ] [ text "Start Game" ] ] ]
      else []
    resume_game =  
      if List.length state.players > 0 && state.game /= NoGame && state.playing == True
      then [ li [ class "nav-item" ] [ a [ onClick ResumeGame, class "nav-link" ] [ text "Resume" ] ] ]
      else []
    select_game =
      if state.playing == False
      then [ li [ class "nav-item" ] [ a [ onClick GoSelectGame, class "nav-link" ] [ text "Select Game" ] ] ]
      else []
    player p = 
      div [ class "row" ]
      [ div [ class "col" ] [ text <| player_name_text p.name ]
      , div [ class "col" ] [ text <| player_initials_text p.initials ] 
      ]
    players = List.map player state.players
  in
    [ ul [ class "nav bg-primary text-white" ] <|
      start_game ++
      resume_game ++
      [ li [ class "nav-item" ] [ a [ onClick GoEditPlayers, class "nav-link" ] [ text "Edit Players" ] ] ] ++
      select_game
    , div [ class "container" ] 
      [ text "Selected Game: "
      , game_name state.game
      ]    
    , div [ class "container" ] players
    ]

render_select_game : GameState -> List (Html Action)
render_select_game mode =
  [ ul [ class "nav bg-primary text-white" ]
    [ li [ class "nav-item" ] [ a [ onClick GoHome, class "nav-link" ] [ text "Home" ] ]
    , li [ class "nav-item" ] [ a [ onClick GoEditPlayers, class "nav-link" ] [ text "Edit Players" ] ]
    ]
  , div [] 
    [ text "Selected Game: "
    , game_name mode
    ]
  ] ++
  mode_selector mode ++
  variant_selector mode ++
  [ div [] [game_description mode] ]

mode_selector : GameState -> List (Html Action)
mode_selector mode = 
  [ div [] 
    [ select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
      (List.map (game_to_option mode) game_list) 
    ]
  ]

variant_selector : GameState -> List (Html Action)
variant_selector mode = 
  let is_selected a b = if a == b then [ selected True ] else []
  in case mode of 
    NoGame -> []
    Numbers301 vi vo x y z -> 
      [ div []
        [ div [] [ text "In Rule" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (Numbers301 BasicIn vo x y z) ] ++ is_selected vi BasicIn) [ text (numbers_variation_in_text BasicIn) ]
          , option ([ value <| game_to_id (Numbers301 DoubleIn vo x y z) ] ++ is_selected vi DoubleIn) [ text (numbers_variation_in_text DoubleIn) ]
          , option ([ value <| game_to_id (Numbers301 TripleIn vo x y z) ] ++ is_selected vi TripleIn) [ text (numbers_variation_in_text TripleIn) ]
          ]
        ]
      , div []
        [ div [] [ text "Out Rule" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (Numbers301 vi BasicOut x y z) ] ++ is_selected vo BasicOut) [ text (numbers_variation_out_text BasicOut) ]
          , option ([ value <| game_to_id (Numbers301 vi DoubleOut x y z) ] ++ is_selected vo DoubleOut) [ text (numbers_variation_out_text DoubleOut) ]
          , option ([ value <| game_to_id (Numbers301 vi TripleOut x y z) ] ++ is_selected vo TripleOut) [ text (numbers_variation_out_text TripleOut) ]
          ]
        ]
      ]
    Numbers501 vi vo x y z -> 
      [ div []
        [ div [] [ text "In Rule" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (Numbers501 BasicIn vo x y z) ] ++ is_selected vi BasicIn) [ text (numbers_variation_in_text BasicIn) ]
          , option ([ value <| game_to_id (Numbers501 DoubleIn vo x y z) ] ++ is_selected vi DoubleIn) [ text (numbers_variation_in_text DoubleIn) ]
          , option ([ value <| game_to_id (Numbers501 TripleIn vo x y z) ] ++ is_selected vi TripleIn) [ text (numbers_variation_in_text TripleIn) ]
          ]
        ]
      , div []
        [ div [] [ text "Out Rule" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (Numbers501 vi BasicOut x y z) ] ++ is_selected vo BasicOut) [ text (numbers_variation_out_text BasicOut) ]
          , option ([ value <| game_to_id (Numbers501 vi DoubleOut x y z) ] ++ is_selected vo DoubleOut) [ text (numbers_variation_out_text DoubleOut) ]
          , option ([ value <| game_to_id (Numbers501 vi TripleOut x y z) ] ++ is_selected vo TripleOut) [ text (numbers_variation_out_text TripleOut) ]
          ]
        ]
      ]
    Numbers701 vi vo x y z -> 
      [ div []
        [ div [] [ text "In Rule" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (Numbers701 BasicIn vo x y z) ] ++ is_selected vi BasicIn) [ text (numbers_variation_in_text BasicIn) ]
          , option ([ value <| game_to_id (Numbers701 DoubleIn vo x y z) ] ++ is_selected vi DoubleIn) [ text (numbers_variation_in_text DoubleIn) ]
          , option ([ value <| game_to_id (Numbers701 TripleIn vo x y z) ] ++ is_selected vi TripleIn) [ text (numbers_variation_in_text TripleIn) ]
          ]
        ]
      , div []
        [ div [] [ text "Out Rule" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (Numbers701 vi BasicOut x y z) ] ++ is_selected vo BasicOut) [ text (numbers_variation_out_text BasicOut) ]
          , option ([ value <| game_to_id (Numbers701 vi DoubleOut x y z) ] ++ is_selected vo DoubleOut) [ text (numbers_variation_out_text DoubleOut) ]
          , option ([ value <| game_to_id (Numbers701 vi TripleOut x y z) ] ++ is_selected vo TripleOut) [ text (numbers_variation_out_text TripleOut) ]
          ]
        ]
      ]
    AroundTheClock v x y z ->
      [ div []
        [ div [] [ text "Variation" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (AroundTheClock NoBullOut x y z) ] ++ is_selected v NoBullOut) [ text (around_the_clock_variation_text NoBullOut) ]
          , option ([ value <| game_to_id (AroundTheClock AnyBullOut x y z) ] ++ is_selected v AnyBullOut) [ text (around_the_clock_variation_text AnyBullOut) ]
          , option ([ value <| game_to_id (AroundTheClock SplitBullOut x y z) ] ++ is_selected v SplitBullOut) [ text (around_the_clock_variation_text SplitBullOut) ]
          ]
        ]
      ]
    AroundTheClock180 v x y z ->
      [ div []
        [ div [] [ text "Variation" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (AroundTheClock180 DoubleBonus x y z)] ++ is_selected v DoubleBonus) [ text (around_the_clock_180_variation_text DoubleBonus) ]
          , option ([ value <| game_to_id (AroundTheClock180 TripleBonus x y z)] ++ is_selected v TripleBonus) [ text (around_the_clock_180_variation_text TripleBonus) ]
          ]
        ]
      ]
    Baseball v w x y z ->
      [ div []
        [ div [] [ text "Variation" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (Baseball BasicBaseball w x y z)] ++ is_selected v BasicBaseball) [ text (baseball_variation_text BasicBaseball) ]
          , option ([ value <| game_to_id (Baseball SeventhInningCatch w x y z)] ++ is_selected v SeventhInningCatch) [ text (baseball_variation_text SeventhInningCatch) ]
          ]
        ]
      ]
    ChaseTheDragon v x y z ->
      [ div []
        [ div [] [ text "Variation" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (ChaseTheDragon BasicDragon x y z)] ++ is_selected v BasicDragon) [ text (dragon_variation_text BasicDragon) ]
          , option ([ value <| game_to_id (ChaseTheDragon TripleHeadedDragon x y z)] ++ is_selected v TripleHeadedDragon) [ text (dragon_variation_text TripleHeadedDragon) ]
          ]
        ]
      ]
    Cricket v x y z ->
      [ div []
        [ div [] [ text "Variation" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (Cricket BasicCricket x y z)] ++ is_selected v BasicCricket) [ text (cricket_variation_text BasicCricket) ]
          , option ([ value <| game_to_id (Cricket GolfCricket x y z)] ++ is_selected v GolfCricket) [ text (cricket_variation_text GolfCricket) ]
          ]
        ]
      ]

render_edit_players : AppState -> NewPlayerName -> NewPlayerInitials -> List (Html Action)
render_edit_players state np ni =
  let
    select_game =
      if state.playing == False
      then [ li [ class "nav-item" ] [ a [ onClick GoSelectGame, class "nav-link" ] [ text "Select Game" ] ] ]
      else []
  in
  
  [ ul [ class "nav bg-primary text-white" ] <|
    [ li [ class "nav-item" ] [ a [ onClick GoHome, class "nav-link" ] [ text "Home" ] ] ] ++
    select_game
  ] ++
  (add_player_form np ni) ++
  [ div []
    [ text "Players" ]
  ] ++
  (list_editable_players state.players)

add_player_form : NewPlayerName -> NewPlayerInitials -> List (Html Action)
add_player_form (NewPlayerName t) (NewPlayerInitials ni) = 
  [ div [ class "form-group" ] 
    [ label [] [ text "Player Name" ]
    , input [ value t, placeholder "Name", onInput (\v -> NewPlayerInput (NewPlayerName v) (NewPlayerInitials ni)), class "form-control" ] []
    ]
  , div [ class "form-group" ] 
    [ label [] [ text "Player Initials (Max 2 Characters)" ]
    , input [ value ni, placeholder "Initials", onInput (\v -> NewPlayerInput (NewPlayerName t) (NewPlayerInitials v)), class "form-control" ] []
    ]
  , button [ onClick (NewPlayerCommit (NewPlayerName t) (NewPlayerInitials ni)), class "btn btn-primary" ] [ text "Add Player" ]
  ]

list_editable_players : List Player -> List (Html Action)
list_editable_players l = 
  let
    player_edit_row player = 
      tr [] 
        [ td [] [ text <| player_name_text player.name ++ " (" ++ player_initials_text player.initials ++ ")" ]
        , td [] [ button [ onClick (MovePlayerUp player.id), class "btn btn-primary" ] [ text "▲"] ]
        , td [] [ button [ onClick (MovePlayerDown player.id), class "btn btn-primary" ] [ text "▼"] ]
        , td [] [ button [ onClick (DeletePlayer player.id), class "btn btn-danger" ] [ text "✖"] ]
        ]
  in
    [ table [ class "table" ] (List.map player_edit_row l) ]

render_game : AppState -> Maybe Modal -> List (Html Action)
render_game state modal =
  [ ul [ class "nav bg-primary text-white" ]
    [ li [ class "nav-item" ] [ a [ onClick GoHome, class "nav-link" ] [ text "Home" ] ]
    , li [ class "nav-item" ] [ a [ onClick EndGame, class "nav-link" ] [ text "End Game" ] ]
    ]
  , render_current_player_name state.game state.players
  , render_hits <| Game.hits state.game
  , div [ class "board" ] 
    [ S.svg [SA.width "100%", SA.height "100%", SA.viewBox "0 0 100 100"] render_board
    ]
  , render_scores state.players state.game
  ] ++ render_modal modal

render_current_player_name : GameState -> List Player -> Html msg
render_current_player_name gs l = 
  div [ class "container text-center" ] [ text <| append_to_name l " is throwing." <| Game.current_player_id gs ]

render_modal : Maybe Modal -> List (Html Action)
render_modal modal =
  let
    confirm_finish_modal =
      [ div [ class "modal-backdrop show" ] []
      , div [ class "modal", style "display" "block" ]
        [ div [ class "modal-dialog-centered" ] 
          [ div [ class "modal-content" ]
            [ div [ class "modal-header text-center" ] 
              [ div [ class "modal-title w-100" ] [ h1 [] [ text "Finish Turn" ] ] ]
            , div [ class "modal-body"]
              [ div [ class "row text-center" ]
                [ div [ class "col" ] [ button [ class "btn btn-primary", onClick FinishTurn ] [ text "Finish Turn" ] ]
                , div [ class "col" ] [ button [ class "btn btn-danger", onClick CancelFinishTurn ] [ text "Cancel" ] ]
                ]
              ]
            ]
          ]   
        ]
      ]
    number_hit_buttons s d t = 
      [ div [ class "row text-center" ] 
        [ div [ class "col" ] [ button [ class "btn btn-secondary", onClick <| TossModalSelect s ] [ text "Single" ] ] ]
      , div [ class "row text-center" ]
        [ div [ class "col" ] [ button [ class "btn btn-success", onClick <| TossModalSelect d ] [ text "Double" ] ]
        , div [ class "col" ] [ button [ class "btn btn-danger", onClick <| TossModalSelect t ] [ text "Triple" ] ]
        ]
      , div [ class "row text-center" ]
        [ div [ class "col" ] [ button [ class "btn btn-warning", onClick <| TossModalCancel ] [ text "Cancel" ] ] ]
      ]
    subhit_modal h =
      [ div [ class "modal-backdrop show" ] []
      , div [ class "modal", style "display" "block" ]
        [ div [ class "modal-dialog-centered" ] 
          [ div [ class "modal-content" ]
            [ div [ class "modal-header text-center" ] 
              [ div [ class "modal-title w-100" ] [ h1 [] [ text <| short_hit_text h ] ] ]
            , div [ class "modal-body"] <|
              case h of
                HitBullseye -> 
                  [ div [ class "row text-center" ]
                    [ div [ class "col" ] [ button [ class "btn btn-primary", onClick <| TossModalSelect HitBullseye ] [ text "Single" ] ]
                    , div [ class "col" ] [ button [ class "btn btn-danger", onClick <| TossModalSelect HitDoubleBullseye ] [ text "Double" ] ]
                    ]
                  , div [ class "row text-center" ]
                    [ div [ class "col" ] [ button [ class "btn btn-warning", onClick <| TossModalCancel ] [ text "Cancel" ] ] ]
                  ]
                HitDoubleBullseye -> 
                  [ div [ class "row text-center" ]
                    [ div [ class "col" ] [ button [ class "btn btn-primary", onClick <| TossModalSelect HitBullseye ] [ text "Single" ] ]
                    , div [ class "col" ] [ button [ class "btn btn-danger", onClick <| TossModalSelect HitDoubleBullseye ] [ text "Double" ] ]
                    ]
                  , div [ class "row text-center" ]
                    [ div [ class "col" ] [ button [ class "btn btn-warning", onClick <| TossModalCancel ] [ text "Cancel" ] ] ]
                  ]
                Hit1 _ -> number_hit_buttons (Hit1 SingleHit) (Hit1 DoubleHit) (Hit1 TripleHit)
                Hit2 _ -> number_hit_buttons (Hit2 SingleHit) (Hit2 DoubleHit) (Hit2 TripleHit)
                Hit3 _ -> number_hit_buttons (Hit3 SingleHit) (Hit3 DoubleHit) (Hit3 TripleHit)
                Hit4 _ -> number_hit_buttons (Hit4 SingleHit) (Hit4 DoubleHit) (Hit4 TripleHit)
                Hit5 _ -> number_hit_buttons (Hit5 SingleHit) (Hit5 DoubleHit) (Hit5 TripleHit)
                Hit6 _ -> number_hit_buttons (Hit6 SingleHit) (Hit6 DoubleHit) (Hit6 TripleHit)
                Hit7 _ -> number_hit_buttons (Hit7 SingleHit) (Hit7 DoubleHit) (Hit7 TripleHit)
                Hit8 _ -> number_hit_buttons (Hit8 SingleHit) (Hit8 DoubleHit) (Hit8 TripleHit)
                Hit9 _ -> number_hit_buttons (Hit9 SingleHit) (Hit9 DoubleHit) (Hit9 TripleHit)
                Hit10 _ -> number_hit_buttons (Hit10 SingleHit) (Hit10 DoubleHit) (Hit10 TripleHit)
                Hit11 _ -> number_hit_buttons (Hit11 SingleHit) (Hit11 DoubleHit) (Hit11 TripleHit)
                Hit12 _ -> number_hit_buttons (Hit12 SingleHit) (Hit12 DoubleHit) (Hit12 TripleHit)
                Hit13 _ -> number_hit_buttons (Hit13 SingleHit) (Hit13 DoubleHit) (Hit13 TripleHit)
                Hit14 _ -> number_hit_buttons (Hit14 SingleHit) (Hit14 DoubleHit) (Hit14 TripleHit)
                Hit15 _ -> number_hit_buttons (Hit15 SingleHit) (Hit15 DoubleHit) (Hit15 TripleHit)
                Hit16 _ -> number_hit_buttons (Hit16 SingleHit) (Hit16 DoubleHit) (Hit16 TripleHit)
                Hit17 _ -> number_hit_buttons (Hit17 SingleHit) (Hit17 DoubleHit) (Hit17 TripleHit)
                Hit18 _ -> number_hit_buttons (Hit18 SingleHit) (Hit18 DoubleHit) (Hit18 TripleHit)
                Hit19 _ -> number_hit_buttons (Hit19 SingleHit) (Hit19 DoubleHit) (Hit19 TripleHit)
                Hit20 _ -> number_hit_buttons (Hit20 SingleHit) (Hit20 DoubleHit) (Hit20 TripleHit)
                HitMissed ->
                  [ div [ class "row text-center" ]
                    [ div [ class "col" ] [ button [ class "btn btn-primary", onClick <| TossModalSelect HitMissed ] [ text "Missed" ] ] 
                    , div [ class "col" ] [ button [ class "btn btn-warning", onClick <| TossModalCancel ] [ text "Cancel" ] ] 
                    ]
                  ]
            ]        
          ]
        ]
      ]
  in
    case modal of
      (Just (SelectSubHit h)) -> subhit_modal h
      (Just FinalizeTurn) -> confirm_finish_modal
      _ -> []

render_hits : List (Hit) -> Html msg
render_hits hits =
  let
    hit_div hit = div [ class "col-4 text-center" ] [ text (hit_text hit) ]
  in
    if List.length hits == 0
    then
      div [ class "container" ] [ div [ class "row" ] [ div [ class "col" ] [ text "No darts thrown yet." ] ] ]
    else
      div [ class "container" ] [ div [ class "row" ] <| List.map hit_div <| List.reverse hits ]

render_board : List (S.Svg Action)
render_board =
  let
    index_to_hit : Int -> SubHit -> Hit
    index_to_hit id s = case id of
      1 -> Hit1 s
      2 -> Hit2 s
      3 -> Hit3 s
      4 -> Hit4 s
      5 -> Hit5 s
      6 -> Hit6 s
      7 -> Hit7 s
      8 -> Hit8 s
      9 -> Hit9 s
      10 -> Hit10 s
      11 -> Hit11 s
      12 -> Hit12 s
      13 -> Hit13 s
      14 -> Hit14 s
      15 -> Hit15 s
      16 -> Hit16 s
      17 -> Hit17 s
      18 -> Hit18 s
      19 -> Hit19 s
      20 -> Hit20 s      
      _ -> HitMissed
    panels : List ((Float, Float), Int)
    panels = List.indexedMap (\i v -> ((Basics.degrees (toFloat <| (-) 189 <| i * 18), Basics.degrees (toFloat <| (-) 189 <| (i + 1) * 18)), v)) [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5]

    slice : ((Float, Float), Int) -> S.Svg Action
    slice (d, v) = S.path [ SE.onClick (Toss <| index_to_hit v SingleHit) , SA.d (d_from_deg d 43), SA.stroke "white", SA.strokeWidth "0.25", SA.fill "black" ] []

    bull : S.Svg Action
    bull = S.circle [ SE.onClick (Toss HitBullseye), SA.cx "50", SA.cy "50", SA.r "10", SA.stroke "white", SA.strokeWidth "0.25", SA.fill "black" ] []

    miss : List (S.Svg Action)
    miss = 
      [ S.circle [ SE.onClick (Toss HitMissed), SA.cx "92", SA.cy "92", SA.r "7.5", SA.stroke "red", SA.strokeWidth "0.3", SA.fill "orange" ] []
      , S.text_ [ SE.onClick (Toss HitMissed), SA.x "92", SA.y "93", SA.alignmentBaseline "middle", SA.textAnchor "middle", SA.fontSize "5", SA.fill "red" ] [ text "MISS" ] 
      ]

    end_turn : List (S.Svg Action)
    end_turn = 
      [ S.circle [ SE.onClick FinishTurnModal, SA.cx "8", SA.cy "92", SA.r "7.5", SA.stroke "black", SA.strokeWidth "0.3", SA.fill "green" ] []
      , S.text_ [ SE.onClick FinishTurnModal, SA.x "8", SA.y "91", SA.alignmentBaseline "middle", SA.textAnchor "middle", SA.fontSize "4", SA.fill "black" ] [ text "Finish" ] 
      , S.text_ [ SE.onClick FinishTurnModal, SA.x "8", SA.y "95", SA.alignmentBaseline "middle", SA.textAnchor "middle", SA.fontSize "4", SA.fill "black" ] [ text "Turn" ] 
      ]

    start_end_points : (Float, Float) -> Float -> ((Float, Float), (Float, Float))
    start_end_points (s, e) r = ((r * sin s, r * cos s), (r * sin e, r * cos e))

    d_from_deg : (Float, Float) -> Float -> String
    d_from_deg d r = "M 50 50 " ++ (l_from <| start_end_points d r) ++ " Z"

    l_from : ((Float, Float), (Float, Float)) -> String
    l_from ((x0, y0), (x1, y1)) = "L " ++ (String.fromFloat <| 50 + x0) ++ " " ++ (String.fromFloat <| 50 + y0) ++ " L " ++ (String.fromFloat <| 50 + x1) ++ " " ++ (String.fromFloat <| 50 + y1)
    
    number_ring : List (S.Svg msg)
    number_ring = 
      let
        nums : List (Float, Int)
        nums = List.indexedMap (\i v -> (Basics.degrees (toFloat <| (-) 180 <| i * 18), v)) [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5]

        point : Float -> Float -> (Float, Float)
        point d r = (r * sin d, r * cos d)

        draw_num : (Float, Int) -> S.Svg msg
        draw_num (d, v) = 
          S.text_ (((\(x, y) -> [ SA.x (String.fromFloat (50 + x)), SA.y (String.fromFloat (51 + y)) ]) <| point d 46) ++ [ SA.alignmentBaseline "middle", SA.textAnchor "middle", SA.fontSize "5" ]) [ text <| String.fromInt v ]
      in
        List.map draw_num nums        
  in
    List.map slice panels ++
    [ bull ] ++
    miss ++
    end_turn ++
    number_ring

append_to_name : List Player -> String -> Maybe PlayerID -> String
append_to_name l s mid = 
  let 
    unwrap (PlayerName x) = x
    name id = List.foldr (\p acc -> if p.id == id then unwrap p.name else acc) "?????" l
  in
    case mid of
      Just id -> name id ++ s
      Nothing -> "?????" ++ s

render_scores : List Player -> GameState -> Html msg
render_scores lp g = case g of
  NoGame -> text "No Game"
  Numbers701 _ _ c _ l -> render_numbers lp c l
  Numbers501 _ _ c _ l -> render_numbers lp c l
  Numbers301 _ _ c _ l -> render_numbers lp c l
  AroundTheClock _ c _ l -> render_atc lp c l
  AroundTheClock180 _ c _ l -> render_atc_180 lp c l
  Baseball _ c _ i l -> render_bbl lp c i l
  ChaseTheDragon _ c _ l -> render_ctd lp c l
  Cricket _ c _ l -> render_ckt lp c l

player_initials : List Player -> PlayerID -> PlayerInitials
player_initials l pid = List.foldr (\p acc -> if pid == p.id then p.initials else acc) (PlayerInitials "??") l

render_numbers : List Player -> Int -> List (PlayerID, NumbersScore) -> Html msg
render_numbers lp c l = 
  let
    row i (pid, NumbersScore (Score s)) =
      tr (if i == c then [ class "table-info" ] else [] )
        [ td [] [ text <| (\(PlayerInitials x) -> x) <| player_initials lp pid ] 
        , td [] [ text <| String.fromInt s ] 
        ]
  in
    table [ class "table" ] (List.indexedMap row l)

render_atc : List Player -> Int -> List (PlayerID, AroundTheClockScore) -> Html msg
render_atc lp c l = 
  let 
    hits_to_string hl = String.join " " <| List.foldl (\h acc -> hit_text h::acc) [] hl
    row i (pid, AroundTheClockScore hl) =
      tr (if i == c then [ class "table-info" ] else [] )
        <| ( td [] [ text <| (\(PlayerInitials x) -> x) <| player_initials lp pid ])
        :: [ td [] [ text <| hits_to_string hl ] ]
  in
    table [ class "table" ] (List.indexedMap row l)

render_atc_180 : List Player -> Int -> List (PlayerID, AroundTheClock180Score) -> Html msg
render_atc_180 lp c l = 
  let 
    unpack (Score s) = s
    sum_scores sl = List.foldr (\(Score a) (Score b) -> Score (a + b)) (Score 0) sl
    hits_to_string hl = String.join " " <| List.foldl (\h acc -> hit_text h::acc) [] hl
    row i (pid, AroundTheClock180Score hsl) =
      tr (if i == c then [ class "table-info" ] else [] )
        <| ( td [] [ text <| (\(PlayerInitials x) -> x) <| player_initials lp pid ])
        :: ( td [] [ text <| String.fromInt <| unpack <| sum_scores <| List.map Tuple.second hsl ])
        :: [ td [] [ text <| hits_to_string <| List.map Tuple.first hsl ] ]
  in
    table [ class "table" ] (List.indexedMap row l)

render_bbl : List Player -> Int -> Inning -> List (PlayerID, BaseballScore) -> Html msg
render_bbl lp c (Inning i) l = 
  let 
    hdr = [ tr [] (
      [ td [] [ text "IN" ] ] ++
      (List.indexedMap (\x (pid, _) -> td (if c == x then [ class "table-info" ] else []) [ text <| (\(PlayerInitials y) -> y) <| player_initials lp pid ] ) l)
      ) ]

    inning_score x (BaseballScore s) = String.fromInt <| List.foldl (\(Inning y, _, Score z) acc -> if y == x then z else acc) 0 s
    player_inning x (_, s) = td [] [ text <| inning_score x s ]
    inning x = tr [] <| 
      [ (td (if i == x then [ class "table-info" ] else []) [ text <| String.fromInt x ]) ] ++ List.map (player_inning x) l
    innings = List.map inning <| List.range 1 (max 9 i)
    sum (BaseballScore sl) = List.foldr (\(_, _, (Score z)) acc -> acc + z) 0 sl
    totals = [ tr [] <| [ td [] [ text "T" ] ] ++ List.map (\(_, s) -> td [] [ text <| String.fromInt (sum s) ]) l ]
  in
    table [ class "table" ] (hdr ++ innings ++ totals)

render_ctd : List Player -> Int -> List (PlayerID, ChaseTheDragonScore) -> Html msg
render_ctd lp c l = 
  let 
    hits_to_string hl = String.join " " <| List.foldl (\h acc -> hit_text h::acc) [] hl
    row i (pid, ChaseTheDragonScore hl) =
      tr (if i == c then [ class "table-info" ] else [] )
        <| ( td [] [ text <| (\(PlayerInitials x) -> x) <| player_initials lp pid ])
        :: [ td [] [ text <| hits_to_string hl ] ]
  in
    table [ class "table" ] (List.indexedMap row l)

render_ckt : List Player -> Int -> List (PlayerID, CricketScore) -> Html msg
render_ckt lp c l = 
  let 
    hdr = 
      [ tr [] 
        [ td [] []
        , td [] [ text "\u{2473}" ]
        , td [] [ text "\u{2472}" ]
        , td [] [ text "\u{2471}" ]
        , td [] [ text "\u{2470}" ]
        , td [] [ text "\u{246F}" ]
        , td [] [ text "\u{246E}" ]
        , td [] [ text "\u{24B7}" ]
        , td [] []
        ]
      ]
    slice x = case x of
      Slice0 -> ""
      Slice1 -> "\u{002D}"
      Slice2 -> "\u{002B}"
      SliceOpen -> "\u{2295}"
      SliceClosed -> "\u{229B}"
    extract (Score s) = String.fromInt s
    row i (pid, s) = tr (if i == c then [ class "table-info" ] else [] )
      [ td [] [ text <| (\(PlayerInitials x) -> x) <| player_initials lp pid ]
      , td [] [ text <| slice s.slice20 ]
      , td [] [ text <| slice s.slice19 ]
      , td [] [ text <| slice s.slice18 ]
      , td [] [ text <| slice s.slice17 ]
      , td [] [ text <| slice s.slice16 ]
      , td [] [ text <| slice s.slice15 ]
      , td [] [ text <| slice s.sliceBull ]
      , td [] [ text <| extract s.score]
      ]
      
  in
    table [ class "table" ] <| hdr ++ List.indexedMap row l
