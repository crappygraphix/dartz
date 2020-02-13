module Main exposing (main)

import Browser
import Html exposing (Html, button, div, span, text)
import Html.Events exposing (onClick)

main : Program () AppState Action
main = Browser.sandbox { init = init, update = update, view = view }

type SubHit = SingleHit | DoubleHit | TripleHit

type Hit
  = HitMissed
  | HitOne SubHit
  | HitTwo SubHit
  | HitThree SubHit
  | HitFour SubHit
  | HitFive SubHit
  | HitSix SubHit
  | HitSeven SubHit
  | HitEight SubHit
  | HitNine SubHit
  | HitTen SubHit
  | HitEleven SubHit
  | HitTwelve SubHit
  | HitThirteen SubHit
  | HitFourteen SubHit
  | HitFifteen SubHit
  | HitSixteen SubHit
  | HitSeventeen SubHit
  | HitEighteen SubHit
  | HitNineteen SubHit
  | HitTwenty SubHit
  | HitBullseye
  | HitDoubleBullseye

type PlayerName = PlayerName String
type PlayerHits = PlayerHits (List Hit)

type alias Inning = Int
type alias Score = Int
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
  }

type alias AppState =
  { playerData : List Player
  , game : GameMode
  , screen : Screen
  , currentPlayer : Int
  }

type Screen
  = Home
  | EditPlayers
  | SelectGame
  | PlayGame

type NumbersInVariation = BasicIn | DoubleIn | TripleIn
type NumbersOutVariation = BasicOut | DoubleOut | TripleOut
type AroundTheClockVariation = NoBullOut | AnyBullOut | SplitBullOut
type AroundTheClock180Variation = DoubleBonus | TripleBonus
type BaseballVariation = BasicBaseball | SeventhInningCatch
type DragonVariation = BasicDragon | TripleHeadedDragon
type CricketVariation = BasicCricket | GolfCricket

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

game_description : GameMode -> Html msg
game_description mode =
  case mode of
    NoGame         -> span [] [ text "Please select a game." ]
    Numbers701 _ _ -> span []
      [ text "Total score of a 3 dart turn are deducted from the player's starting number of 701."
      , text "Inner bull is 50, outter bull is 25."
      , text "Winner must reach EXACTLY 0 points."
      , text "If 0 is reached before finishing a turn, the turn is over, it is a win."
      , text "If the turn results in a less than 0 score, called a Bust, no points are deducted for that turn."
      , text "Variations:"
      , text "Double In / Triple In : Requires double or triple hits during a turn in order to begin point deduction."
      , text "Double Out / Triple Out : Requires double or triple hits during a turn in order to end the game. Busts happen at 2 or 3 respectively, instead of 0."
      ]
    Numbers501 _ _ ->  span []
      [ text "Total score of a 3 dart turn are deducted from the player's starting number of 501."
      , text "Inner bull is 50, outter bull is 25."
      , text "Winner must reach EXACTLY 0 points."
      , text "If 0 is reached before finishing a turn, the turn is over, it is a win."
      , text "If the turn results in a less than 0 score, called a Bust, no points are deducted for that turn."
      , text "Variations:"
      , text "Double In / Triple In : Requires double or triple hits during a turn in order to begin point deduction."
      , text "Double Out / Triple Out : Requires double or triple hits during a turn in order to end the game. Busts happen at 2 or 3 respectively, instead of 0."
      ]
    Numbers301 _ _ ->  span []
      [ text "Total score of a 3 dart turn are deducted from the player's starting number of 301."
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

init : AppState
init =
  { playerData = []
  , game = NoGame
  , currentPlayer = 0
  , screen = Home
  }

update : Action -> AppState -> AppState
update action state =
  case action of
    GoHome -> state
    GoEditPlayers -> state
    GoSelectGame -> state
    GoPlayGame -> state

view : AppState -> Html Action
view _ =
  div []
    [ button [ onClick GoHome ] [ text "Home" ]
    , button [ onClick GoEditPlayers ] [ text "Edit Players" ]
    , button [ onClick GoSelectGame ] [ text "Select Game" ]
    , button [ onClick GoPlayGame ] [ text "Start Game" ]
    ]

