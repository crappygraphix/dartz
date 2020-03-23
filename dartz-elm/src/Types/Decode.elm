module Types.Decode exposing (..)

import Json.Decode as JD

import Types exposing (..)

app_state_decoder = 
  let    
    decode_hit : JD.Decoder Hit
    decode_hit = 
      JD.map (\h -> case h of
        "M" -> HitMissed
        "S1" -> Hit1 SingleHit
        "D1" -> Hit1 DoubleHit
        "T1" -> Hit1 TripleHit
        "S2" -> Hit2 SingleHit
        "D2" -> Hit2 DoubleHit
        "T2" -> Hit2 TripleHit
        "S3" -> Hit3 SingleHit
        "D3" -> Hit3 DoubleHit
        "T3" -> Hit3 TripleHit
        "S4" -> Hit4 SingleHit
        "D4" -> Hit4 DoubleHit
        "T4" -> Hit4 TripleHit
        "S5" -> Hit5 SingleHit
        "D5" -> Hit5 DoubleHit
        "T5" -> Hit5 TripleHit
        "S6" -> Hit6 SingleHit
        "D6" -> Hit6 DoubleHit
        "T6" -> Hit6 TripleHit
        "S7" -> Hit7 SingleHit
        "D7" -> Hit7 DoubleHit
        "T7" -> Hit7 TripleHit
        "S8" -> Hit8 SingleHit
        "D8" -> Hit8 DoubleHit
        "T8" -> Hit8 TripleHit
        "S9" -> Hit9 SingleHit
        "D9" -> Hit9 DoubleHit
        "T9" -> Hit9 TripleHit
        "S10" -> Hit10 SingleHit
        "D10" -> Hit10 DoubleHit
        "T10" -> Hit10 TripleHit
        "S11" -> Hit11 SingleHit
        "D11" -> Hit11 DoubleHit
        "T11" -> Hit11 TripleHit
        "S12" -> Hit12 SingleHit
        "D12" -> Hit12 DoubleHit
        "T12" -> Hit12 TripleHit
        "S13" -> Hit13 SingleHit
        "D13" -> Hit13 DoubleHit
        "T13" -> Hit13 TripleHit
        "S14" -> Hit14 SingleHit        
        "D14" -> Hit14 DoubleHit
        "T14" -> Hit14 TripleHit
        "S15" -> Hit15 SingleHit
        "D15" -> Hit15 DoubleHit
        "T15" -> Hit15 TripleHit
        "S16" -> Hit16 SingleHit
        "D16" -> Hit16 DoubleHit
        "T16" -> Hit16 TripleHit
        "S17" -> Hit17 SingleHit
        "D17" -> Hit17 DoubleHit
        "T17" -> Hit17 TripleHit
        "S18" -> Hit18 SingleHit
        "D18" -> Hit18 DoubleHit
        "T18" -> Hit18 TripleHit
        "S19" -> Hit19 SingleHit
        "D19" -> Hit19 DoubleHit
        "T19" -> Hit19 TripleHit
        "S20" -> Hit20 SingleHit
        "D20" -> Hit20 DoubleHit
        "T20" -> Hit20 TripleHit
        "Bull" -> HitBullseye
        "DBull" -> HitDoubleBullseye        
        _ -> HitMissed
      ) JD.string

    decode_hits : JD.Decoder (List Hit)
    decode_hits = JD.list decode_hit

    decode_score_hits : JD.Decoder (Score, List Hit)
    decode_score_hits =
      JD.map2 
      (\s l -> (Score s, l))
      (JD.field "score" JD.int)
      (JD.field "hits" <| JD.list decode_hit)
      
    decode_inning_score : JD.Decoder (Inning, Score)
    decode_inning_score =
      JD.map2
      (\i s -> (Inning i, Score s))
      (JD.field "inning" JD.int)
      (JD.field "score" JD.int)
    decode_inning_scores = JD.list decode_inning_score

    decode_hit_score : JD.Decoder (Hit, Score)
    decode_hit_score =
      JD.map2
      (\h s -> (h, Score s))
      (JD.field "hit" decode_hit)
      (JD.field "score" JD.int)
    decode_hit_scores = JD.list decode_hit_score

    decode_ckt_score : JD.Decoder (PlayerID, CricketScore)
    decode_ckt_score = JD.map2
      (\i l -> (PlayerID i, CricketScore l))
      (JD.field "playerId" JD.int)
      (JD.field "score" decode_score_hits)
    decode_ckt_scores = JD.list decode_ckt_score

    decode_ctd_score : JD.Decoder (PlayerID, ChaseTheDragonScore)
    decode_ctd_score = JD.map2
      (\i l -> (PlayerID i, ChaseTheDragonScore l))
      (JD.field "playerId" JD.int)
      (JD.field "score" decode_hits)
    decode_ctd_scores = JD.list decode_ctd_score

    decode_bbl_score : JD.Decoder (PlayerID, BaseballScore)
    decode_bbl_score = JD.map2
      (\i l -> (PlayerID i, BaseballScore l))
      (JD.field "playerId" JD.int)
      (JD.field "score" decode_inning_scores)
    decode_bbl_scores = JD.list decode_bbl_score

    decode_atc_180_score : JD.Decoder (PlayerID, AroundTheClock180Score)
    decode_atc_180_score = JD.map2
      (\i l -> (PlayerID i, AroundTheClock180Score l))
      (JD.field "playerId" JD.int)
      (JD.field "score" decode_hit_scores)
    decode_atc_180_scores = JD.list decode_atc_180_score

    decode_atc_score : JD.Decoder (PlayerID, AroundTheClockScore)
    decode_atc_score = JD.map2
      (\i l -> (PlayerID i, AroundTheClockScore l))
      (JD.field "playerId" JD.int)
      (JD.field "score" decode_hits)
    decode_atc_scores = JD.list decode_atc_score

    decode_numbers_score : JD.Decoder (PlayerID, NumbersScore)
    decode_numbers_score = JD.map2 
      (\i n -> (PlayerID i, NumbersScore (Score n)))
      (JD.field "playerId" JD.int)
      (JD.field "score" JD.int)

    decode_numbers_scores = JD.list decode_numbers_score
      
    decode_player_name : JD.Decoder PlayerName
    decode_player_name = JD.map PlayerName JD.string

    decode_player_initials : JD.Decoder PlayerInitials
    decode_player_initials = JD.map PlayerInitials JD.string

    decode_player_id : JD.Decoder PlayerID
    decode_player_id = JD.map PlayerID JD.int

    decode_player_hits : JD.Decoder PlayerHits
    decode_player_hits = JD.map PlayerHits <| JD.list decode_hit
    
    decode_player : JD.Decoder Player
    decode_player = JD.map4 
      Player
      (JD.field "name" decode_player_name)
      (JD.field "initials" decode_player_initials)
      (JD.field "hits" decode_player_hits)
      (JD.field "id" decode_player_id)
    
    decode_list_player : JD.Decoder (List Player)
    decode_list_player = JD.list decode_player

    decode_num_var_i = JD.map (\v -> case v of
      "TI" -> TripleIn
      "DI" -> DoubleIn
      _ -> BasicIn
      ) JD.string

    decode_num_var_o = JD.map (\v -> case v of
      "TO" -> TripleOut
      "DO" -> DoubleOut
      _ -> BasicOut
      ) JD.string
    
    decode_atc_var = JD.map (\v -> case v of
      "BO" -> AnyBullOut
      "SO" -> SplitBullOut
      _ -> NoBullOut
      ) JD.string

    decode_atc_180_var = JD.map (\v -> case v of
      "TPL" -> TripleBonus
      _ -> DoubleBonus
      ) JD.string

    decode_bbl_var = JD.map (\v -> case v of
      "SIC" -> SeventhInningCatch
      _ -> BasicBaseball
      ) JD.string

    decode_ctd_var = JD.map (\v -> case v of
      "TD" -> TripleHeadedDragon
      _ -> BasicDragon
      ) JD.string

    decode_ckt_var = JD.map (\v -> case v of
      "G" -> GolfCricket
      _ -> BasicCricket
      ) JD.string

    decode_game_state_type : String -> JD.Decoder GameState
    decode_game_state_type s = case s of
      "701" -> JD.map5 Numbers701 
        (JD.field "in" decode_num_var_i)
        (JD.field "out" decode_num_var_o)
        (JD.field "current" JD.int)
        (JD.field "turn" decode_hits)
        (JD.field "scores" decode_numbers_scores)
      "501" -> JD.map5 Numbers501
        (JD.field "in" decode_num_var_i)
        (JD.field "out" decode_num_var_o)
        (JD.field "current" JD.int)
        (JD.field "turn" decode_hits)
        (JD.field "scores" decode_numbers_scores)
      "301" -> JD.map5 Numbers301
        (JD.field "in" decode_num_var_i)
        (JD.field "out" decode_num_var_o)
        (JD.field "current" JD.int)
        (JD.field "turn" decode_hits)
        (JD.field "scores" decode_numbers_scores)
      "ATC" -> JD.map4 AroundTheClock
        (JD.field "variant" decode_atc_var)
        (JD.field "current" JD.int)
        (JD.field "turn" decode_hits)
        (JD.field "scores" decode_atc_scores)
      "ATC180" -> JD.map4 AroundTheClock180
        (JD.field "variant" decode_atc_180_var)
        (JD.field "current" JD.int)
        (JD.field "turn" decode_hits)
        (JD.field "scores" decode_atc_180_scores)
      "BBL" -> JD.map4 Baseball
        (JD.field "variant" decode_bbl_var)
        (JD.field "current" JD.int)
        (JD.field "turn" decode_hits)
        (JD.field "scores" decode_bbl_scores)
      "CTD" -> JD.map4 ChaseTheDragon
        (JD.field "variant" decode_ctd_var)
        (JD.field "current" JD.int)
        (JD.field "turn" decode_hits)
        (JD.field "scores" decode_ctd_scores)
      "CKT" -> JD.map4 Cricket
        (JD.field "variant" decode_ckt_var)
        (JD.field "current" JD.int)
        (JD.field "turn" decode_hits)
        (JD.field "scores" decode_ckt_scores)
      _ -> JD.succeed NoGame

    decode_game_state : JD.Decoder GameState
    decode_game_state = JD.field "type" JD.string
      |> JD.andThen decode_game_state_type    

    decode_screen : JD.Decoder Screen
    decode_screen = JD.map (\s -> case s of
      "EDITPLAYERS" -> EditPlayers (NewPlayerName "") (NewPlayerInitials "")
      "SELECTGAME" -> SelectGame
      "PLAYGAME" -> PlayGame Nothing
      _ -> Home
      ) JD.string
  in
    JD.map4 AppState
    (JD.field "players" decode_list_player)
    (JD.field "game" decode_game_state)
    (JD.field "screen" decode_screen)
    (JD.field "playing" JD.bool)
    