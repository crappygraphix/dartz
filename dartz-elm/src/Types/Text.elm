module Types.Text exposing (..)

import Types exposing (..)

player_name_text (PlayerName s) = s

sub_hit_text : SubHit -> String
sub_hit_text s = case s of
   SingleHit -> "Single"
   DoubleHit -> "Double"
   TripleHit -> "Triple"

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

numbers_variation_in_text v = case v of
  BasicIn -> "Any In"
  DoubleIn -> "Double In"
  TripleIn -> "Triple In"

numbers_variation_out_text v = case v of
  BasicOut -> "Any Out"
  DoubleOut -> "Double Out"
  TripleOut -> "TripleOut"

around_the_clock_variation_text v = case v of
  NoBullOut -> "Standard"
  AnyBullOut -> "Bull Out"
  SplitBullOut -> "Split Bull Out"

around_the_clock_180_variation_text v = case v of
  DoubleBonus -> "Double Bonus"
  TripleBonus -> "Triple Bonus"

baseball_variation_text v = case v of
  BasicBaseball -> "Standard"
  SeventhInningCatch -> "7th Inning Catch"

dragon_variation_text v = case v of
  BasicDragon -> "Standard"
  TripleHeadedDragon -> "Triple Headed Dragon"

cricket_variation_text v = case v of
  BasicCricket -> "Standard"
  GolfCricket -> "Golf"
