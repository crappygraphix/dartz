module Game exposing (finalize_turn, new_game, player_added, player_removed, record_toss, current_player_id, hits)

import Types exposing (..)
import Cascade exposing (cascade)

hits : GameState -> List Hit
hits g = 
  case g of
    NoGame -> []
    Numbers701 _ _ _ h _ -> h
    Numbers501 _ _ _ h _ -> h
    Numbers301 _ _ _ h _ -> h
    AroundTheClock _ _ h _ -> h
    AroundTheClock180 _ _ h _ -> h
    Baseball _ _ h _ _ -> h
    ChaseTheDragon _ _ h _ -> h
    Cricket _ _ h _ -> h

record_toss : Hit -> GameState -> GameState
record_toss n g = 
  let
    apply h = List.take 3 <| n::h
  in
    case g of
      NoGame -> NoGame
      Numbers701 i o c h s -> Numbers701 i o c (apply h) s
      Numbers501 i o c h s -> Numbers501 i o c (apply h) s
      Numbers301 i o c h s -> Numbers301 i o c (apply h) s
      AroundTheClock v c h s -> AroundTheClock v c (apply h) s
      AroundTheClock180 v c h s -> AroundTheClock180 v c (apply h) s
      Baseball v c h i s -> Baseball v c (apply h) i s
      ChaseTheDragon v c h s -> ChaseTheDragon v c (apply h) s
      Cricket v c h s -> Cricket v c (apply h) s

player_id_at : Int -> List (PlayerID, a) -> Maybe PlayerID
player_id_at c l = 
  let
    indexed s = List.indexedMap (\i (id, _) -> (i, id)) s      
  in
    case List.head <| List.filter (\(i, id) -> i == c) (indexed l) of
      Nothing -> Nothing
      Just (_, id) -> Just id

current_player_id : GameState -> Maybe PlayerID
current_player_id g = 
  case g of
    NoGame -> Nothing
    Numbers701 _ _ c _ s -> player_id_at c s
    Numbers501 _ _ c _ s -> player_id_at c s
    Numbers301 _ _ c _ s -> player_id_at c s
    AroundTheClock _ c _ s -> player_id_at c s
    AroundTheClock180 _ c _ s -> player_id_at c s
    Baseball _ c _ _ s -> player_id_at c s
    ChaseTheDragon _ c _ s -> player_id_at c s
    Cricket _ c _ s -> player_id_at c s

player_added : List Player -> GameState -> GameState
player_added l g =
  let
    find pid sl = List.foldl (\(spid, s) acc -> if spid == pid && acc == Nothing then Just (spid, s) else acc) Nothing sl
    add_missing f s p = case find p.id s of
      Nothing -> f p
      Just v -> v
    fix_scores f s = List.map (add_missing f s) l
  in
    case g of
      NoGame -> NoGame
      Numbers701 i o c h s -> Numbers701 i o c h (fix_scores (new_num_score 701) s)
      Numbers501 i o c h s -> Numbers501 i o c h (fix_scores (new_num_score 501) s)
      Numbers301 i o c h s -> Numbers301 i o c h (fix_scores (new_num_score 301) s)
      AroundTheClock v c h s -> AroundTheClock v c h (fix_scores new_atc_score s)
      AroundTheClock180 v c h s -> AroundTheClock180 v c h (fix_scores new_atc_180_score s)
      Baseball v c h i s -> Baseball v c h i (fix_scores new_bbl_score s)
      ChaseTheDragon v c h s -> ChaseTheDragon v c h (fix_scores new_ctd_score s)
      Cricket v c h s -> Cricket v c h (fix_scores new_ckt_score s)

player_removed : List Player -> GameState -> GameState
player_removed l g =
  let
    fix_current i = 
      if i >= List.length l - 1
      then 0
      else i
    fix_scores s = List.filter (\(i, _) -> List.any (\p -> p.id == i) l) s
  in
    case g of
      NoGame -> NoGame
      Numbers701 i o c h s -> Numbers701 i o (fix_current c) h (fix_scores s)
      Numbers501 i o c h s -> Numbers501 i o (fix_current c) h (fix_scores s)
      Numbers301 i o c h s -> Numbers301 i o (fix_current c) h (fix_scores s)
      AroundTheClock v c h s -> AroundTheClock v (fix_current c) h (fix_scores s)
      AroundTheClock180 v c h s -> AroundTheClock180 v (fix_current c) h (fix_scores s)
      Baseball v c h i s -> Baseball v (fix_current c) h i (fix_scores s)
      ChaseTheDragon v c h s -> ChaseTheDragon v (fix_current c) h (fix_scores s)
      Cricket v c h s -> Cricket v (fix_current c) h (fix_scores s)

new_game : GameState -> List Player -> GameState
new_game mode players = case mode of
  NoGame -> NoGame
  Numbers701 i o _ _ _ -> Numbers701 i o 0 [] (new_num_scores 701 players)
  Numbers501 i o _ _ _ -> Numbers501 i o 0 [] (new_num_scores 501 players)
  Numbers301 i o _ _ _ -> Numbers301 i o 0 [] (new_num_scores 301 players)
  AroundTheClock v _ _ _ -> AroundTheClock v 0 [] (new_atc_scores players)
  AroundTheClock180 v _ _ _ -> AroundTheClock180 v 0 [] (new_atc_180_scores players)
  Baseball v _ _ _ _ -> Baseball v 0 [] (Inning 1) (new_bbl_scores players)
  ChaseTheDragon v _ _ _ -> ChaseTheDragon v 0 [] (new_ctd_scores players)
  Cricket v _ _ _ -> Cricket v 0 [] (new_ckt_scores players)

new_num_score : Int -> Player -> (PlayerID, NumbersScore)
new_num_score goal p = (p.id, NumbersScore (Score goal))
new_num_scores : Int -> List Player -> List (PlayerID, NumbersScore)
new_num_scores goal l = List.map (new_num_score goal) l

new_atc_score : Player -> (PlayerID, AroundTheClockScore)
new_atc_score p = (p.id, AroundTheClockScore [])
new_atc_scores : List Player -> List (PlayerID, AroundTheClockScore)
new_atc_scores l = List.map new_atc_score l

new_atc_180_score : Player -> (PlayerID, AroundTheClock180Score)
new_atc_180_score p = (p.id, AroundTheClock180Score [])
new_atc_180_scores : List Player -> List (PlayerID, AroundTheClock180Score)
new_atc_180_scores l = List.map new_atc_180_score l

new_bbl_score : Player -> (PlayerID, BaseballScore)
new_bbl_score p = (p.id, List.range 1 9 |> List.map (\i -> (Inning i, InningOpen, Score 0)) |> BaseballScore)
new_bbl_scores : List Player -> List (PlayerID, BaseballScore)
new_bbl_scores l = List.map new_bbl_score l

new_ctd_score : Player -> (PlayerID, ChaseTheDragonScore)
new_ctd_score p = (p.id, ChaseTheDragonScore [])
new_ctd_scores : List Player -> List (PlayerID, ChaseTheDragonScore)
new_ctd_scores l = List.map new_ctd_score l

new_ckt_score : Player -> (PlayerID, CricketScore)
new_ckt_score p = (p.id, CricketScore (Score 0) Slice0 Slice0 Slice0 Slice0 Slice0 Slice0 Slice0)
new_ckt_scores : List Player -> List (PlayerID, CricketScore)
new_ckt_scores l = List.map new_ckt_score l

increment_player : GameState -> GameState
increment_player g = 
  let
    next_player : Int -> List a -> Int
    next_player i l = 
      if i >= List.length l - 1
      then 0
      else i + 1

    next_inning : Inning -> Int -> List a -> Inning
    next_inning (Inning i) c l =
      if c >= List.length l - 1
      then Inning <| i + 1
      else Inning i
  in  
    case g of
      NoGame -> NoGame
      Numbers701 i o c h s -> Numbers701 i o (next_player c s) h s
      Numbers501 i o c h s -> Numbers501 i o (next_player c s) h s
      Numbers301 i o c h s -> Numbers301 i o (next_player c s) h s
      AroundTheClock v c h s -> AroundTheClock v (next_player c s) h s
      AroundTheClock180 v c h s -> AroundTheClock180 v (next_player c s) h s
      Baseball v c h i s -> Baseball v (next_player c s) h (next_inning i c s) s
      ChaseTheDragon v c h s -> ChaseTheDragon v (next_player c s) h s
      Cricket v c h s -> Cricket v (next_player c s) h s

clear_hits : GameState -> GameState
clear_hits g = 
  case g of
    NoGame -> NoGame
    Numbers701 i o c _ s -> Numbers701 i o c [] s
    Numbers501 i o c _ s -> Numbers501 i o c [] s
    Numbers301 i o c _ s -> Numbers301 i o c [] s
    AroundTheClock v c _ s -> AroundTheClock v c [] s
    AroundTheClock180 v c _ s -> AroundTheClock180 v c [] s
    Baseball v c _ i s -> Baseball v c [] i s
    ChaseTheDragon v c _ s -> ChaseTheDragon v c [] s
    Cricket v c _ s -> Cricket v c [] s

finalize_turn : GameState -> GameState
finalize_turn state =
  let
    calc =
      case state of
        NoGame -> NoGame
        Numbers701 i o c h s -> Numbers701 i o c h <| numbers 701 i o c h s
        Numbers501 i o c h s -> Numbers501 i o c h <| numbers 501 i o c h s
        Numbers301 i o c h s -> Numbers301 i o c h <| numbers 301 i o c h s
        AroundTheClock v c h s -> AroundTheClock v c h <| around_the_clock v c h s
        AroundTheClock180 v c h s -> AroundTheClock180 v c h <| around_the_clock_180 v c h s
        Baseball v c h i s -> Baseball v c h i <| baseball v c h i s
        ChaseTheDragon v c h s -> ChaseTheDragon v c h <| chase_the_dragon v c h s
        Cricket BasicCricket c h s -> Cricket BasicCricket c h <| cricket c h s
        Cricket GolfCricket c h s -> Cricket GolfCricket c h <| cricket_golf c h s
  in
    clear_hits <| increment_player <| calc

find_by_id : PlayerID -> List (PlayerID, a) -> Maybe a
find_by_id p l =
  let
    check (i, a) acc = if p == i && acc == Nothing then Just a else acc 
  in
    List.foldr check Nothing l
  
update_by_id : PlayerID -> a -> List (PlayerID, a) -> List (PlayerID, a)
update_by_id pid a l = List.foldr (\(p, s) acc -> if pid == p then (p, a)::acc else (p, s)::acc) [] l 

apply_score : Int -> List (PlayerID, a) -> ((PlayerID, a) -> a) -> List (PlayerID, a)
apply_score c s f =
  case player_id_at c s of
    Nothing -> s
    Just pid -> case find_by_id pid s of
      Nothing -> s
      Just ps -> update_by_id pid (f (pid, ps)) s

sub_hit : Hit -> SubHit
sub_hit h = case h of
  HitMissed -> SubMissed
  Hit1 s -> s
  Hit2 s -> s
  Hit3 s -> s
  Hit4 s -> s
  Hit5 s -> s
  Hit6 s -> s
  Hit7 s -> s
  Hit8 s -> s
  Hit9 s -> s
  Hit10 s -> s
  Hit11 s -> s
  Hit12 s -> s
  Hit13 s -> s
  Hit14 s -> s
  Hit15 s -> s
  Hit16 s -> s
  Hit17 s -> s
  Hit18 s -> s
  Hit19 s -> s
  Hit20 s -> s
  HitBullseye -> SingleHit
  HitDoubleBullseye -> DoubleHit

hit_points : Hit -> Int
hit_points h = 
  let
    mult p s = case s of
      SubMissed -> 0
      SingleHit -> p
      DoubleHit -> p * 2
      TripleHit -> p * 3
  in
    case h of
      HitMissed -> 0
      Hit1 s -> mult 1 s
      Hit2 s -> mult 2 s
      Hit3 s -> mult 3 s
      Hit4 s -> mult 4 s
      Hit5 s -> mult 5 s
      Hit6 s -> mult 6 s
      Hit7 s -> mult 7 s
      Hit8 s -> mult 8 s
      Hit9 s -> mult 9 s
      Hit10 s -> mult 10 s
      Hit11 s -> mult 11 s
      Hit12 s -> mult 12 s
      Hit13 s -> mult 13 s
      Hit14 s -> mult 14 s
      Hit15 s -> mult 15 s
      Hit16 s -> mult 16 s
      Hit17 s -> mult 17 s
      Hit18 s -> mult 18 s
      Hit19 s -> mult 19 s
      Hit20 s -> mult 20 s
      HitBullseye -> 25
      HitDoubleBullseye -> 50

hit_base_points : Hit -> Int
hit_base_points h = 
  case h of
    HitMissed -> 0
    Hit1 s -> 1
    Hit2 s -> 2
    Hit3 s -> 3
    Hit4 s -> 4
    Hit5 s -> 5
    Hit6 s -> 6
    Hit7 s -> 7
    Hit8 s -> 8
    Hit9 s -> 9
    Hit10 s -> 10
    Hit11 s -> 11
    Hit12 s -> 12
    Hit13 s -> 13
    Hit14 s -> 14
    Hit15 s -> 15
    Hit16 s -> 16
    Hit17 s -> 17
    Hit18 s -> 18
    Hit19 s -> 19
    Hit20 s -> 20
    HitBullseye -> 25
    HitDoubleBullseye -> 25

numbers : Int -> NumbersInVariation -> NumbersOutVariation -> Int -> List Hit -> List (PlayerID, NumbersScore) -> List (PlayerID, NumbersScore)
numbers base i o c hl sl =
  let
    diff ht acc = acc - hit_points ht
    in_variant_calc v ht acc = cascade acc
      [ (acc == base && sub_hit ht == v, base - hit_points ht)
      , (acc < base, acc - hit_points ht)
      ]
    diff_bust ht acc = 
      if acc - hit_points ht >= 0
      then acc - hit_points ht
      else acc
    out_variant_calc v ht acc = cascade (acc - hit_points ht)
      [ (acc == 0, 0) -- We've reached the goal.
      , (acc - hit_points ht == 0 && sub_hit ht == v, 0) -- Goal reached with variant.
      , (acc - hit_points ht < 2 && v == DoubleHit, acc) -- Busted with variant.
      , (acc - hit_points ht < 3 && v == TripleHit, acc) -- Busted with variant.
      , (acc - hit_points ht < 0, acc) -- Busted.
      ]

    calc (_, NumbersScore (Score n)) = case (n == base, i, o) of
      (True, BasicIn, _) -> NumbersScore <| Score <| List.foldr diff base hl
      (True, DoubleIn, _) -> NumbersScore <| Score <| List.foldr (in_variant_calc DoubleHit) base hl -- Score locked until a double is hit
      (True, TripleIn, _) -> NumbersScore <| Score <| List.foldr (in_variant_calc TripleHit) base hl -- Score locked until a triple is hit
      (False, _, BasicOut) -> NumbersScore <| Score <| List.foldr diff_bust n hl
      (False, _, DoubleOut) -> NumbersScore <| Score <| List.foldr (out_variant_calc DoubleHit) n hl -- Must out with Double
      (False, _, TripleOut) -> NumbersScore <| Score <| List.foldr (out_variant_calc TripleHit) n hl -- Must out with Triple
  in
    apply_score c sl calc
  
hit_eq_shallow : Hit -> Hit -> Bool
hit_eq_shallow a b = case (a, b) of
  (HitMissed, HitMissed) -> True
  (Hit1 _, Hit1 _) -> True
  (Hit2 _, Hit2 _) -> True
  (Hit3 _, Hit3 _) -> True
  (Hit4 _, Hit4 _) -> True
  (Hit5 _, Hit5 _) -> True
  (Hit6 _, Hit6 _) -> True
  (Hit7 _, Hit7 _) -> True
  (Hit8 _, Hit8 _) -> True
  (Hit9 _, Hit9 _) -> True
  (Hit10 _, Hit10 _) -> True
  (Hit11 _, Hit11 _) -> True
  (Hit12 _, Hit12 _) -> True
  (Hit13 _, Hit13 _) -> True
  (Hit14 _, Hit14 _) -> True
  (Hit15 _, Hit15 _) -> True
  (Hit16 _, Hit16 _) -> True
  (Hit17 _, Hit17 _) -> True
  (Hit18 _, Hit18 _) -> True
  (Hit19 _, Hit19 _) -> True
  (Hit20 _, Hit20 _) -> True
  (HitBullseye, HitBullseye) -> True
  (HitDoubleBullseye, HitDoubleBullseye) -> True
  _ -> False

hit_eq_shallow_m : Hit -> Maybe Hit -> Bool
hit_eq_shallow_m a mb = case mb of
  Just b -> hit_eq_shallow a b
  Nothing -> False

hit_eq_m : Hit -> Maybe Hit -> Bool
hit_eq_m a mb = case mb of
  Just b -> a == b
  Nothing -> False

atc_next : Hit -> Maybe Hit
atc_next ht = case ht of
  HitMissed -> Nothing
  Hit1 _ -> Just (Hit2 SingleHit)
  Hit2 _ -> Just (Hit3 SingleHit)
  Hit3 _ -> Just (Hit4 SingleHit) 
  Hit4 _ -> Just (Hit5 SingleHit) 
  Hit5 _ -> Just (Hit6 SingleHit) 
  Hit6 _ -> Just (Hit7 SingleHit) 
  Hit7 _ -> Just (Hit8 SingleHit) 
  Hit8 _ -> Just (Hit9 SingleHit) 
  Hit9 _ -> Just (Hit10 SingleHit) 
  Hit10 _ -> Just (Hit11 SingleHit)
  Hit11 _ -> Just (Hit12 SingleHit)
  Hit12 _ -> Just (Hit13 SingleHit)
  Hit13 _ -> Just (Hit14 SingleHit)
  Hit14 _ -> Just (Hit15 SingleHit)
  Hit15 _ -> Just (Hit16 SingleHit)
  Hit16 _ -> Just (Hit17 SingleHit)
  Hit17 _ -> Just (Hit18 SingleHit)
  Hit18 _ -> Just (Hit19 SingleHit)
  Hit19 _ -> Just (Hit20 SingleHit)
  Hit20 _ -> Just HitBullseye
  HitBullseye -> Just HitDoubleBullseye
  HitDoubleBullseye -> Nothing
  
around_the_clock : AroundTheClockVariation -> Int -> List Hit -> List (PlayerID, AroundTheClockScore) -> List (PlayerID, AroundTheClockScore)
around_the_clock v c hl sl = 
  let
    check h acc = case List.head acc of
      Nothing -> if hit_eq_shallow h (Hit1 SingleHit) then [ h ] else []
      Just n -> if hit_eq_shallow_m h (atc_next n) then h::acc else acc
    tally s = AroundTheClockScore <| List.foldr check s hl
    calc (_, AroundTheClockScore s) = cascade (tally s)
      [ (v == NoBullOut && List.length hl == 20, AroundTheClockScore s) -- Hit all 20
      , (v == AnyBullOut && List.length hl == 21, AroundTheClockScore s) -- Hit all 20 + Bull
      , (v == SplitBullOut && List.length hl == 22, AroundTheClockScore s) -- Hit all 20 + Bulls
      ]
  in
    apply_score c sl calc   
  
around_the_clock_180 : AroundTheClock180Variation -> Int -> List Hit -> List (PlayerID, AroundTheClock180Score) -> List (PlayerID, AroundTheClock180Score)
around_the_clock_180 v c hl sl = 
  let
    bonus h = case v of
      DoubleBonus -> case sub_hit h of
         DoubleHit -> Score 3
         _ -> Score 1
      TripleBonus -> case sub_hit h of
         TripleHit -> Score 3
         _ -> Score 1
    check h acc = case List.head acc of
      Nothing -> if hit_eq_shallow h (Hit1 SingleHit) then [ (h, bonus h) ] else []
      Just (n, _) -> if hit_eq_shallow_m h (atc_next n) then (h, bonus h)::acc else acc
    tally s = AroundTheClock180Score <| List.foldr check s hl
    calc (_, AroundTheClock180Score s) = 
      if List.length hl == 20
      then AroundTheClock180Score s -- Hit all 20
      else tally s
  in
    apply_score c sl calc  
  
baseball : BaseballVariation -> Int -> List Hit -> Inning -> List (PlayerID, BaseballScore) -> List (PlayerID, BaseballScore)
baseball v c hl (Inning i) sl = 
  let
    total_score (BaseballScore l) = List.foldl (\(_, _, Score s) acc -> acc + s) 0 l
    total_scores l = List.foldl (\(_, s) acc -> (total_score s)::acc) [] l
    tie_exists l = case (List.take 2 <| List.reverse <| List.sort <| total_scores l) of
      a::b::_ -> a == b
      _ -> False

    closed (_, s, _) acc = if acc then s == InningClosed else acc
    player_closed (pid, (BaseballScore s)) acc = if acc then List.foldr closed True s else acc
    all_closed l = List.foldr player_closed True l

    points_for_sub s = case s of
      SingleHit -> 1
      DoubleHit -> 2
      TripleHit -> 3
      SubMissed -> 0

    points_for_inning h acc = case (i, h) of
      (1, Hit1 s) -> acc + points_for_sub s
      (2, Hit2 s) -> acc + points_for_sub s
      (3, Hit3 s) -> acc + points_for_sub s
      (4, Hit4 s) -> acc + points_for_sub s
      (5, Hit5 s) -> acc + points_for_sub s
      (6, Hit6 s) -> acc + points_for_sub s
      (7, Hit7 s) -> acc + points_for_sub s
      (8, Hit8 s) -> acc + points_for_sub s
      (9, Hit9 s) -> acc + points_for_sub s
      _ -> acc

    update_inning_score s (Inning i2, s2, Score sc2) acc =
      if i == i2
      then (Inning i, InningClosed, Score <| s + sc2)::acc
      else (Inning i2, s2, Score sc2)::acc

    apply_inning_points il s = List.foldr (update_inning_score s) [] il

    calc_inning il = 
      List.foldr points_for_inning 0 hl |>
      apply_inning_points il

    calc_7th l =
      let
        points = List.foldr points_for_inning 0 hl
        penalty = negate <| total_score (BaseballScore l) // 2
      in
        case points of
          0 -> apply_inning_points l penalty
          x -> apply_inning_points l x

    points_for_tie h acc = case h of
      HitBullseye -> acc + 1
      HitDoubleBullseye -> acc + 2
      _ -> acc
    
    calc_tie_game il =
      List.foldr points_for_tie 0 hl |>
      apply_inning_points il

    calc (_, BaseballScore il) = cascade (BaseballScore <| calc_inning il)
      [ (List.foldr closed True il, BaseballScore il) -- All innings closed
      , (i > 9, BaseballScore <| calc_tie_game il) -- Overtime rules 
      , (v == SeventhInningCatch && i == 7, BaseballScore <| calc_7th il) -- Seventh Inning Rule
      ]

    append_inning ei (pid, BaseballScore l) acc = (pid, BaseballScore <| l ++ [ (Inning ei, InningOpen, Score 0) ])::acc
    add_extra_inning : List (PlayerID, BaseballScore) -> List (PlayerID, BaseballScore)
    add_extra_inning l =
      if all_closed l && tie_exists l -- Tie exists after all innings closed.
      then List.foldr (append_inning <| i + 1) [] l
      else l
  in
    add_extra_inning <| apply_score c sl calc   
  
ctd_next : Hit -> Maybe Hit
ctd_next ht = case ht of
  Hit10 TripleHit -> Just (Hit11 TripleHit)
  Hit11 TripleHit -> Just (Hit12 TripleHit)
  Hit12 TripleHit -> Just (Hit13 TripleHit)
  Hit13 TripleHit -> Just (Hit14 TripleHit)
  Hit14 TripleHit -> Just (Hit15 TripleHit)
  Hit15 TripleHit -> Just (Hit16 TripleHit)
  Hit16 TripleHit -> Just (Hit17 TripleHit)
  Hit17 TripleHit -> Just (Hit18 TripleHit)
  Hit18 TripleHit -> Just (Hit19 TripleHit)
  Hit19 TripleHit -> Just (Hit20 TripleHit)
  Hit20 TripleHit -> Just HitBullseye
  HitBullseye -> Just HitDoubleBullseye
  HitDoubleBullseye -> Just (Hit10 TripleHit)
  _ -> Nothing

chase_the_dragon : DragonVariation -> Int -> List Hit -> List (PlayerID, ChaseTheDragonScore) -> List (PlayerID, ChaseTheDragonScore)
chase_the_dragon v c hl sl = 
  let
    check h acc = case List.head acc of
      Nothing -> if h == Hit10 TripleHit then [ h ] else []
      Just n -> if hit_eq_m h (ctd_next n) then h::acc else acc
    tally s = ChaseTheDragonScore <| List.foldr check s hl
    calc (_, ChaseTheDragonScore s) = cascade (tally s)
      [ (v == BasicDragon && List.length hl == 12, ChaseTheDragonScore s) -- Hit all 12
      , (v == TripleHeadedDragon && List.length hl == 26, ChaseTheDragonScore s) -- Hit all 12 three times around
      ]
  in
    apply_score c sl calc
  
cricket : Int -> List Hit -> List (PlayerID, CricketScore) -> List (PlayerID, CricketScore)
cricket c hl sl = 
  let
    last_open pid a = 
      let
        others (id, _) = pid /= id
        open (_, s) = case a of
          S20 -> s.slice20 == SliceOpen
          S19 -> s.slice19 == SliceOpen
          S18 -> s.slice18 == SliceOpen
          S17 -> s.slice17 == SliceOpen
          S16 -> s.slice16 == SliceOpen
          S15 -> s.slice15 == SliceOpen
          SB -> s.sliceBull == SliceOpen
      in
        List.all open <| List.filter others sl

    -- No points if everyone else has already openend slice.
    trim_points pid a i =
      if last_open pid a
      then 0
      else i
    
    get s a = case a of
      S20 -> s.slice20
      S19 -> s.slice19
      S18 -> s.slice18
      S17 -> s.slice17
      S16 -> s.slice16
      S15 -> s.slice15
      SB -> s.sliceBull
    set s a b = case a of
      S20 -> { s | slice20 = b }
      S19 -> { s | slice19 = b }
      S18 -> { s | slice18 = b }
      S17 -> { s | slice17 = b }
      S16 -> { s | slice16 = b }
      S15 -> { s | slice15 = b }
      SB -> { s | sliceBull = b }
    set_with_score pid s a b p = case a of
      S20 -> { s | slice20 = b, score = add_points s.score <| trim_points pid a p }
      S19 -> { s | slice19 = b, score = add_points s.score <| trim_points pid a p }
      S18 -> { s | slice18 = b, score = add_points s.score <| trim_points pid a p }
      S17 -> { s | slice17 = b, score = add_points s.score <| trim_points pid a p }
      S16 -> { s | slice16 = b, score = add_points s.score <| trim_points pid a p }
      S15 -> { s | slice15 = b, score = add_points s.score <| trim_points pid a p }
      SB -> { s | sliceBull = b, score = add_points s.score <| trim_points pid a p}
    check pid cs h x a = cascade cs
      [ (get cs a == Slice0, cascade (set cs a Slice1) 
        -- ^ Single Tally on an Empty
        [ ( x == DoubleHit, set cs a Slice2)
        -- ^ Double Tally on an Empty
        , ( x == TripleHit, set cs a SliceOpen)
        -- ^ Triple Tally on an Empty Opens
        ] )
      , (get cs a  == Slice1, cascade (set cs a Slice2)
        -- ^ Single Tally on a Single
        [ ( x == DoubleHit, set cs a SliceOpen)
        -- ^ Double Tally on a Single Opens
        , ( x == TripleHit, set_with_score pid cs a SliceOpen (hit_base_points h))
         -- ^ Triple Tally on a Double that isn't closed awards points
        ] )
      , (get cs a  == Slice2, cascade (set cs a SliceOpen)
        -- ^ Single Tally on a Double
        [ ( x == DoubleHit, set_with_score pid cs a SliceOpen (hit_base_points h))
        -- ^ Double Tally on a Double that isn't closed awards points
        , ( x == TripleHit, set_with_score pid cs a SliceOpen (2 * hit_base_points h))
         -- ^ Triple Tally on a Double that isn't closed awards points
        ] )
      , (get cs a == SliceOpen, set_with_score pid cs a SliceOpen (hit_points h))
        -- ^ Points awarded for hitting an Open
      , (get cs a  == SliceClosed, cs) 
        -- ^ Closed, issues no points
      ]
    add_points (Score s) i = Score (s + i)

    calc_hit pid h s = case h of
      Hit20 x -> check pid s h x S20
      Hit19 x -> check pid s h x S19
      Hit18 x -> check pid s h x S18
      Hit17 x -> check pid s h x S17
      Hit16 x -> check pid s h x S16
      Hit15 x -> check pid s h x S15
      HitBullseye -> check pid s h SingleHit SB
      HitDoubleBullseye -> check pid s h DoubleHit SB
      _ -> s

    calc_basic pid s = List.foldr (calc_hit pid) s hl


    all_open l a = 
      let
        open (_, s) = case a of
          S20 -> s.slice20 == SliceOpen
          S19 -> s.slice19 == SliceOpen
          S18 -> s.slice18 == SliceOpen
          S17 -> s.slice17 == SliceOpen
          S16 -> s.slice16 == SliceOpen
          S15 -> s.slice15 == SliceOpen
          SB -> s.sliceBull == SliceOpen
      in
        List.all open l

    close l a =
      let
        change (p, s) = case a of
          S20 -> (p, { s | slice20 = SliceClosed })
          S19 -> (p, { s | slice19 = SliceClosed })
          S18 -> (p, { s | slice18 = SliceClosed })
          S17 -> (p, { s | slice17 = SliceClosed })
          S16 -> (p, { s | slice16 = SliceClosed })
          S15 -> (p, { s | slice15 = SliceClosed })
          SB -> (p, { s | sliceBull = SliceClosed })
      in
        List.map change l

    close_slice a l =
      if all_open l a
      then close l a
      else l

    post_process l = 
      close_slice S20 <|
      close_slice S19 <|
      close_slice S18 <|
      close_slice S17 <|
      close_slice S16 <|
      close_slice S15 <|
      close_slice SB l

    calc (pid, s) = calc_basic pid s
  in
    post_process <| apply_score c sl calc   

cricket_golf : Int -> List Hit -> List (PlayerID, CricketScore) -> List (PlayerID, CricketScore)
cricket_golf c hl sl = 
  let
    last_open pid a = 
      let
        others (id, _) = pid /= id
        open (_, s) = case a of
          S20 -> s.slice20 == SliceOpen
          S19 -> s.slice19 == SliceOpen
          S18 -> s.slice18 == SliceOpen
          S17 -> s.slice17 == SliceOpen
          S16 -> s.slice16 == SliceOpen
          S15 -> s.slice15 == SliceOpen
          SB -> s.sliceBull == SliceOpen
      in
        List.all open <| List.filter others sl

    -- No points if everyone else has already openend slice.
    trim_points pid a i =
      if last_open pid a
      then 0
      else i
    
    get s a = case a of
      S20 -> s.slice20
      S19 -> s.slice19
      S18 -> s.slice18
      S17 -> s.slice17
      S16 -> s.slice16
      S15 -> s.slice15
      SB -> s.sliceBull
    set s a b d = case a of
      S20 -> ({ s | slice20 = b }, DeltaNone::d)
      S19 -> ({ s | slice19 = b }, DeltaNone::d)
      S18 -> ({ s | slice18 = b }, DeltaNone::d)
      S17 -> ({ s | slice17 = b }, DeltaNone::d)
      S16 -> ({ s | slice16 = b }, DeltaNone::d)
      S15 -> ({ s | slice15 = b }, DeltaNone::d)
      SB -> ({ s | sliceBull = b }, DeltaNone::d)
    set_with_score pid s a b d p = case a of
      S20 -> ({ s | slice20 = b }, (Delta S20 <| add_points s.score <| trim_points pid a p)::d)
      S19 -> ({ s | slice19 = b }, (Delta S19 <| add_points s.score <| trim_points pid a p)::d)
      S18 -> ({ s | slice18 = b }, (Delta S18 <| add_points s.score <| trim_points pid a p)::d)
      S17 -> ({ s | slice17 = b }, (Delta S17 <| add_points s.score <| trim_points pid a p)::d)
      S16 -> ({ s | slice16 = b }, (Delta S16 <| add_points s.score <| trim_points pid a p)::d)
      S15 -> ({ s | slice15 = b }, (Delta S15 <| add_points s.score <| trim_points pid a p)::d)
      SB -> ({ s | sliceBull = b }, (Delta SB <| add_points s.score <| trim_points pid a p)::d)
    check pid cs h x d a = cascade (cs, DeltaNone::d)
      [ (get cs a == Slice0, cascade (set cs a Slice1 d) 
        -- ^ Single Tally on an Empty
        [ ( x == DoubleHit, set cs a Slice2 d)
        -- ^ Double Tally on an Empty
        , ( x == TripleHit, set cs a SliceOpen d)
        -- ^ Triple Tally on an Empty Opens
        ] )
      , (get cs a  == Slice1, cascade (set cs a Slice2 d)
        -- ^ Single Tally on a Single
        [ ( x == DoubleHit, set cs a SliceOpen d)
        -- ^ Double Tally on a Single Opens
        , ( x == TripleHit, set_with_score pid cs a SliceOpen d (hit_base_points h))
         -- ^ Triple Tally on a Double that isn't closed awards points
        ] )
      , (get cs a == SliceOpen, set_with_score pid cs a SliceOpen d (hit_points h))
        -- ^ Points awarded for hitting an Open
      , (get cs a  == SliceClosed, (cs, DeltaNone::d)) 
        -- ^ Closed, issues no points
      ]
    add_points (Score s) i = Score (s + i)

    calc_hit pid h (s, d) = case h of
      Hit20 x -> check pid s h x d S20
      Hit19 x -> check pid s h x d S19
      Hit18 x -> check pid s h x d S18
      Hit17 x -> check pid s h x d S17
      Hit16 x -> check pid s h x d S16
      Hit15 x -> check pid s h x d S15
      HitBullseye -> check pid s h SingleHit d SB
      HitDoubleBullseye -> check pid s h DoubleHit d SB
      _ -> (s, DeltaNone::d)

    add (Score a) (Score b) = Score (a + b)

    tally s slice delta = case slice of
      S20 -> if s.slice20 == SliceOpen || s.slice20 == SliceClosed then s.score else add s.score delta
      S19 -> if s.slice19 == SliceOpen || s.slice19 == SliceClosed then s.score else add s.score delta
      S18 -> if s.slice18 == SliceOpen || s.slice18 == SliceClosed then s.score else add s.score delta
      S17 -> if s.slice17 == SliceOpen || s.slice17 == SliceClosed then s.score else add s.score delta
      S16 -> if s.slice16 == SliceOpen || s.slice16 == SliceClosed then s.score else add s.score delta
      S15 -> if s.slice15 == SliceOpen || s.slice15 == SliceClosed then s.score else add s.score delta
      SB -> if s.sliceBull == SliceOpen || s.sliceBull == SliceClosed then s.score else add s.score delta
      

    apply_delta_to_score d (pid, s) = case d of
      DeltaNone -> (pid, s)
      Delta slice delta -> (pid, { s | score = tally s slice delta })

    apply_deltas_to_score pid ps dl (oid, os) acc = 
      if pid == oid
      then (pid, ps)::acc
      else (List.foldl apply_delta_to_score (oid, os) dl)::acc

    apply_deltas_to_scores pid (ps, dl) = List.foldr (apply_deltas_to_score pid ps dl) [] sl

    calc_deltas pid s = List.foldr (calc_hit pid) (s, []) hl

    apply_golf_score =
      case player_id_at c sl of
        Nothing -> sl
        Just pid -> case find_by_id pid sl of
          Nothing -> sl
          Just ps -> apply_deltas_to_scores pid <|calc_deltas pid ps

    all_open l a = 
      let
        open (_, s) = case a of
          S20 -> s.slice20 == SliceOpen
          S19 -> s.slice19 == SliceOpen
          S18 -> s.slice18 == SliceOpen
          S17 -> s.slice17 == SliceOpen
          S16 -> s.slice16 == SliceOpen
          S15 -> s.slice15 == SliceOpen
          SB -> s.sliceBull == SliceOpen
      in
        List.all open l

    close l a =
      let
        change (p, s) = case a of
          S20 -> (p, { s | slice20 = SliceClosed })
          S19 -> (p, { s | slice19 = SliceClosed })
          S18 -> (p, { s | slice18 = SliceClosed })
          S17 -> (p, { s | slice17 = SliceClosed })
          S16 -> (p, { s | slice16 = SliceClosed })
          S15 -> (p, { s | slice15 = SliceClosed })
          SB -> (p, { s | sliceBull = SliceClosed })
      in
        List.map change l

    close_slice a l =
      if all_open l a
      then close l a
      else l

    post_process l = 
      close_slice S20 <|
      close_slice S19 <|
      close_slice S18 <|
      close_slice S17 <|
      close_slice S16 <|
      close_slice S15 <|
      close_slice SB l

  in
    post_process <| apply_golf_score
