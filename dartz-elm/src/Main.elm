import Browser
import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)

-- Main

main = Browser.sandbox { init = init, update = update, view = view }

-- Types

type SubHit = SingleHit | DoubleHit | TripleHit

type Hit
  = HitFail
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

type alias PlayerName = String
type alias PlayerHits = [BoardHit]

type RoundScore
  = PointScore Int
  | ListScore [(Int, Hit)]
  | PointListScore Int [Hit]

type alias Player =
  { name  : PlayerName
  , hits  : PlayerHits
  , score : [RoundScore]
  }

type InRule = BasicIn | DoubleIn | TripleIn
type OutRule = BasicOut | DoubleOut | TripleOut
type BullseyeRule = BasicBull | SplitBull

type GameMode
  = Numbers701 InRule OutRule
  | Numbers501 InRule OutRule
  | Numbers301 InRule OutRule
  | AroundTheClock BullseyeRule
  | AroundTheClock180
  | Baseball
