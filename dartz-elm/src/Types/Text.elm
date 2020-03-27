module Types.Text exposing (..)

import Types exposing (..)

player_name_text (PlayerName s) = s

player_initials_text (PlayerInitials s) = s

sub_hit_text : SubHit -> String
sub_hit_text s = case s of
  SubMissed -> ""
  SingleHit -> "\u{2802}"
  DoubleHit -> "\u{2805}"
  TripleHit -> "\u{2807}"

short_hit_text : Hit -> String
short_hit_text h = case h of
   HitMissed -> "\u{2297}"
   Hit1 _ -> "\u{2460}"
   Hit2 _ -> "\u{2461}"
   Hit3 _ -> "\u{2462}"
   Hit4 _ -> "\u{2463}"
   Hit5 _ -> "\u{2464}"
   Hit6 _ -> "\u{2465}"
   Hit7 _ -> "\u{2466}"
   Hit8 _ -> "\u{2467}"
   Hit9 _ -> "\u{2468}"
   Hit10 _ -> "\u{2469}"
   Hit11 _ -> "\u{246A}"
   Hit12 _ -> "\u{246B}"
   Hit13 _ -> "\u{246C}"
   Hit14 _ -> "\u{246D}"
   Hit15 _ -> "\u{246E}"
   Hit16 _ -> "\u{246F}"
   Hit17 _ -> "\u{2470}"
   Hit18 _ -> "\u{2471}"
   Hit19 _ -> "\u{2472}"
   Hit20 _ -> "\u{2473}"
   HitBullseye -> "\u{24B7}"
   HitDoubleBullseye -> "\u{2805}\u{24B7}"

hit_text : Hit -> String
hit_text h = case h of
   HitMissed -> "\u{2297}"
   Hit1 s -> "\u{2460}" ++ sub_hit_text s
   Hit2 s -> "\u{2461}" ++ sub_hit_text s
   Hit3 s -> "\u{2462}" ++ sub_hit_text s
   Hit4 s -> "\u{2463}" ++ sub_hit_text s
   Hit5 s -> "\u{2464}" ++ sub_hit_text s
   Hit6 s -> "\u{2465}" ++ sub_hit_text s
   Hit7 s -> "\u{2466}" ++ sub_hit_text s
   Hit8 s -> "\u{2467}" ++ sub_hit_text s
   Hit9 s -> "\u{2468}" ++ sub_hit_text s
   Hit10 s -> "\u{2469}" ++ sub_hit_text s
   Hit11 s -> "\u{246A}" ++ sub_hit_text s
   Hit12 s -> "\u{246B}" ++ sub_hit_text s
   Hit13 s -> "\u{246C}" ++ sub_hit_text s
   Hit14 s -> "\u{246D}" ++ sub_hit_text s
   Hit15 s -> "\u{246E}" ++ sub_hit_text s
   Hit16 s -> "\u{246F}" ++ sub_hit_text s
   Hit17 s -> "\u{2470}" ++ sub_hit_text s
   Hit18 s -> "\u{2471}" ++ sub_hit_text s
   Hit19 s -> "\u{2472}" ++ sub_hit_text s
   Hit20 s -> "\u{2473}" ++ sub_hit_text s
   HitBullseye -> "\u{24B7}"
   HitDoubleBullseye -> "\u{2805}\u{24B7}"

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
