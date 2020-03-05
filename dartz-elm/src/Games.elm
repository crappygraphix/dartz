module Games exposing (finalize_turn)

import Types exposing (..)

finalize_turn : AppState -> AppState
finalize_turn state = 
  case state.game of
    NoGame -> state
    Numbers701 i o -> numbers state 701 i o
    Numbers501 i o -> numbers state 501 i o
    Numbers301 i o -> numbers state 301 i o
    AroundTheClock v -> around_the_clock state v
    AroundTheClock180 v -> around_the_clock_180 state v
    Baseball v -> baseball state v
    ChaseTheDragon v -> chase_the_dragon state v
    Cricket v -> cricket state v
    
next_player : List Player -> Int -> Int
next_player l i = 
  if i == List.length l - 1
  then 0
  else i + 1

increment_player : AppState -> AppState
increment_player state = { state | currentPlayer = next_player state.playerData state.currentPlayer }

current_player : AppState -> Maybe Player
current_player state = List.head <| List.drop state.currentPlayer state.playerData

numbers : AppState -> Int -> NumbersInVariation -> NumbersOutVariation -> AppState
numbers state _ _ _ = 
  let
    apply_score = state
  in
    increment_player <| apply_score

around_the_clock : AppState -> AroundTheClockVariation -> AppState
around_the_clock state _ = 
  let
    apply_score = state
  in
    increment_player <| apply_score

around_the_clock_180 : AppState -> AroundTheClock180Variation -> AppState
around_the_clock_180 state _ = 
  let
    apply_score = state
  in
    increment_player <| apply_score

baseball : AppState -> BaseballVariation -> AppState
baseball state _ = 
  let
    apply_score = state
  in
    increment_player <| apply_score

chase_the_dragon : AppState -> DragonVariation -> AppState
chase_the_dragon state _ = 
  let
    apply_score = state
  in
    increment_player <| apply_score

cricket : AppState -> CricketVariation -> AppState
cricket state _ = 
  let
    apply_score = state
  in
    increment_player <| apply_score
