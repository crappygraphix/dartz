module Game exposing (finalize_turn, new_game, player_added, player_removed, record_toss, current_player_id, hits)

import Types exposing (..)

hits : GameState -> List Hit
hits g = 
  case g of
    NoGame -> []
    Numbers701 _ _ _ h _ -> h
    Numbers501 _ _ _ h _ -> h
    Numbers301 _ _ _ h _ -> h
    AroundTheClock _ _ h _ -> h
    AroundTheClock180 _ _ h _ -> h
    Baseball _ _ h _ -> h
    ChaseTheDragon _ _ h _ -> h
    Cricket _ _ h _ -> h

record_toss : Hit -> GameState -> GameState
record_toss n g = 
  let
    apply h = List.take 3 <| n :: h
  in
    case g of
      NoGame -> NoGame
      Numbers701 i o c h s -> Numbers701 i o c (apply h) s
      Numbers501 i o c h s -> Numbers501 i o c (apply h) s
      Numbers301 i o c h s -> Numbers301 i o c (apply h) s
      AroundTheClock v c h s -> AroundTheClock v c (apply h) s
      AroundTheClock180 v c h s -> AroundTheClock180 v c (apply h) s
      Baseball v c h s -> Baseball v c (apply h) s
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
    Baseball _ c _ s -> player_id_at c s
    ChaseTheDragon _ c _ s -> player_id_at c s
    Cricket _ c _ s -> player_id_at c s

player_added : List Player -> GameState -> GameState
player_added l g =
  let
    find pid sl = List.foldl (\(spid, s) acc -> if spid == pid && acc == Nothing then Just (spid, s) else Nothing) Nothing sl
    add_missing f s p = case find p.id s of
      Nothing -> f p
      Just v -> v
    fix_scores f s = List.map (add_missing f s) l
  in
    case g of
      NoGame -> NoGame
      Numbers701 i o c h s -> Numbers701 i o c h (fix_scores new_num_score s)
      Numbers501 i o c h s -> Numbers501 i o c h (fix_scores new_num_score s)
      Numbers301 i o c h s -> Numbers301 i o c h (fix_scores new_num_score s)
      AroundTheClock v c h s -> AroundTheClock v c h (fix_scores new_atc_score s)
      AroundTheClock180 v c h s -> AroundTheClock180 v c h (fix_scores new_atc_180_score s)
      Baseball v c h s -> Baseball v c h (fix_scores new_bbl_score s)
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
      Baseball v c h s -> Baseball v (fix_current c) h (fix_scores s)
      ChaseTheDragon v c h s -> ChaseTheDragon v (fix_current c) h (fix_scores s)
      Cricket v c h s -> Cricket v (fix_current c) h (fix_scores s)

new_game : GameState -> List Player -> GameState
new_game mode players = case mode of
  NoGame -> NoGame
  Numbers701 i o _ _ _ -> Numbers701 i o 0 [] (new_num_scores players)
  Numbers501 i o _ _ _ -> Numbers501 i o 0 [] (new_num_scores players)
  Numbers301 i o _ _ _ -> Numbers301 i o 0 [] (new_num_scores players)
  AroundTheClock v _ _ _ -> AroundTheClock v 0 [] (new_atc_scores players)
  AroundTheClock180 v _ _ _ -> AroundTheClock180 v 0 [] (new_atc_180_scores players)
  Baseball v _ _ _ -> Baseball v 0 [] (new_bbl_scores players)
  ChaseTheDragon v _ _ _ -> ChaseTheDragon v 0 [] (new_ctd_scores players)
  Cricket v _ _ _ -> Cricket v 0 [] (new_ckt_scores players)

new_num_score : Player -> (PlayerID, NumbersScore)
new_num_score p = (p.id, NumbersScore (Score 0))
new_num_scores : List Player -> List (PlayerID, NumbersScore)
new_num_scores l = List.map new_num_score l

new_atc_score : Player -> (PlayerID, AroundTheClockScore)
new_atc_score p = (p.id, AroundTheClockScore [])
new_atc_scores : List Player -> List (PlayerID, AroundTheClockScore)
new_atc_scores l = List.map new_atc_score l

new_atc_180_score : Player -> (PlayerID, AroundTheClock180Score)
new_atc_180_score p = (p.id, AroundTheClock180Score [])
new_atc_180_scores : List Player -> List (PlayerID, AroundTheClock180Score)
new_atc_180_scores l = List.map new_atc_180_score l

new_bbl_score : Player -> (PlayerID, BaseballScore)
new_bbl_score p = (p.id, List.range 1 9 |> List.map (\i -> (Inning i, Score 0)) |> BaseballScore)
new_bbl_scores : List Player -> List (PlayerID, BaseballScore)
new_bbl_scores l = List.map new_bbl_score l

new_ctd_score : Player -> (PlayerID, ChaseTheDragonScore)
new_ctd_score p = (p.id, ChaseTheDragonScore [])
new_ctd_scores : List Player -> List (PlayerID, ChaseTheDragonScore)
new_ctd_scores l = List.map new_ctd_score l

new_ckt_score : Player -> (PlayerID, CricketScore)
new_ckt_score p = (p.id, CricketScore (Score 0, []))
new_ckt_scores : List Player -> List (PlayerID, CricketScore)
new_ckt_scores l = List.map new_ckt_score l


next_player : Int -> List a -> Int
next_player i l = 
  if i == List.length l - 1
  then 0
  else i + 1

increment_player : GameState -> GameState
increment_player g = 
  case g of
    NoGame -> NoGame
    Numbers701 i o c h s -> Numbers701 i o (next_player c s) h s
    Numbers501 i o c h s -> Numbers501 i o (next_player c s) h s
    Numbers301 i o c h s -> Numbers301 i o (next_player c s) h s
    AroundTheClock v c h s -> AroundTheClock v (next_player c s) h s
    AroundTheClock180 v c h s -> AroundTheClock180 v (next_player c s) h s
    Baseball v c h s -> Baseball v (next_player c s) h s
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
    Baseball v c _ s -> Baseball v c [] s
    ChaseTheDragon v c _ s -> ChaseTheDragon v c [] s
    Cricket v c _ s -> Cricket v c [] s

finalize_turn : GameState -> GameState
finalize_turn state =
  let
    apply_score =
      case state of
        NoGame -> NoGame
        Numbers701 i o c h s -> Numbers701 i o c h <| numbers 701 i o c h s
        Numbers501 i o c h s -> Numbers501 i o c h <| numbers 501 i o c h s
        Numbers301 i o c h s -> Numbers301 i o c h <| numbers 301 i o c h s
        AroundTheClock v c h s -> AroundTheClock v c h <| around_the_clock v c h s
        AroundTheClock180 v c h s -> AroundTheClock180 v c h <| around_the_clock_180 v c h s
        Baseball v c h s -> Baseball v c h <| baseball v c h s
        ChaseTheDragon v c h s -> ChaseTheDragon v c h <| chase_the_dragon v c h s
        Cricket v c h s -> Cricket v c h <| cricket v c h s
  in
    clear_hits <| increment_player <| apply_score

find_by_id : PlayerID -> List (PlayerID, a) -> Maybe a
find_by_id p l =
  let
    check (i, a) acc = case acc of
      Nothing -> if p == i then Just a else Nothing 
      v -> v
  in
    List.foldr check Nothing l
  

numbers : Int -> NumbersInVariation -> NumbersOutVariation -> Int -> List Hit -> List (PlayerID, NumbersScore) -> List (PlayerID, NumbersScore)
numbers goal i o c h s = 
  case player_id_at c s of
    Nothing -> s
    Just pid -> s

around_the_clock : AroundTheClockVariation -> Int -> List Hit -> List (PlayerID, AroundTheClockScore) -> List (PlayerID, AroundTheClockScore)
around_the_clock v c h s = 
  case player_id_at c s of
    Nothing -> s
    Just pid -> s
  
around_the_clock_180 : AroundTheClock180Variation -> Int -> List Hit -> List (PlayerID, AroundTheClock180Score) -> List (PlayerID, AroundTheClock180Score)
around_the_clock_180 v c h s = 
  case player_id_at c s of
    Nothing -> s
    Just pid -> s
  
baseball : BaseballVariation -> Int -> List Hit -> List (PlayerID, BaseballScore) -> List (PlayerID, BaseballScore)
baseball v c h s = 
  case player_id_at c s of
    Nothing -> s
    Just pid -> s
  
chase_the_dragon : DragonVariation -> Int -> List Hit -> List (PlayerID, ChaseTheDragonScore) -> List (PlayerID, ChaseTheDragonScore)
chase_the_dragon v c h s = 
  case player_id_at c s of
    Nothing -> s
    Just pid -> s
  
cricket : CricketVariation -> Int -> List Hit -> List (PlayerID, CricketScore) -> List (PlayerID, CricketScore)
cricket v c h s = 
  case player_id_at c s of
    Nothing -> s
    Just pid -> s 
  