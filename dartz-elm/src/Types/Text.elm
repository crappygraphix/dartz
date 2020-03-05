module Types.Text exposing (..)

import Types exposing (..)

player_name_text (PlayerName s) = s

player_initials_text (PlayerInitials s) = s

sub_hit_text : SubHit -> String
sub_hit_text s = case s of
   SingleHit -> "Single"
   DoubleHit -> "Double"
   TripleHit -> "Triple"

short_hit_text : Hit -> String
short_hit_text h = case h of
   HitMissed -> "Miss"
   Hit1 _ -> "1"
   Hit2 _ -> "2"
   Hit3 _ -> "3"
   Hit4 _ -> "4"
   Hit5 _ -> "5"
   Hit6 _ -> "6"
   Hit7 _ -> "7"
   Hit8 _ -> "8"
   Hit9 _ -> "9"
   Hit10 _ -> "10"
   Hit11 _ -> "11"
   Hit12 _ -> "12"
   Hit13 _ -> "13"
   Hit14 _ -> "14"
   Hit15 _ -> "15"
   Hit16 _ -> "16"
   Hit17 _ -> "17"
   Hit18 _ -> "18"
   Hit19 _ -> "19"
   Hit20 _ -> "20"
   HitBullseye -> "Bull"
   HitDoubleBullseye -> "Double Bull"

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
