module Types exposing (..)

type SubHit = SubMissed | SingleHit | DoubleHit | TripleHit

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
type PlayerID = PlayerID Int
type Inning = Inning Int
type InningState = InningOpen | InningClosed
type Score = Score Int
type NumbersScore = NumbersScore Score
type AroundTheClockScore = AroundTheClockScore (List Hit) 
type AroundTheClock180Score = AroundTheClock180Score (List (Hit, Score))
type BaseballScore = BaseballScore (List (Inning, InningState, Score))
type ChaseTheDragonScore = ChaseTheDragonScore (List Hit)

type CricketSliceState = Slice0 | Slice1 | Slice2 | SliceOpen | SliceClosed
type CricketSlice = S20 | S19 | S18 | S17 | S16 | S15 | SB
type CricketGolfDelta = Delta CricketSlice Score | DeltaNone
type alias CricketScore =
  { score : Score
  , slice20 : CricketSliceState
  , slice19 : CricketSliceState
  , slice18 : CricketSliceState
  , slice17 : CricketSliceState
  , slice16 : CricketSliceState
  , slice15 : CricketSliceState
  , sliceBull : CricketSliceState
  }

type alias Player =
  { name     : PlayerName
  , initials : PlayerInitials
  , hits     : PlayerHits
  , id       : PlayerID
  }

type alias AppState =
  { players : List Player
  , game : GameState
  , screen : Screen
  , playing: Bool
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

type GameState
  = NoGame
  | Numbers701 NumbersInVariation NumbersOutVariation Int (List Hit) (List (PlayerID, NumbersScore))
  | Numbers501 NumbersInVariation NumbersOutVariation Int (List Hit) (List (PlayerID, NumbersScore))
  | Numbers301 NumbersInVariation NumbersOutVariation Int (List Hit) (List (PlayerID, NumbersScore))
  | AroundTheClock AroundTheClockVariation Int (List Hit) (List (PlayerID, AroundTheClockScore))
  | AroundTheClock180 AroundTheClock180Variation Int (List Hit) (List (PlayerID, AroundTheClock180Score))
  | Baseball BaseballVariation Int (List Hit) Inning (List (PlayerID, BaseballScore))
  | ChaseTheDragon DragonVariation Int (List Hit) (List (PlayerID, ChaseTheDragonScore))
  | Cricket CricketVariation Int (List Hit) (List (PlayerID, CricketScore))


type Action
  = GoHome
  | GoEditPlayers
  | GoSelectGame
  | StartGame
  | ResumeGame
  | EndGame
  | GameSelected GameState
  | NewPlayerInput NewPlayerName NewPlayerInitials
  | NewPlayerCommit NewPlayerName NewPlayerInitials
  | MovePlayerUp PlayerID
  | MovePlayerDown PlayerID
  | DeletePlayer PlayerID
  | Toss Hit
  | TossModalSelect Hit
  | TossModalCancel
  | FinishTurnModal
  | CancelFinishTurn
  | FinishTurn
