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
    encode_hit_score (h, (Score s)) = JE.object
      [ ("hit", encode_hit h)
      , ("score", JE.int s)
      ]
    encode_score s = case s of
      NoScore -> JE.object 
        [ ("type", JE.string "NoScore")
        , ("value", JE.int 0)
        ]
      NumbersScore (Score ns) -> JE.object
        [ ("type", JE.string "NUMS")
        , ("value", JE.int ns)]
      AroundTheClockScore h -> JE.object
        [ ("type", JE.string ("ATCS"))
        , ("value", encode_hits h)]
      AroundTheClock180Score hs -> JE.object
        [ ("type", JE.string ("ATCS180S"))
        , ("value", JE.list encode_hit_score hs)
        ]
      BaseballScore is -> JE.object
        [ ("type", JE.string ("BBLS"))
        , ("value", JE.list encode_inning_score is)
        ]
      ChaseTheDragonScore h -> JE.object
        [ ("type", JE.string ("CTDS"))
        , ("value", encode_hits h)
        ]
      CricketScore sh -> JE.object
        [ ("type", JE.string ("CS"))
        , ("value", encode_score_hits sh)
        ]

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

    encode_player_index (PlayerIndex i) = JE.int i

    encode_player_hits (PlayerHits l) = encode_hits l
    
    encode_player { name, initials, hits, score, index } = JE.object 
      [ ("name", encode_player_name name)
      , ("initials", encode_player_initials initials)
      , ("hits", encode_player_hits hits )
      , ("score", encode_score score )
      , ("index", encode_player_index index )
      ]
    encode_list_player l = JE.list encode_player l

    encode_num_var_i v = case v of
      BasicIn -> "BI"
      DoubleIn -> "DI"
      TripleIn -> "TI"

    encode_num_var_o v = case v of
      BasicOut -> "BO"
      DoubleOut -> "DO"
      TripleOut -> "TO"
    
    encode_atc_var v = case v of
      NoBullOut -> "ST"
      AnyBullOut -> "BO"
      SplitBullOut -> "SO"

    encode_atc_180_var v = case v of
      DoubleBonus -> "DBL"
      TripleBonus -> "TPL"

    encode_bbl_var v = case v of
      BasicBaseball -> "BSC"
      SeventhInningCatch -> "SIC"

    encode_ctd_var v = case v of
      BasicDragon -> "SC"
      TripleHeadedDragon -> "TD"

    encode_ckt_var v = case v of
      BasicCricket -> "B"
      GolfCricket -> "G"

    encode_game_mode mode = case mode of
      NoGame -> JE.string "NoGame"
      Numbers701 i o -> JE.string <| "701:" ++ encode_num_var_i i ++ ":" ++ encode_num_var_o o
      Numbers501 i o -> JE.string <| "501:" ++ encode_num_var_i i ++ ":" ++ encode_num_var_o o
      Numbers301 i o -> JE.string <| "301:" ++ encode_num_var_i i ++ ":" ++ encode_num_var_o o
      AroundTheClock v -> JE.string <| "ATC:" ++ encode_atc_var v
      AroundTheClock180 v -> JE.string <| "ATC180:" ++ encode_atc_180_var v
      Baseball v -> JE.string <| "BBL:" ++ encode_bbl_var v
      ChaseTheDragon v -> JE.string <| "CTD:" ++ encode_ctd_var v
      Cricket v -> JE.string <| "CKT:" ++ encode_ckt_var v

    encode_screen s = case s of
      Home -> JE.string "HOME"
      EditPlayers _ _ -> JE.string "EDITPLAYERS"
      SelectGame -> JE.string "SELECTGAME"
      PlayGame _ -> JE.string "PLAYGAME"

  in
    JE.object
    [ ("playerData", encode_list_player state.playerData)
    , ("game", encode_game_mode state.game)
    , ("screen", encode_screen state.screen)
    , ("playing", JE.bool state.playing)
    , ("currentPlayer", JE.int state.currentPlayer)
    , ("currentTurn", encode_hits state.currentTurn)
    ]
