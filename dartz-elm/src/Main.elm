module Main exposing (main)

import Browser
import Html exposing (Html, div, label, nav, span, text, option, button, select, input, tr, td, table)
import Html.Attributes exposing (class, placeholder, selected, value)
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
    new_player i (NewPlayerName n) = { name = PlayerName n, hits = PlayerHits [], score = NoScore, index = i }

    add_player l n =
      let
        empty (NewPlayerName s) = String.isEmpty <| String.trim s
      in
        if empty n 
        then l 
        else new_player (PlayerIndex <| 1 + List.length l) n :: l

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
        StartGame -> { state | screen = PlayGame, currentPlayer = 0, currentTurn = [], playerData = reset_scores state.game state.playerData, playing = True }
        ResumeGame -> { state | screen = PlayGame }
        EndGame -> { state | screen = Home, currentPlayer = 0, currentTurn = [], playerData = reset_scores state.game state.playerData, playing = False }
        GameSelected mode -> { state | game = mode }
        NewPlayerInput p -> { state | screen = EditPlayers p }
        NewPlayerCommit p -> { state | playerData = add_player state.playerData p, screen = EditPlayers (NewPlayerName "") }
        DeletePlayer i -> { state | playerData = delete_player state.playerData i }
        Toss h -> { state | currentTurn = List.take 3 <| h :: state.currentTurn }
        MovePlayerUp i -> { state | playerData = move_player_up state.playerData i }
        MovePlayerDown i -> { state | playerData = move_player_down state.playerData i }
    save_state = store_state << JE.encode 0 <| encode_app_state new_state
  in (new_state, save_state)


view : AppState -> Html Action
view state =
  let 
    render = 
      case state.screen of
        Home -> render_home state
        EditPlayers np -> render_edit_players state.playerData np
        SelectGame -> render_select_game state.game
        PlayGame -> render_game state
  in
    div [] render
    

render_home : AppState -> List (Html Action)
render_home state =
  let
    start_game =  
      if List.length state.playerData > 0 && state.game /= NoGame && state.playing == False
      then [ button [ onClick StartGame, class "btn btn-primary" ] [ text "Start Game" ] ]
      else []
    resume_game =  
      if List.length state.playerData > 0 && state.game /= NoGame && state.playing == True
      then [ button [ onClick ResumeGame, class "btn btn-primary" ] [ text "Resume Game" ] ]
      else []
  in
    [ nav [ class "navbar navbar-dark bg-primary" ] <|
      start_game ++
      resume_game ++
      [ button [ onClick GoEditPlayers, class "btn btn-primary" ] [ text "Edit Players" ]
      , button [ onClick GoSelectGame, class "btn btn-primary" ] [ text "Select Game" ]
      ]
    , div [] 
      [ text "Selected Game: "
      , game_name state.game
      ]    
    ]

render_select_game : GameMode -> List (Html Action)
render_select_game mode =
  [ nav [ class "navbar navbar-dark bg-primary" ]
    [ button [ onClick GoHome, class "btn btn-primary" ] [ text "Home" ]
    , button [ onClick GoEditPlayers, class "btn btn-primary" ] [ text "Edit Players" ]            
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
  [ nav [ class "navbar navbar-dark bg-primary" ]
    [ button [ onClick GoHome, class "btn btn-primary" ] [ text "Home" ]
    , button [ onClick GoSelectGame, class "btn btn-primary" ] [ text "Select Game" ]
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

render_game : AppState -> List (Html Action)
render_game state =
  [ nav [ class "navbar navbar-dark bg-primary" ]
    [ button [ onClick GoHome, class "btn btn-primary" ] [ text "Home" ]
    , button [ onClick EndGame, class "btn btn-primary" ] [ text "End Game" ]
    ]
  , div [ class "board" ] 
    [ S.svg [SA.width "100%", SA.height "100%", SA.viewBox "0 0 100 100"] render_board
    ]
  , render_hits state.currentTurn
  ]

render_hits : List (Hit) -> Html msg
render_hits hits =
  let
    hit_div hit = div [ class "col-4" ] [ text (hit_text hit) ]
  in
    div [ class "row"] <| List.map hit_div <| List.reverse hits

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

    double_slice : ((Float, Float), Int) -> S.Svg Action
    double_slice (d, v) = S.path [ SE.onClick (Toss <| index_to_hit v DoubleHit) , SA.d (d_from_deg d 45), SA.stroke "white", SA.strokeWidth "0.25", SA.fill "green" ] []

    outer_single_slice : ((Float, Float), Int) -> S.Svg Action
    outer_single_slice (d, v) = S.path [ SE.onClick (Toss <| index_to_hit v SingleHit), SA.d (d_from_deg d 38), SA.stroke "white", SA.strokeWidth "0.25", SA.fill "black" ] []

    triple_slice : ((Float, Float), Int) -> S.Svg Action
    triple_slice (d, v) = S.path [ SE.onClick (Toss <| index_to_hit v TripleHit), SA.d (d_from_deg d 29), SA.stroke "white", SA.strokeWidth "0.25", SA.fill "green" ] []

    inner_single_slice : ((Float, Float), Int) -> S.Svg Action
    inner_single_slice (d, v) = S.path [ SE.onClick (Toss <| index_to_hit v SingleHit), SA.d (d_from_deg d 21), SA.stroke "white", SA.strokeWidth "0.25", SA.fill "black" ] []

    bull : S.Svg Action
    bull = S.circle [ SE.onClick (Toss HitBullseye), SA.cx "50", SA.cy "50", SA.r "10", SA.stroke "white", SA.strokeWidth "0.25", SA.fill "green" ] []

    double_bull : S.Svg Action
    double_bull = S.circle [ SE.onClick (Toss HitDoubleBullseye), SA.cx "50", SA.cy "50", SA.r "5", SA.stroke "white", SA.strokeWidth "0.25", SA.fill "red" ] []

    miss : List (S.Svg Action)
    miss = 
      [ S.circle [ SE.onClick (Toss HitMissed), SA.cx "92", SA.cy "92", SA.r "8", SA.stroke "red", SA.strokeWidth "0.3", SA.fill "orange" ] []
      , S.text_ [ SE.onClick (Toss HitMissed), SA.x "92", SA.y "93", SA.alignmentBaseline "middle", SA.textAnchor "middle", SA.fontSize "5", SA.fill "red" ] [ text "MISS" ] 
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
          S.text_ (((\(x, y) -> [ SA.x (String.fromFloat (50 + x)), SA.y (String.fromFloat (51 + y)) ]) <| point d 48) ++ [ SA.alignmentBaseline "middle", SA.textAnchor "middle", SA.fontSize "5" ]) [ text <| String.fromInt v ]
      in
        List.map draw_num nums        
  in
    List.map double_slice panels ++
    List.map outer_single_slice panels ++
    List.map triple_slice panels ++
    List.map inner_single_slice panels ++
    [ bull, double_bull] ++
    miss ++
    number_ring
