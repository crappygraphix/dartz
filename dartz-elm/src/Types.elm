module Types exposing (..)

type SubHit = SingleHit | DoubleHit | TripleHit

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

type PlayerInitials = PlayerInitials String
type PlayerName = PlayerName String
type NewPlayerName = NewPlayerName String
type NewPlayerInitials = NewPlayerInitials String
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
  { name     : PlayerName
  , initials : PlayerInitials
  , hits     : PlayerHits
  , score    : GameScore
  , index    : PlayerIndex
  }

type alias AppState =
  { playerData : List Player
  , game : GameMode
  , screen : Screen
  , playing: Bool
  , currentPlayer : Int
  , currentTurn : List Hit
  }

type Modal
  = SelectSubHit Hit
  | FinalizeTurn

type Screen
  = Home
  | EditPlayers NewPlayerName NewPlayerInitials
  | SelectGame
  | PlayGame (Maybe Modal)

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


type Action
  = GoHome
  | GoEditPlayers
  | GoSelectGame
  | StartGame
  | ResumeGame
  | EndGame
  | GameSelected GameMode
  | NewPlayerInput NewPlayerName NewPlayerInitials
  | NewPlayerCommit NewPlayerName NewPlayerInitials
  | MovePlayerUp PlayerIndex
  | MovePlayerDown PlayerIndex
  | DeletePlayer PlayerIndex
  | Toss Hit
  | TossModalSelect Hit
  | TossModalCancel
  | FinishTurnModal
  | CancelFinishTurn
  | FinishTurn
