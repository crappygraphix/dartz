module Main exposing (main)

import Browser
import Html exposing (Html, a, div, label, ul, li, span, text, option, button, select, input, tr, td, table)
import Html.Attributes exposing (class, placeholder, style, selected, value, href)
import Html.Events exposing (onClick, onInput)
import Json.Decode as JD
import Json.Encode as JE
import Svg as S
import Svg.Attributes as SA
import Svg.Events as SE

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

game_list : List GameMode
game_list = 
  [ NoGame
  , Numbers301 BasicIn BasicOut
  , Numbers501 BasicIn BasicOut
  , Numbers701 BasicIn BasicOut
  , Cricket BasicCricket
  , Baseball BasicBaseball
  , AroundTheClock NoBullOut
  , AroundTheClock180 DoubleBonus
  , ChaseTheDragon BasicDragon
  ]

clean_state : AppState
clean_state = 
  { playerData = []
  , game = NoGame
  , screen = Home
  , playing = False
  , currentPlayer = 0
  , currentTurn = []
  }

init : JE.Value -> (AppState, Cmd Action)
init s = case JD.decodeValue app_state_decoder s of
  Err _ -> (clean_state, Cmd.none) -- TODO: Surface Error
  Ok state -> (state, Cmd.none)
  
update : Action -> AppState -> (AppState, Cmd Action)
update action state = 
  let
    new_score mode = 
      case mode of
        NoGame -> NoScore
        Numbers701 _ _ -> NumbersScore (Score 0)
        Numbers501 _ _ -> NumbersScore (Score 0)
        Numbers301 _ _ -> NumbersScore (Score 0)
        AroundTheClock _ -> AroundTheClockScore []
        AroundTheClock180 _ -> AroundTheClock180Score []
        Baseball _ -> List.range 1 9 |> List.map (\i -> (Inning i, Score 0)) |> BaseballScore
        ChaseTheDragon _ -> ChaseTheDragonScore []
        Cricket _ -> CricketScore (Score 0, [])

    new_player i (NewPlayerName n) mode = { name = PlayerName n, hits = PlayerHits [], score = new_score mode, index = i }

    add_player l n =
      let
        empty (NewPlayerName s) = String.isEmpty <| String.trim s
      in
        if empty n 
        then l 
        else new_player (PlayerIndex <| 1 + List.length l) n state.game :: l

    clear_score mode = case mode of
      NoGame -> NoScore
      Numbers701 _ _ -> NumbersScore (Score 0)
      Numbers501 _ _ -> NumbersScore (Score 0)
      Numbers301 _ _ -> NumbersScore (Score 0)
      AroundTheClock _ -> AroundTheClockScore []
      AroundTheClock180 _ -> AroundTheClock180Score []
      Baseball _ -> BaseballScore 
         [ (Inning 0, Score 0)
         , (Inning 1, Score 0)
         , (Inning 2, Score 0)
         , (Inning 3, Score 0)
         , (Inning 4, Score 0)
         , (Inning 5, Score 0)
         , (Inning 6, Score 0)
         , (Inning 7, Score 0)
         , (Inning 8, Score 0)
         , (Inning 9, Score 0)
         ]
      ChaseTheDragon _ -> ChaseTheDragonScore []
      Cricket _ -> CricketScore (Score 0, [])

    reset_score mode p = { p | score = clear_score mode }

    reset_scores mode l = List.map (reset_score mode) l

    move_player_up l i = 
      let
        to_the_left p acc = 
          if p.index == i
          then (List.take (List.length acc - 1) acc) ++ [ p ] ++ (List.drop (List.length acc - 1) acc)
          else acc ++ [ p ]
      in
        List.foldl to_the_left [] l

    move_player_down l i = List.reverse <| move_player_up (List.reverse l) i

    new_state = 
      case action of
        GoHome -> { state | screen = Home }
        GoEditPlayers -> { state | screen = EditPlayers (NewPlayerName "") }
        GoSelectGame -> { state | screen = SelectGame }
        StartGame -> { state | screen = PlayGame Nothing, currentPlayer = 0, currentTurn = [], playerData = reset_scores state.game state.playerData, playing = True }
        ResumeGame -> { state | screen = PlayGame Nothing }
        EndGame -> { state | screen = Home, currentPlayer = 0, currentTurn = [], playerData = reset_scores state.game state.playerData, playing = False }
        GameSelected mode -> { state | game = mode }
        NewPlayerInput p -> { state | screen = EditPlayers p }
        NewPlayerCommit p -> { state | playerData = add_player state.playerData p, screen = EditPlayers (NewPlayerName "") }
        DeletePlayer i -> { state | playerData = delete_player state.playerData i }
        Toss h -> { state | screen = PlayGame (Just <| SelectSubHit h) }
        TossModalSelect h -> { state | screen = PlayGame Nothing, currentTurn = List.take 3 <| h :: state.currentTurn }
        TossModalCancel -> { state | screen = PlayGame Nothing }
        FinishTurn -> finalize_turn state
        MovePlayerUp i -> { state | playerData = move_player_up state.playerData i }
        MovePlayerDown i -> { state | playerData = move_player_down state.playerData i }
    save_state = store_state << JE.encode 0 <| encode_app_state new_state
  in (new_state, save_state)

finalize_turn : AppState -> AppState
finalize_turn s = s

view : AppState -> Html Action
view state =
  let 
    block_scroll modal =
      case modal of
         Just _ -> div [ class "modal-open" ]
         Nothing -> div []
    render = 
      case state.screen of
        Home -> div [] <| render_home state
        EditPlayers np -> div [] <| render_edit_players state.playerData np
        SelectGame -> div [] <| render_select_game state.game
        PlayGame modal -> block_scroll modal <| render_game state modal
  in
    render    

render_home : AppState -> List (Html Action)
render_home state =
  let
    start_game =  
      if List.length state.playerData > 0 && state.game /= NoGame && state.playing == False
      then [ li [ class "nav-item" ] [ a [ onClick StartGame, class "nav-link" ] [ text "Start Game" ] ] ]
      else []
    resume_game =  
      if List.length state.playerData > 0 && state.game /= NoGame && state.playing == True
      then [ li [ class "nav-item" ] [ a [ onClick ResumeGame, class "nav-link" ] [ text "Resume" ] ] ]
      else []
    select_game =
      if state.playing == False
      then [ li [ class "nav-item" ] [ a [ onClick GoSelectGame, class "nav-link" ] [ text "Select Game" ] ] ]
      else []
  in
    [ ul [ class "nav bg-primary text-white" ] <|
      start_game ++
      resume_game ++
      [ li [ class "nav-item" ] [ a [ onClick GoEditPlayers, class "nav-link" ] [ text "Edit Players" ] ] ] ++
      select_game
    , div [] 
      [ text "Selected Game: "
      , game_name state.game
      ]    
    ]

render_select_game : GameMode -> List (Html Action)
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

mode_selector : GameMode -> List (Html Action)
mode_selector mode = 
  [ div [] 
    [ select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
      (List.map (game_to_option mode) game_list) 
    ]
  ]

variant_selector : GameMode -> List (Html Action)
variant_selector mode = 
  let is_selected a b = if a == b then [ selected True ] else []
  in case mode of 
    NoGame -> []
    Numbers301 vi vo -> 
      [ div []
        [ div [] [ text "In Rule" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (Numbers301 BasicIn vo) ] ++ is_selected vi BasicIn) [ text (numbers_variation_in_text BasicIn) ]
          , option ([ value <| game_to_id (Numbers301 DoubleIn vo) ] ++ is_selected vi DoubleIn) [ text (numbers_variation_in_text DoubleIn) ]
          , option ([ value <| game_to_id (Numbers301 TripleIn vo) ] ++ is_selected vi TripleIn) [ text (numbers_variation_in_text TripleIn) ]
          ]
        ]
      , div []
        [ div [] [ text "Out Rule" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (Numbers301 vi BasicOut) ] ++ is_selected vo BasicOut) [ text (numbers_variation_out_text BasicOut) ]
          , option ([ value <| game_to_id (Numbers301 vi DoubleOut) ] ++ is_selected vo DoubleOut) [ text (numbers_variation_out_text DoubleOut) ]
          , option ([ value <| game_to_id (Numbers301 vi TripleOut) ] ++ is_selected vo TripleOut) [ text (numbers_variation_out_text TripleOut) ]
          ]
        ]
      ]
    Numbers501 vi vo -> 
      [ div []
        [ div [] [ text "In Rule" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (Numbers501 BasicIn vo) ] ++ is_selected vi BasicIn) [ text (numbers_variation_in_text BasicIn) ]
          , option ([ value <| game_to_id (Numbers501 DoubleIn vo) ] ++ is_selected vi DoubleIn) [ text (numbers_variation_in_text DoubleIn) ]
          , option ([ value <| game_to_id (Numbers501 TripleIn vo) ] ++ is_selected vi TripleIn) [ text (numbers_variation_in_text TripleIn) ]
          ]
        ]
      , div []
        [ div [] [ text "Out Rule" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (Numbers501 vi BasicOut) ] ++ is_selected vo BasicOut) [ text (numbers_variation_out_text BasicOut) ]
          , option ([ value <| game_to_id (Numbers501 vi DoubleOut) ] ++ is_selected vo DoubleOut) [ text (numbers_variation_out_text DoubleOut) ]
          , option ([ value <| game_to_id (Numbers501 vi TripleOut) ] ++ is_selected vo TripleOut) [ text (numbers_variation_out_text TripleOut) ]
          ]
        ]
      ]
    Numbers701 vi vo -> 
      [ div []
        [ div [] [ text "In Rule" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (Numbers701 BasicIn vo) ] ++ is_selected vi BasicIn) [ text (numbers_variation_in_text BasicIn) ]
          , option ([ value <| game_to_id (Numbers701 DoubleIn vo) ] ++ is_selected vi DoubleIn) [ text (numbers_variation_in_text DoubleIn) ]
          , option ([ value <| game_to_id (Numbers701 TripleIn vo) ] ++ is_selected vi TripleIn) [ text (numbers_variation_in_text TripleIn) ]
          ]
        ]
      , div []
        [ div [] [ text "Out Rule" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (Numbers701 vi BasicOut) ] ++ is_selected vo BasicOut) [ text (numbers_variation_out_text BasicOut) ]
          , option ([ value <| game_to_id (Numbers701 vi DoubleOut) ] ++ is_selected vo DoubleOut) [ text (numbers_variation_out_text DoubleOut) ]
          , option ([ value <| game_to_id (Numbers701 vi TripleOut) ] ++ is_selected vo TripleOut) [ text (numbers_variation_out_text TripleOut) ]
          ]
        ]
      ]
    AroundTheClock v ->
      [ div []
        [ div [] [ text "Variation" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (AroundTheClock NoBullOut) ] ++ is_selected v NoBullOut) [ text (around_the_clock_variation_text NoBullOut) ]
          , option ([ value <| game_to_id (AroundTheClock AnyBullOut) ] ++ is_selected v AnyBullOut) [ text (around_the_clock_variation_text AnyBullOut) ]
          , option ([ value <| game_to_id (AroundTheClock SplitBullOut) ] ++ is_selected v SplitBullOut) [ text (around_the_clock_variation_text SplitBullOut) ]
          ]
        ]
      ]
    AroundTheClock180 v ->
      [ div []
        [ div [] [ text "Variation" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (AroundTheClock180 DoubleBonus)] ++ is_selected v DoubleBonus) [ text (around_the_clock_180_variation_text DoubleBonus) ]
          , option ([ value <| game_to_id (AroundTheClock180 TripleBonus)] ++ is_selected v TripleBonus) [ text (around_the_clock_180_variation_text TripleBonus) ]
          ]
        ]
      ]
    Baseball v ->
      [ div []
        [ div [] [ text "Variation" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (Baseball BasicBaseball)] ++ is_selected v BasicBaseball) [ text (baseball_variation_text BasicBaseball) ]
          , option ([ value <| game_to_id (Baseball SeventhInningCatch)] ++ is_selected v SeventhInningCatch) [ text (baseball_variation_text SeventhInningCatch) ]
          ]
        ]
      ]
    ChaseTheDragon v ->
      [ div []
        [ div [] [ text "Variation" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (ChaseTheDragon BasicDragon)] ++ is_selected v BasicDragon) [ text (dragon_variation_text BasicDragon) ]
          , option ([ value <| game_to_id (ChaseTheDragon TripleHeadedDragon)] ++ is_selected v TripleHeadedDragon) [ text (dragon_variation_text TripleHeadedDragon) ]
          ]
        ]
      ]
    Cricket v ->
      [ div []
        [ div [] [ text "Variation" ]
        , select [ onInput (GameSelected << id_to_game), class "custom-select" ] 
          [ option ([ value <| game_to_id (Cricket BasicCricket)] ++ is_selected v BasicCricket) [ text (cricket_variation_text BasicCricket) ]
          , option ([ value <| game_to_id (Cricket GolfCricket)] ++ is_selected v GolfCricket) [ text (cricket_variation_text GolfCricket) ]
          ]
        ]
      ]

render_edit_players : List Player -> NewPlayerName -> List (Html Action)
render_edit_players players np =
  [ ul [ class "nav bg-primary text-white" ]
    [ li [ class "nav-item" ] [ a [ onClick GoHome, class "nav-link" ] [ text "Home" ] ]
    , li [ class "nav-item" ] [ a [ onClick GoSelectGame, class "nav-link" ] [ text "Select Game" ] ]
    ]
  ] ++
  (add_player_form np) ++
  [ div []
    [ text "Players" ]
  ] ++
  (list_editable_players players)

add_player_form : NewPlayerName -> List (Html Action)
add_player_form (NewPlayerName t) = 
  [ div [ class "form-group" ] 
    [ label [] [ text "Player Name" ]
    , input [ value t, placeholder "Name", onInput (NewPlayerInput << NewPlayerName), class "form-control" ] []
    ]
  , button [ onClick (NewPlayerCommit <| NewPlayerName t), class "btn btn-primary" ] [ text "Add Player" ]
  ]

delete_player : List Player -> PlayerIndex -> List Player
delete_player l i = List.filter (\p -> p.index /= i) l

list_editable_players : List Player -> List (Html Action)
list_editable_players l = 
  let
    player_edit_row player = 
      tr [] 
        [ td [] [ text <| player_name_text player.name ]
        , td [] [ button [ onClick (MovePlayerUp player.index), class "btn btn-primary" ] [ text "▲"] ]
        , td [] [ button [ onClick (MovePlayerDown player.index), class "btn btn-primary" ] [ text "▼"] ]
        , td [] [ button [ onClick (DeletePlayer player.index), class "btn btn-danger" ] [ text "✖"] ]
        ]
  in
    [ table [ class "table" ] (List.map player_edit_row l) ]

render_game : AppState -> Maybe Modal -> List (Html Action)
render_game state modal =
  [ ul [ class "nav bg-primary text-white" ]
    [ li [ class "nav-item" ] [ a [ onClick GoHome, class "nav-link" ] [ text "Home" ] ]
    , li [ class "nav-item" ] [ a [ onClick EndGame, class "nav-link" ] [ text "End Game" ] ]
    ]
  , render_current_player_name state.currentPlayer state.playerData
  , render_hits state.currentTurn
  , div [ class "board" ] 
    [ S.svg [SA.width "100%", SA.height "100%", SA.viewBox "0 0 100 100"] render_board
    ]
  ] ++ render_modal modal

render_current_player_name : Int -> List Player -> Html msg
render_current_player_name i l = 
  let
    find_name = case List.head <| List.drop i l of
       Nothing -> "????? is throwing."
       Just p -> player_name_text p.name ++ " is throwing."
  in
    div [] [ text find_name ]

render_modal : Maybe Modal -> List (Html Action)
render_modal modal =
  let
    number_hit_buttons s d t = 
      [ div [ class "row text-center" ] 
        [ div [ class "col" ] [ button [ class "btn btn-secondary", onClick <| TossModalSelect s ] [ text "Single" ] ] ]
      , div [ class "row text-center" ]
        [ div [ class "col" ] [ button [ class "btn btn-success", onClick <| TossModalSelect d ] [ text "Double" ] ]
        , div [ class "col" ] [ button [ class "btn btn-danger", onClick <| TossModalSelect d ] [ text "Triple" ] ]
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
              [ div [ class "modal-title w-100" ] [ text <| short_hit_text h ] ]
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
      _ -> []

render_hits : List (Hit) -> Html msg
render_hits hits =
  let
    hit_div hit = div [ class "col-4" ] [ text (hit_text hit) ]
  in
    if List.length hits == 0
    then
      div [ class "row" ] [ div [ class "col" ] [ text "No darts thrown yet." ] ]
    else
      div [ class "row" ] <| List.map hit_div <| List.reverse hits

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
      [ S.circle [ SE.onClick FinishTurn, SA.cx "8", SA.cy "92", SA.r "7.5", SA.stroke "black", SA.strokeWidth "0.3", SA.fill "green" ] []
      , S.text_ [ SE.onClick FinishTurn, SA.x "8", SA.y "91", SA.alignmentBaseline "middle", SA.textAnchor "middle", SA.fontSize "4", SA.fill "black" ] [ text "Finish" ] 
      , S.text_ [ SE.onClick FinishTurn, SA.x "8", SA.y "95", SA.alignmentBaseline "middle", SA.textAnchor "middle", SA.fontSize "4", SA.fill "black" ] [ text "Turn" ] 
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
