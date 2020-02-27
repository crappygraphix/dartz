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

    decode_hit_score : JD.Decoder (Hit, Score)
    decode_hit_score =
      JD.map2
      (\h s -> (h, Score s))
      (JD.field "hit" decode_hit)
      (JD.field "score" JD.int)

    decode_atcs_score : JD.Decoder GameScore
    decode_atcs_score =
      JD.map AroundTheClockScore (JD.field "value" <| JD.list decode_hit)

    decode_atcs180_score : JD.Decoder GameScore
    decode_atcs180_score =
      JD.map AroundTheClock180Score (JD.field "value" <| JD.list decode_hit_score)

    decode_bbls_score : JD.Decoder GameScore
    decode_bbls_score =
      JD.map BaseballScore (JD.field "value" <| JD.list decode_inning_score)

    decode_ctds_score : JD.Decoder GameScore
    decode_ctds_score =
      JD.map ChaseTheDragonScore (JD.field "value" <| JD.list decode_hit)

    decode_cs_score : JD.Decoder GameScore
    decode_cs_score =
      JD.map CricketScore (JD.field "value" <| decode_score_hits)

    decode_game_score_from_game : String -> JD.Decoder GameScore
    decode_game_score_from_game g =
      case g of
        "NoScore" -> JD.map (\_ -> NoScore) (JD.field "value" JD.int)
        "NUMS" -> JD.map (\s -> NumbersScore (Score s)) (JD.field "value" JD.int)
        "ATCS" -> decode_atcs_score
        "ATCS180S" -> decode_atcs180_score
        "BBLS" -> decode_bbls_score
        "CTDS" -> decode_ctds_score
        "CS" -> decode_cs_score
        _ -> JD.fail ("Invalid game type: " ++ g)

    decode_game_score : JD.Decoder GameScore
    decode_game_score = 
      JD.field "type" JD.string |> JD.andThen decode_game_score_from_game
      
    decode_player_name : JD.Decoder PlayerName
    decode_player_name = JD.map PlayerName JD.string

    decode_player_index : JD.Decoder PlayerIndex
    decode_player_index = JD.map PlayerIndex JD.int

    decode_player_hits : JD.Decoder PlayerHits
    decode_player_hits = JD.map PlayerHits <| JD.list decode_hit
    
    decode_player : JD.Decoder Player
    decode_player = JD.map4 Player
      (JD.field "name" decode_player_name)
      (JD.field "hits" decode_player_hits)
      (JD.field "score" decode_game_score)
      (JD.field "index" decode_player_index)
    
    decode_list_player : JD.Decoder (List Player)
    decode_list_player = JD.list decode_player

    string_to_num_var_i v = case v of
      "TI" -> TripleIn
      "DI" -> DoubleIn
      _ -> BasicIn

    string_to_num_var_o v = case v of
      "TO" -> TripleOut
      "DO" -> DoubleOut
      _ -> BasicOut
    
    string_to_atc_var v = case v of
      "BO" -> AnyBullOut
      "SO" -> SplitBullOut
      _ -> NoBullOut

    string_to_atc_180_var v = case v of
      "TPL" -> TripleBonus
      _ -> DoubleBonus

    string_to_bbl_var v = case v of
      "SIC" -> SeventhInningCatch
      _ -> BasicBaseball

    string_to_ctd_var v = case v of
      "TD" -> TripleHeadedDragon
      _ -> BasicDragon

    string_to_ckt_var v = case v of
      "G" -> GolfCricket
      _ -> BasicCricket

    decode_game : JD.Decoder GameMode
    decode_game = JD.map (\s -> case String.split ":" s of
      ["NoGame"] -> NoGame
      ["701", i, o] -> Numbers701 (string_to_num_var_i i) (string_to_num_var_o o)
      ["501", i, o] -> Numbers501 (string_to_num_var_i i) (string_to_num_var_o o)
      ["301", i, o] -> Numbers301 (string_to_num_var_i i) (string_to_num_var_o o)
      ["ATC", v] -> AroundTheClock (string_to_atc_var v)
      ["ATC180", v] -> AroundTheClock180 (string_to_atc_180_var v)
      ["BBL", v] -> Baseball (string_to_bbl_var v)
      ["CTD", v] -> ChaseTheDragon (string_to_ctd_var v)
      ["CKT", v] -> Cricket (string_to_ckt_var v)
      _ -> NoGame
      ) JD.string

    decode_screen : JD.Decoder Screen
    decode_screen = JD.map (\s -> case s of
      "EDITPLAYERS" -> EditPlayers (NewPlayerName "")
      "SELECTGAME" -> SelectGame
      "PLAYGAME" -> PlayGame Nothing
      _ -> Home
      ) JD.string
  in
    JD.map6 AppState
    (JD.field "playerData" decode_list_player)
    (JD.field "game" decode_game)
    (JD.field "screen" decode_screen)
    (JD.field "playing" JD.bool)
    (JD.field "currentPlayer" JD.int)
    (JD.field "currentTurn" <| JD.list decode_hit)
    