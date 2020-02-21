module Main exposing (main)

import Browser
import Html exposing (Html, div, span, text, option, button, select, input, tr, td, table)
import Html.Attributes exposing (class, placeholder, selected, value)
import Html.Events exposing (onClick, onInput)
import Svg as S
import Svg.Attributes as SA
import Svg.Events as SE

main : Program () AppState Action
main = Browser.sandbox { init = init, update = update, view = view }

type SubHit = SingleHit | DoubleHit | TripleHit

sub_hit_text : SubHit -> String
sub_hit_text s = case s of
   SingleHit -> "Single"
   DoubleHit -> "Double"
   TripleHit -> "Triple"

type Hit
  = HitMissed
  | Hit1 SubHit
  | Hit2 SubHit
  | Hit3 SubHit
  | Hit4 SubHit
  | Hit5 SubHit
  | Hit6 SubHit
  | Hit7 SubHit
  | Hit8 SubHit
  | Hit9 SubHit
  | Hit10 SubHit
  | Hit11 SubHit
  | Hit12 SubHit
  | Hit13 SubHit
  | Hit14 SubHit
  | Hit15 SubHit
  | Hit16 SubHit
  | Hit17 SubHit
  | Hit18 SubHit
  | Hit19 SubHit
  | Hit20 SubHit
  | HitBullseye
  | HitDoubleBullseye

hit_text : Hit -> String
hit_text h = case h of
   HitMissed -> "Miss"
   Hit1 s -> sub_hit_text s ++ " " ++ "1"
   Hit2 s -> sub_hit_text s ++ " " ++ "2"
   Hit3 s -> sub_hit_text s ++ " " ++ "3"
   Hit4 s -> sub_hit_text s ++ " " ++ "4"
   Hit5 s -> sub_hit_text s ++ " " ++ "5"
   Hit6 s -> sub_hit_text s ++ " " ++ "6"
   Hit7 s -> sub_hit_text s ++ " " ++ "7"
   Hit8 s -> sub_hit_text s ++ " " ++ "8"
   Hit9 s -> sub_hit_text s ++ " " ++ "9"
   Hit10 s -> sub_hit_text s ++ " " ++ "10"
   Hit11 s -> sub_hit_text s ++ " " ++ "11"
   Hit12 s -> sub_hit_text s ++ " " ++ "12"
   Hit13 s -> sub_hit_text s ++ " " ++ "13"
   Hit14 s -> sub_hit_text s ++ " " ++ "14"
   Hit15 s -> sub_hit_text s ++ " " ++ "15"
   Hit16 s -> sub_hit_text s ++ " " ++ "16"
   Hit17 s -> sub_hit_text s ++ " " ++ "17"
   Hit18 s -> sub_hit_text s ++ " " ++ "18"
   Hit19 s -> sub_hit_text s ++ " " ++ "19"
   Hit20 s -> sub_hit_text s ++ " " ++ "20"
   HitBullseye -> "Bull"
   HitDoubleBullseye -> "Double Bull"

type PlayerName = PlayerName String
player_name_string (PlayerName s) = s
type NewPlayerName = NewPlayerName String
type PlayerHits = PlayerHits (List Hit)
type PlayerIndex = PlayerIndex Int
type Inning = Inning Int
type Score = Score Int
type GameScore 
  = NoScore
  | NumbersScore Score
  | AroundTheClockScore (List Hit) 
  | AroundTheClock180Score (List (Hit, Score))
  | BaseballScore (List (Inning, Score))
  | ChaseTheDragonScore (List Hit)
  | CricketScore (Score, List Hit)

type alias Player =
  { name    : PlayerName
  , hits    : PlayerHits
  , score   : GameScore
  , index   : PlayerIndex
  }

new_player : PlayerIndex -> NewPlayerName -> Player
new_player i (NewPlayerName n) = { name = PlayerName n, hits = PlayerHits [], score = NoScore, index = i }

type alias AppState =
  { playerData : List Player
  , game : GameMode
  , screen : Screen
  , currentPlayer : Int
  , currentTurn : List Hit
  }

type Screen
  = Home
  | EditPlayers NewPlayerName
  | SelectGame
  | PlayGame

type NumbersInVariation = BasicIn | DoubleIn | TripleIn
numbers_variation_in_text v = case v of
  BasicIn -> "Any In"
  DoubleIn -> "Double In"
  TripleIn -> "Triple In"
type NumbersOutVariation = BasicOut | DoubleOut | TripleOut
numbers_variation_out_text v = case v of
  BasicOut -> "Any Out"
  DoubleOut -> "Double Out"
  TripleOut -> "TripleOut"
type AroundTheClockVariation = NoBullOut | AnyBullOut | SplitBullOut
around_the_clock_variation_text v = case v of
  NoBullOut -> "Standard"
  AnyBullOut -> "Bull Out"
  SplitBullOut -> "Split Bull Out"
type AroundTheClock180Variation = DoubleBonus | TripleBonus
around_the_clock_180_variation_text v = case v of
  DoubleBonus -> "Double Bonus"
  TripleBonus -> "Triple Bonus"
type BaseballVariation = BasicBaseball | SeventhInningCatch
baseball_variation_text v = case v of
  BasicBaseball -> "Standard"
  SeventhInningCatch -> "7th Inning Catch"
type DragonVariation = BasicDragon | TripleHeadedDragon
dragon_variation_text v = case v of
  BasicDragon -> "Standard"
  TripleHeadedDragon -> "Triple Headed Dragon"
type CricketVariation = BasicCricket | GolfCricket
cricket_variation_text v = case v of
  BasicCricket -> "Standard"
  GolfCricket -> "Golf"

type GameMode
  = NoGame
  | Numbers701 NumbersInVariation NumbersOutVariation
  | Numbers501 NumbersInVariation NumbersOutVariation
  | Numbers301 NumbersInVariation NumbersOutVariation
  | AroundTheClock AroundTheClockVariation
  | AroundTheClock180 AroundTheClock180Variation
  | Baseball BaseballVariation
  | ChaseTheDragon DragonVariation
  | Cricket CricketVariation

game_name : GameMode -> Html msg
game_name mode =
  case mode of
    NoGame -> span [] [ text "No Game Selected" ]
    Numbers701 vi vo -> span [] [ text "701 : ", text (numbers_variation_in_text vi), text "/", text (numbers_variation_out_text vo)]
    Numbers501 vi vo -> span [] [ text "501 : ", text (numbers_variation_in_text vi), text "/", text (numbers_variation_out_text vo)]      
    Numbers301 vi vo -> span [] [ text "301 : ", text (numbers_variation_in_text vi), text "/", text (numbers_variation_out_text vo)]            
    AroundTheClock v -> span [] [ text "Around the Clock : ", text (around_the_clock_variation_text v)]
    AroundTheClock180 v -> span [] [ text "Around the Clock 180 : ", text (around_the_clock_180_variation_text v)]    
    Baseball v -> span [] [ text "Baseball : ", text (baseball_variation_text v)]
    ChaseTheDragon v -> span [] [ text "Chase the Dragon : ", text (dragon_variation_text v)]
    Cricket v -> span [] [ text "Cricket : ", text (cricket_variation_text v)]

game_to_option : GameMode -> Html msg
game_to_option mode =
  case mode of
    NoGame -> option [ value <| game_to_id mode ] [ text "Select a Game" ]
    Numbers701 _ _ -> option [ value <| game_to_id mode ] [ text "701" ]
    Numbers501 _ _ -> option [ value <| game_to_id mode ] [ text "501" ]
    Numbers301 _ _ -> option [ value <| game_to_id mode ] [ text "301" ]
    AroundTheClock _ -> option [ value <| game_to_id mode ] [ text "Around the Clock" ]
    AroundTheClock180 _ -> option [ value <| game_to_id mode ] [ text "Around the Clock 180" ]
    Baseball _ -> option [ value <| game_to_id mode ] [ text "Baseball" ]
    ChaseTheDragon _ -> option [ value <| game_to_id mode ] [ text "Chase the Dragon" ]
    Cricket _ -> option [ value <| game_to_id mode ] [ text "Cricket" ]

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
id_to_game : String -> GameMode
id_to_game s = case s of  
  "301_BI_BO" -> Numbers301 BasicIn BasicOut
  "301_BI_DO" -> Numbers301 BasicIn DoubleOut
  "301_BI_TO" -> Numbers301 BasicIn TripleOut
  "301_DI_BO" -> Numbers301 DoubleIn BasicOut
  "301_DI_DO" -> Numbers301 DoubleIn DoubleOut
  "301_DI_TO" -> Numbers301 DoubleIn TripleOut
  "301_TI_BO" -> Numbers301 TripleIn BasicOut
  "301_TI_DO" -> Numbers301 TripleIn DoubleOut
  "301_TI_TO" -> Numbers301 TripleIn TripleOut

  "501_BI_BO" -> Numbers501 BasicIn BasicOut
  "501_BI_DO" -> Numbers501 BasicIn DoubleOut
  "501_BI_TO" -> Numbers501 BasicIn TripleOut
  "501_DI_BO" -> Numbers501 DoubleIn BasicOut
  "501_DI_DO" -> Numbers501 DoubleIn DoubleOut
  "501_DI_TO" -> Numbers501 DoubleIn TripleOut
  "501_TI_BO" -> Numbers501 TripleIn BasicOut
  "501_TI_DO" -> Numbers501 TripleIn DoubleOut
  "501_TI_TO" -> Numbers501 TripleIn TripleOut

  "701_BI_BO" -> Numbers701 BasicIn BasicOut
  "701_BI_DO" -> Numbers701 BasicIn DoubleOut
  "701_BI_TO" -> Numbers701 BasicIn TripleOut
  "701_DI_BO" -> Numbers701 DoubleIn BasicOut
  "701_DI_DO" -> Numbers701 DoubleIn DoubleOut
  "701_DI_TO" -> Numbers701 DoubleIn TripleOut
  "701_TI_BO" -> Numbers701 TripleIn BasicOut
  "701_TI_DO" -> Numbers701 TripleIn DoubleOut
  "701_TI_TO" -> Numbers701 TripleIn TripleOut

  "CKT_B" -> Cricket BasicCricket
  "CKT_G" -> Cricket GolfCricket

  "BBL_B" -> Baseball BasicBaseball
  "BBL_S" -> Baseball SeventhInningCatch

  "AOC_NBO" -> AroundTheClock NoBullOut
  "AOC_ABO" -> AroundTheClock AnyBullOut
  "AOC_SBO" -> AroundTheClock SplitBullOut

  "180_DB" -> AroundTheClock180 DoubleBonus
  "180_TB" -> AroundTheClock180 TripleBonus

  "CTD_BD" -> ChaseTheDragon BasicDragon
  "CTD_TD" -> ChaseTheDragon TripleHeadedDragon

  _ -> NoGame

game_to_id : GameMode -> String
game_to_id mode = case mode of
  NoGame -> "NGM"

  Numbers301 BasicIn BasicOut -> "301_BI_BO"
  Numbers301 BasicIn DoubleOut -> "301_BI_DO"
  Numbers301 BasicIn TripleOut -> "301_BI_TO"
  Numbers301 DoubleIn BasicOut -> "301_DI_BO"
  Numbers301 DoubleIn DoubleOut -> "301_DI_DO"
  Numbers301 DoubleIn TripleOut -> "301_DI_TO"
  Numbers301 TripleIn BasicOut -> "301_TI_BO"
  Numbers301 TripleIn DoubleOut -> "301_TI_DO"
  Numbers301 TripleIn TripleOut -> "301_TI_TO"

  Numbers501 BasicIn BasicOut -> "501_BI_BO"
  Numbers501 BasicIn DoubleOut -> "501_BI_DO"
  Numbers501 BasicIn TripleOut -> "501_BI_TO"
  Numbers501 DoubleIn BasicOut -> "501_DI_BO"
  Numbers501 DoubleIn DoubleOut -> "501_DI_DO"
  Numbers501 DoubleIn TripleOut -> "501_DI_TO"
  Numbers501 TripleIn BasicOut -> "501_TI_BO"
  Numbers501 TripleIn DoubleOut -> "501_TI_DO"
  Numbers501 TripleIn TripleOut -> "501_TI_TO"

  Numbers701 BasicIn BasicOut -> "701_BI_BO"
  Numbers701 BasicIn DoubleOut -> "701_BI_DO"
  Numbers701 BasicIn TripleOut -> "701_BI_TO"
  Numbers701 DoubleIn BasicOut -> "701_DI_BO"
  Numbers701 DoubleIn DoubleOut -> "701_DI_DO"
  Numbers701 DoubleIn TripleOut -> "701_DI_TO"
  Numbers701 TripleIn BasicOut -> "701_TI_BO"
  Numbers701 TripleIn DoubleOut -> "701_TI_DO"
  Numbers701 TripleIn TripleOut -> "701_TI_TO"

  Cricket BasicCricket -> "CKT_B"
  Cricket GolfCricket -> "CKT_G"

  Baseball BasicBaseball -> "BBL_B"
  Baseball SeventhInningCatch -> "BBL_S"

  AroundTheClock NoBullOut -> "AOC_NBO"
  AroundTheClock AnyBullOut -> "AOC_ABO"
  AroundTheClock SplitBullOut -> "AOC_SBO"

  AroundTheClock180 DoubleBonus -> "180_DB"
  AroundTheClock180 TripleBonus -> "180_TB"

  ChaseTheDragon BasicDragon -> "CTD_BD"
  ChaseTheDragon TripleHeadedDragon -> "CTD_TD"

game_description : GameMode -> Html msg
game_description mode =
  case mode of
    NoGame         -> span [] []
    Numbers701 _ _ -> span []
      [ text "Total score of a 3 dart turn is deducted from the player's starting number of 701."
      , text "Inner bull is 50, outter bull is 25."
      , text "Winner must reach EXACTLY 0 points."
      , text "If 0 is reached before finishing a turn, the turn is over, it is a win."
      , text "If the turn results in a less than 0 score, called a Bust, no points are deducted for that turn."
      , text "Variations:"
      , text "Double In / Triple In : Requires double or triple hits during a turn in order to begin point deduction."
      , text "Double Out / Triple Out : Requires double or triple hits during a turn in order to end the game. Busts happen at 2 or 3 respectively, instead of 0."
      ]
    Numbers501 _ _ ->  span []
      [ text "Total score of a 3 dart turn is deducted from the player's starting number of 501."
      , text "Inner bull is 50, outter bull is 25."
      , text "Winner must reach EXACTLY 0 points."
      , text "If 0 is reached before finishing a turn, the turn is over, it is a win."
      , text "If the turn results in a less than 0 score, called a Bust, no points are deducted for that turn."
      , text "Variations:"
      , text "Double In / Triple In : Requires double or triple hits during a turn in order to begin point deduction."
      , text "Double Out / Triple Out : Requires double or triple hits during a turn in order to end the game. Busts happen at 2 or 3 respectively, instead of 0."
      ]
    Numbers301 _ _ ->  span []
      [ text "Total score of a 3 dart turn is deducted from the player's starting number of 301."
      , text "Inner bull is 50, outter bull is 25."
      , text "Winner must reach EXACTLY 0 points."
      , text "If 0 is reached before finishing a turn, the turn is over, it is a win."
      , text "If the turn results in a less than 0 score, called a Bust, no points are deducted for that turn."
      , text "Variations:"
      , text "Double In / Triple In : Requires double or triple hits during a turn in order to begin point deduction."
      , text "Double Out / Triple Out : Requires double or triple hits during a turn in order to end the game. Busts happen at 2 or 3 respectively, instead of 0."
      ]
    AroundTheClock _ ->  span []
      [ text "Each player takes a 3 dart turn."
      , text "Objective is to hit 1 to 20 in order."
      , text "The player can not move on to the next number until the target number is hit, starting at 1."
      , text "The target number increments after a successful hit on the current target number, so at most a player can advance 3 numbers in a turn."
      , text "The first player to hit 20 wins."
      , text "Doubles and triples count as a normal hit."
      , text "Variations:"
      , text "Bull Out : After 20, player must hit double or single bullseye to win."
      , text "Split Bull Out : After 20, player must hit the outter bullseye, then the inner bullseye to win."
      ]
    AroundTheClock180 _ ->  span []
      [ text "For the game, choose if triples or doubles will reward bonus points."
      , text "Each player takes a 3 dart turn."
      , text "Objective is to hit 1 to 20 in order."
      , text "The player can not move on to the next number until the target number is hit, starting at 1."
      , text "The target number increments after a successful hit on the current target number, so at most a player can advance 3 numbers in a turn."
      , text "Points are only issued on hits to the target number. Hits to old or future numbers do not issue points."
      , text "A normal hit is worth 1 point. A hit to a double or triple (depending on what was chosen for the game) is worth 3 points."
      , text "Players who hit 20 are done with their turns."
      , text "When all players finish, the one with the most points wins."
      ]
    Baseball _ ->  span []
      [ text "Each player takes a 3 dart turn."
      , text "There are 9 innings and the inning increments each round."
      , text "Players target the number based on the inning, so board positions 1 to 9 will be used."
      , text "Hitting the target number gives 1 run. Doubles and triples give 2 and 3 runs respectively."
      , text "Ties at the end of the 9th inning are broken by adding additional innings where the bullseye is the target."
      , text "Player with the most points wins."
      , text "Variations: "
      , text "Seventh Inning Catch : No hits in the 7th inning results in the player's score being cut in half, rounded up."
      ]
    ChaseTheDragon _ ->  span []
      [ text "Each player takes a 3 dart turn."
      , text "Objective is to hit triples of 10 to 20 in order, followed by the outter then inner bullseye."
      , text "The player can not move on to the next number until the target number triple is hit, starting at 10."
      , text "The target number increments after a successful hit on the current target number, so at most a player can advance 3 numbers in a turn."
      , text "The first player to hit the inner bullseye wins."
      , text "Variations:"
      , text "Three Headed Dragon : Player must complete the 10 to 20, outter bullseye, inner bullseye pattern 3 times to win."
      ]
    Cricket _ -> span []
      [ text "Each player takes a 3 dart turn."
      , text "The targets are 15 to 20 and the inner and outter bullseye."
      , text "A player can attempt to hit any target in any order during their turn."
      , text "Objective is for a player to open all targets and earn the most points."
      , text "Each player must open their own targets, one player opening a target does not open it for all other players."
      , text "A player marks unopened targets with dart hits. A regular hit is 1 mark, a double hit is 2 marks, and a triple hit is 3 marks."
      , text "A target is open when it has 3 marks."
      , text "If all players have opened a target, it becomes closed for all players."
      , text "A player can earn points by hitting their open targets. Points are rewarded based on the number of the target, double and triple multipliers apply."
      , text "No points are rewarded for hits to closed targets."
      , text "The game ends when all targets have been closed. The player with the most points wins."
      , text "Variations:"
      , text "Golf : Gameplay is the same, but any points a player earns during a turn are given to all other players who have not yet opened the target. Once all targets are closed the player with the least points wins."
      ]

type Action
  = GoHome
  | GoEditPlayers
  | GoSelectGame
  | GoPlayGame
  | GameSelected GameMode
  | NewPlayerInput NewPlayerName
  | NewPlayerCommit NewPlayerName
  | DeletePlayer Player
  | Toss Hit

init : AppState
init =
  { playerData = []
  , game = NoGame
  , currentPlayer = 0
  , currentTurn = []
  , screen = Home
  }

update : Action -> AppState -> AppState
update action state =
  case action of
    GoHome -> { state | screen = Home }
    GoEditPlayers -> { state | screen = EditPlayers (NewPlayerName "") }
    GoSelectGame -> { state | screen = SelectGame }
    GoPlayGame -> { state | screen = PlayGame }
    GameSelected mode -> { state | game = mode }
    NewPlayerInput p -> { state | screen = EditPlayers p }
    NewPlayerCommit p -> { state | playerData = add_player state.playerData p, screen = EditPlayers (NewPlayerName "") }
    DeletePlayer p -> { state | playerData = delete_player state.playerData p }
    Toss h -> { state | currentTurn = List.take 3 <| h :: state.currentTurn }


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
      if List.length state.playerData > 0 && state.game /= NoGame
      then [ button [ onClick GoPlayGame ] [ text "Start Game" ] ]
      else []
  in
    [ div [] <|
      start_game ++
      [ button [ onClick GoEditPlayers ] [ text "Edit Players" ]
      , button [ onClick GoSelectGame ] [ text "Select Game" ]
      ]
    , div [] 
      [ text "Selected Game: "
      , game_name state.game
      ]    
    ]


render_select_game : GameMode -> List (Html Action)
render_select_game mode =
  [ div []
    [ button [ onClick GoHome ] [ text "Home" ]
    , button [ onClick GoEditPlayers ] [ text "Edit Players" ]            
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
mode_selector _ = 
  [ div [] 
    [ select [onInput (GameSelected << id_to_game)] 
      (List.map game_to_option game_list) 
    ]
  ]

variant_selector : GameMode -> List (Html Action)
variant_selector mode = 
  let is_selected a b = if a == b then [ selected True ] else []
  in case mode of 
    NoGame -> []
    Numbers301 vi vo -> 
      [ div []
        [ text "In Rule"
        , select [onInput (GameSelected << id_to_game)] 
          [ option ([ value <| game_to_id (Numbers301 BasicIn vo) ] ++ is_selected vi BasicIn) [ text (numbers_variation_in_text BasicIn) ]
          , option ([ value <| game_to_id (Numbers301 DoubleIn vo) ] ++ is_selected vi DoubleIn) [ text (numbers_variation_in_text DoubleIn) ]
          , option ([ value <| game_to_id (Numbers301 TripleIn vo) ] ++ is_selected vi TripleIn) [ text (numbers_variation_in_text TripleIn) ]
          ]
        ]
      , div []
        [ text "Out Rule"
        , select [onInput (GameSelected << id_to_game)] 
          [ option ([ value <| game_to_id (Numbers301 vi BasicOut) ] ++ is_selected vo BasicOut) [ text (numbers_variation_out_text BasicOut) ]
          , option ([ value <| game_to_id (Numbers301 vi DoubleOut) ] ++ is_selected vo DoubleOut) [ text (numbers_variation_out_text DoubleOut) ]
          , option ([ value <| game_to_id (Numbers301 vi TripleOut) ] ++ is_selected vo TripleOut) [ text (numbers_variation_out_text TripleOut) ]
          ]
        ]
      ]
    Numbers501 vi vo -> 
      [ div []
        [ text "In Rule"
        , select [onInput (GameSelected << id_to_game)] 
          [ option ([ value <| game_to_id (Numbers501 BasicIn vo) ] ++ is_selected vi BasicIn) [ text (numbers_variation_in_text BasicIn) ]
          , option ([ value <| game_to_id (Numbers501 DoubleIn vo) ] ++ is_selected vi DoubleIn) [ text (numbers_variation_in_text DoubleIn) ]
          , option ([ value <| game_to_id (Numbers501 TripleIn vo) ] ++ is_selected vi TripleIn) [ text (numbers_variation_in_text TripleIn) ]
          ]
        ]
      , div []
        [ text "Out Rule"
        , select [onInput (GameSelected << id_to_game)] 
          [ option ([ value <| game_to_id (Numbers501 vi BasicOut) ] ++ is_selected vo BasicOut) [ text (numbers_variation_out_text BasicOut) ]
          , option ([ value <| game_to_id (Numbers501 vi DoubleOut) ] ++ is_selected vo DoubleOut) [ text (numbers_variation_out_text DoubleOut) ]
          , option ([ value <| game_to_id (Numbers501 vi TripleOut) ] ++ is_selected vo TripleOut) [ text (numbers_variation_out_text TripleOut) ]
          ]
        ]
      ]
    Numbers701 vi vo -> 
      [ div []
        [ text "In Rule"
        , select [onInput (GameSelected << id_to_game)] 
          [ option ([ value <| game_to_id (Numbers701 BasicIn vo) ] ++ is_selected vi BasicIn) [ text (numbers_variation_in_text BasicIn) ]
          , option ([ value <| game_to_id (Numbers701 DoubleIn vo) ] ++ is_selected vi DoubleIn) [ text (numbers_variation_in_text DoubleIn) ]
          , option ([ value <| game_to_id (Numbers701 TripleIn vo) ] ++ is_selected vi TripleIn) [ text (numbers_variation_in_text TripleIn) ]
          ]
        ]
      , div []
        [ text "Out Rule"
        , select [onInput (GameSelected << id_to_game)] 
          [ option ([ value <| game_to_id (Numbers701 vi BasicOut) ] ++ is_selected vo BasicOut) [ text (numbers_variation_out_text BasicOut) ]
          , option ([ value <| game_to_id (Numbers701 vi DoubleOut) ] ++ is_selected vo DoubleOut) [ text (numbers_variation_out_text DoubleOut) ]
          , option ([ value <| game_to_id (Numbers701 vi TripleOut) ] ++ is_selected vo TripleOut) [ text (numbers_variation_out_text TripleOut) ]
          ]
        ]
      ]
    AroundTheClock v ->
      [ div []
        [ text "Variation"
        , select [onInput (GameSelected << id_to_game)] 
          [ option ([ value <| game_to_id (AroundTheClock NoBullOut) ] ++ is_selected v NoBullOut) [ text (around_the_clock_variation_text NoBullOut) ]
          , option ([ value <| game_to_id (AroundTheClock AnyBullOut) ] ++ is_selected v AnyBullOut) [ text (around_the_clock_variation_text AnyBullOut) ]
          , option ([ value <| game_to_id (AroundTheClock SplitBullOut) ] ++ is_selected v SplitBullOut) [ text (around_the_clock_variation_text SplitBullOut) ]
          ]
        ]
      ]
    AroundTheClock180 v ->
      [ div []
        [ text "Variation" 
        , select [onInput (GameSelected << id_to_game)] 
          [ option ([ value <| game_to_id (AroundTheClock180 DoubleBonus)] ++ is_selected v DoubleBonus) [ text (around_the_clock_180_variation_text DoubleBonus) ]
          , option ([ value <| game_to_id (AroundTheClock180 TripleBonus)] ++ is_selected v TripleBonus) [ text (around_the_clock_180_variation_text TripleBonus) ]
          ]
        ]
      ]
    Baseball v ->
      [ div []
        [ text "Variation" 
        , select [onInput (GameSelected << id_to_game)] 
          [ option ([ value <| game_to_id (Baseball BasicBaseball)] ++ is_selected v BasicBaseball) [ text (baseball_variation_text BasicBaseball) ]
          , option ([ value <| game_to_id (Baseball SeventhInningCatch)] ++ is_selected v SeventhInningCatch) [ text (baseball_variation_text SeventhInningCatch) ]
          ]
        ]
      ]
    ChaseTheDragon v ->
      [ div []
        [ text "Variation" 
        , select [onInput (GameSelected << id_to_game)] 
          [ option ([ value <| game_to_id (ChaseTheDragon BasicDragon)] ++ is_selected v BasicDragon) [ text (dragon_variation_text BasicDragon) ]
          , option ([ value <| game_to_id (ChaseTheDragon TripleHeadedDragon)] ++ is_selected v TripleHeadedDragon) [ text (dragon_variation_text TripleHeadedDragon) ]
          ]
        ]
      ]
    Cricket v ->
      [ div []
        [ text "Variation" 
        , select [onInput (GameSelected << id_to_game)] 
          [ option ([ value <| game_to_id (Cricket BasicCricket)] ++ is_selected v BasicCricket) [ text (cricket_variation_text BasicCricket) ]
          , option ([ value <| game_to_id (Cricket GolfCricket)] ++ is_selected v GolfCricket) [ text (cricket_variation_text GolfCricket) ]
          ]
        ]
      ]

render_edit_players : List Player -> NewPlayerName -> List (Html Action)
render_edit_players players np =
  [ div []
    [ button [ onClick GoHome ] [ text "Home" ]
    , button [ onClick GoSelectGame ] [ text "Select Game" ]
    ]
  ] ++
  (add_player_form np) ++
  [ div []
    [ text "Players" ]
  ] ++
  (list_players players)

add_player_form : NewPlayerName -> List (Html Action)
add_player_form (NewPlayerName t) = 
  [ div [] [ text "Player Name" ]
  , div []
    [ input [ value t, placeholder "Name", onInput (NewPlayerInput << NewPlayerName) ] [] ]
  , div []
    [ button [ onClick (NewPlayerCommit <| NewPlayerName t) ] [ text "Add Player" ] ]
  ]

add_player : List Player -> NewPlayerName -> List Player
add_player l n =
  let
    empty (NewPlayerName s) = String.isEmpty <| String.trim s
  in
    if empty n 
    then l 
    else new_player (PlayerIndex <| 1 + List.length l) n :: l

delete_player : List Player -> Player -> List Player
delete_player l d = List.filter (\p -> p /= d) l

list_players : List Player -> List (Html Action)
list_players l = 
  let
    player_edit_row player = 
      tr [] 
        [ td [] [ text <| player_name_string player.name ]
        , td [] [ button [ onClick (DeletePlayer player) ] [ text "X"] ]
        ]
  in
    [ table [] (List.map player_edit_row l) ]

render_game : AppState -> List (Html Action)
render_game state =
  [ div []
    [ button [ onClick GoHome ] [ text "Home" ]
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
    panels = List.indexedMap (\i v -> ((Basics.degrees (toFloat <| (-) 9 <| i * 18), Basics.degrees (toFloat <| (-) 9 <| (i + 1) * 18)), v)) [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5]
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
    start_end_points : (Float, Float) -> Float -> ((Float, Float), (Float, Float))
    start_end_points (s, e) r = ((r * sin s, r * cos s), (r * sin e, r * cos e))

    d_from_deg : (Float, Float) -> Float -> String
    d_from_deg d r = "M 50 50 " ++ (l_from <| start_end_points d r) ++ " Z"

    l_from : ((Float, Float), (Float, Float)) -> String
    l_from ((x0, y0), (x1, y1)) = "L " ++ (String.fromFloat <| 50 + x0) ++ " " ++ (String.fromFloat <| 50 + y0) ++ " L " ++ (String.fromFloat <| 50 + x1) ++ " " ++ (String.fromFloat <| 50 + y1)
  in
    List.map double_slice panels ++
    List.map outer_single_slice panels ++
    List.map triple_slice panels ++
    List.map inner_single_slice panels ++
    [ bull, double_bull ]
