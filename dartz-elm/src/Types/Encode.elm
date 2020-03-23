module Types.Encode exposing (..)

import Json.Encode as JE

import Types exposing (..)

encode_app_state : AppState -> JE.Value
encode_app_state state = 
  let
    encode_score_hits ((Score s), l) = JE.object
      [ ("score", JE.int s)
      , ("hits", encode_hits l)
      ]
    encode_inning_score (Inning i, (Score s)) = JE.object
      [ ("inning", JE.int i)
      , ("score", JE.int i)
      ]
    encode_inning_scores l = JE.list encode_inning_score l

    encode_hit_score (h, (Score s)) = JE.object
      [ ("hit", encode_hit h)
      , ("score", JE.int s)
      ]
    encode_hit_scores l = JE.list encode_hit_score l
    
    encode_numbers_score (i, NumbersScore (Score ns)) = JE.object
      [ ("playerId", encode_player_id i)
      , ("score", JE.int ns)
      ]
    encode_numbers_scores l = JE.list encode_numbers_score l

    encode_atc_score (i, AroundTheClockScore hits) = JE.object
      [ ("playerId", encode_player_id i)
      , ("score", encode_hits hits)]
    encode_atc_scores l = JE.list encode_atc_score l

    encode_atc_180_score (i, AroundTheClock180Score l) = JE.object
      [ ("playerId", encode_player_id i)
      , ("score", encode_hit_scores l)]
    encode_atc_180_scores l = JE.list encode_atc_180_score l

    encode_bbl_score (i, BaseballScore l) = JE.object
      [ ("playerId", encode_player_id i)
      , ("score", encode_inning_scores l)
      ]
    encode_bbl_scores l = JE.list encode_bbl_score l

    encode_ctd_score (i, ChaseTheDragonScore l) = JE.object
      [ ("playerId", encode_player_id i)
      , ("score", encode_hits l)
      ]
    encode_ctd_scores l = JE.list encode_ctd_score l

    encode_ckt_score (i, CricketScore l) = JE.object
      [ ("playerId", encode_player_id i)
      , ("score", encode_score_hits l)
      ]
    encode_ckt_scores l = JE.list encode_ckt_score l

    encode_sub_hit s = case s of
      SingleHit -> "S"
      DoubleHit -> "D"
      TripleHit -> "T"

    encode_hit h = JE.string <| case h of
      HitMissed -> "M"
      Hit1 s -> encode_sub_hit s ++ "1"
      Hit2 s -> encode_sub_hit s ++ "2"
      Hit3 s -> encode_sub_hit s ++ "3"
      Hit4 s -> encode_sub_hit s ++ "4"
      Hit5 s -> encode_sub_hit s ++ "5"
      Hit6 s -> encode_sub_hit s ++ "6"
      Hit7 s -> encode_sub_hit s ++ "7"
      Hit8 s -> encode_sub_hit s ++ "8"
      Hit9 s -> encode_sub_hit s ++ "9"
      Hit10 s -> encode_sub_hit s ++ "10"
      Hit11 s -> encode_sub_hit s ++ "11"
      Hit12 s -> encode_sub_hit s ++ "12"
      Hit13 s -> encode_sub_hit s ++ "13"
      Hit14 s -> encode_sub_hit s ++ "14"
      Hit15 s -> encode_sub_hit s ++ "15"
      Hit16 s -> encode_sub_hit s ++ "16"
      Hit17 s -> encode_sub_hit s ++ "17"
      Hit18 s -> encode_sub_hit s ++ "18"
      Hit19 s -> encode_sub_hit s ++ "19"
      Hit20 s -> encode_sub_hit s ++ "20"
      HitBullseye -> "Bull"
      HitDoubleBullseye -> "DBull"
       
    encode_hits l = JE.list encode_hit l

    encode_player_name (PlayerName name) = JE.string name

    encode_player_initials (PlayerInitials i) = JE.string i

    encode_player_id (PlayerID i) = JE.int i

    encode_player_hits (PlayerHits l) = encode_hits l
    
    encode_player { name, initials, hits, id } = JE.object 
      [ ("name", encode_player_name name)
      , ("initials", encode_player_initials initials)
      , ("hits", encode_player_hits hits )
      , ("id", encode_player_id id )
      ]
    encode_list_player l = JE.list encode_player l

    encode_num_var_i v = JE.string <| case v of
      BasicIn -> "BI"
      DoubleIn -> "DI"
      TripleIn -> "TI"

    encode_num_var_o v = JE.string <| case v of
      BasicOut -> "BO"
      DoubleOut -> "DO"
      TripleOut -> "TO"
    
    encode_atc_var v = JE.string <| case v of
      NoBullOut -> "ST"
      AnyBullOut -> "BO"
      SplitBullOut -> "SO"

    encode_atc_180_var v = JE.string <| case v of
      DoubleBonus -> "DBL"
      TripleBonus -> "TPL"

    encode_bbl_var v = JE.string <| case v of
      BasicBaseball -> "BSC"
      SeventhInningCatch -> "SIC"

    encode_ctd_var v = JE.string <| case v of
      BasicDragon -> "SC"
      TripleHeadedDragon -> "TD"

    encode_ckt_var v = JE.string <| case v of
      BasicCricket -> "B"
      GolfCricket -> "G"

    encode_game_state s = case s of
      NoGame -> JE.object 
        [ ("type", JE.string "NoGame")
        ]
      Numbers701 i o current hits scores -> JE.object
        [ ("type", JE.string "701")
        , ("in", encode_num_var_i i)
        , ("out", encode_num_var_o o)
        , ("current", JE.int current)
        , ("turn", encode_hits hits)
        , ("scores", encode_numbers_scores scores)]
      Numbers501 i o current hits scores -> JE.object
        [ ("type", JE.string "501")
        , ("in", encode_num_var_i i)
        , ("out", encode_num_var_o o)
        , ("current", JE.int current)
        , ("turn", encode_hits hits)
        , ("scores", encode_numbers_scores scores)]
      Numbers301 i o current hits scores -> JE.object
        [ ("type", JE.string "301")
        , ("in", encode_num_var_i i)
        , ("out", encode_num_var_o o)
        , ("current", JE.int current)
        , ("turn", encode_hits hits)
        , ("scores", encode_numbers_scores scores)]
      AroundTheClock v current hits scores -> JE.object
        [ ("type", JE.string "ATC")
        , ("variant", encode_atc_var v)
        , ("current", JE.int current)
        , ("turn", encode_hits hits)
        , ("scores", encode_atc_scores scores)
        ]
      AroundTheClock180 v current hits scores -> JE.object
        [ ("type", JE.string "ATC180")
        , ("variant", encode_atc_180_var v)
        , ("current", JE.int current)
        , ("turn", encode_hits hits)
        , ("scores", encode_atc_180_scores scores)
        ]
      Baseball v current hits scores -> JE.object
        [ ("type", JE.string "BBL")
        , ("variant", encode_bbl_var v)
        , ("current", JE.int current)
        , ("turn", encode_hits hits)
        , ("scores", encode_bbl_scores scores)
        ]
      ChaseTheDragon v current hits scores -> JE.object
        [ ("type", JE.string "CTD")
        , ("variant", encode_ctd_var v)
        , ("current", JE.int current)
        , ("turn", encode_hits hits)
        , ("scores", encode_ctd_scores scores)
        ]
      Cricket v current hits scores -> JE.object
        [ ("type", JE.string "CKT")
        , ("variant", encode_ckt_var v)
        , ("current", JE.int current)
        , ("turn", encode_hits hits)
        , ("scores", encode_ckt_scores scores)
        ]

    encode_screen s = case s of
      Home -> JE.string "HOME"
      EditPlayers _ _ -> JE.string "EDITPLAYERS"
      SelectGame -> JE.string "SELECTGAME"
      PlayGame _ -> JE.string "PLAYGAME"

  in
    JE.object
    [ ("players", encode_list_player state.players)
    , ("game", encode_game_state state.game)
    , ("screen", encode_screen state.screen)
    , ("playing", JE.bool state.playing)
    ]
