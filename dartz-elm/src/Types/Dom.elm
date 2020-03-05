module Types.Dom exposing (..)

import Html exposing (Html, div, span, text, option, button, select, input, tr, td, table, p)
import Html.Attributes exposing (class, placeholder, selected, value)
import Html.Events exposing (onClick, onInput)

import Types exposing (..)
import Types.Text exposing (..)

id_to_game : String -> GameMode
id_to_game s = case s of  
  "301:BI:BO" -> Numbers301 BasicIn BasicOut
  "301:BI:DO" -> Numbers301 BasicIn DoubleOut
  "301:BI:TO" -> Numbers301 BasicIn TripleOut
  "301:DI:BO" -> Numbers301 DoubleIn BasicOut
  "301:DI:DO" -> Numbers301 DoubleIn DoubleOut
  "301:DI:TO" -> Numbers301 DoubleIn TripleOut
  "301:TI:BO" -> Numbers301 TripleIn BasicOut
  "301:TI:DO" -> Numbers301 TripleIn DoubleOut
  "301:TI:TO" -> Numbers301 TripleIn TripleOut

  "501:BI:BO" -> Numbers501 BasicIn BasicOut
  "501:BI:DO" -> Numbers501 BasicIn DoubleOut
  "501:BI:TO" -> Numbers501 BasicIn TripleOut
  "501:DI:BO" -> Numbers501 DoubleIn BasicOut
  "501:DI:DO" -> Numbers501 DoubleIn DoubleOut
  "501:DI:TO" -> Numbers501 DoubleIn TripleOut
  "501:TI:BO" -> Numbers501 TripleIn BasicOut
  "501:TI:DO" -> Numbers501 TripleIn DoubleOut
  "501:TI:TO" -> Numbers501 TripleIn TripleOut

  "701:BI:BO" -> Numbers701 BasicIn BasicOut
  "701:BI:DO" -> Numbers701 BasicIn DoubleOut
  "701:BI:TO" -> Numbers701 BasicIn TripleOut
  "701:DI:BO" -> Numbers701 DoubleIn BasicOut
  "701:DI:DO" -> Numbers701 DoubleIn DoubleOut
  "701:DI:TO" -> Numbers701 DoubleIn TripleOut
  "701:TI:BO" -> Numbers701 TripleIn BasicOut
  "701:TI:DO" -> Numbers701 TripleIn DoubleOut
  "701:TI:TO" -> Numbers701 TripleIn TripleOut

  "CKT:B" -> Cricket BasicCricket
  "CKT:G" -> Cricket GolfCricket

  "BBL:B" -> Baseball BasicBaseball
  "BBL:S" -> Baseball SeventhInningCatch

  "ATC:NBO" -> AroundTheClock NoBullOut
  "ATC:ABO" -> AroundTheClock AnyBullOut
  "ATC:SBO" -> AroundTheClock SplitBullOut

  "180:DB" -> AroundTheClock180 DoubleBonus
  "180:TB" -> AroundTheClock180 TripleBonus

  "CTD:BD" -> ChaseTheDragon BasicDragon
  "CTD:TD" -> ChaseTheDragon TripleHeadedDragon

  _ -> NoGame

game_to_id : GameMode -> String
game_to_id mode = case mode of
  NoGame -> "NGM"

  Numbers301 BasicIn BasicOut -> "301:BI:BO"
  Numbers301 BasicIn DoubleOut -> "301:BI:DO"
  Numbers301 BasicIn TripleOut -> "301:BI:TO"
  Numbers301 DoubleIn BasicOut -> "301:DI:BO"
  Numbers301 DoubleIn DoubleOut -> "301:DI:DO"
  Numbers301 DoubleIn TripleOut -> "301:DI:TO"
  Numbers301 TripleIn BasicOut -> "301:TI:BO"
  Numbers301 TripleIn DoubleOut -> "301:TI:DO"
  Numbers301 TripleIn TripleOut -> "301:TI:TO"

  Numbers501 BasicIn BasicOut -> "501:BI:BO"
  Numbers501 BasicIn DoubleOut -> "501:BI:DO"
  Numbers501 BasicIn TripleOut -> "501:BI:TO"
  Numbers501 DoubleIn BasicOut -> "501:DI:BO"
  Numbers501 DoubleIn DoubleOut -> "501:DI:DO"
  Numbers501 DoubleIn TripleOut -> "501:DI:TO"
  Numbers501 TripleIn BasicOut -> "501:TI:BO"
  Numbers501 TripleIn DoubleOut -> "501:TI:DO"
  Numbers501 TripleIn TripleOut -> "501:TI:TO"

  Numbers701 BasicIn BasicOut -> "701:BI:BO"
  Numbers701 BasicIn DoubleOut -> "701:BI:DO"
  Numbers701 BasicIn TripleOut -> "701:BI:TO"
  Numbers701 DoubleIn BasicOut -> "701:DI:BO"
  Numbers701 DoubleIn DoubleOut -> "701:DI:DO"
  Numbers701 DoubleIn TripleOut -> "701:DI:TO"
  Numbers701 TripleIn BasicOut -> "701:TI:BO"
  Numbers701 TripleIn DoubleOut -> "701:TI:DO"
  Numbers701 TripleIn TripleOut -> "701:TI:TO"

  Cricket BasicCricket -> "CKT:B"
  Cricket GolfCricket -> "CKT:G"

  Baseball BasicBaseball -> "BBL:B"
  Baseball SeventhInningCatch -> "BBL:S"

  AroundTheClock NoBullOut -> "ATC:NBO"
  AroundTheClock AnyBullOut -> "ATC:ABO"
  AroundTheClock SplitBullOut -> "ATC:SBO"

  AroundTheClock180 DoubleBonus -> "180:DB"
  AroundTheClock180 TripleBonus -> "180:TB"

  ChaseTheDragon BasicDragon -> "CTD:BD"
  ChaseTheDragon TripleHeadedDragon -> "CTD:TD"

game_name : GameMode -> Html msg
game_name mode =
  case mode of
    NoGame -> span [] [ text "No Game Selected" ]
    Numbers701 vi vo -> span [] [ text "701 : ", text (numbers_variation_in_text vi), text "/", text (numbers_variation_out_text vo)]
    Numbers501 vi vo -> span [] [ text "501 : ", text (numbers_variation_in_text vi), text "/", text (numbers_variation_out_text vo)]      
    Numbers301 vi vo -> span [] [ text "301 : ", text (numbers_variation_in_text vi), text "/", text (numbers_variation_out_text vo)]            
    AroundTheClock v -> span [] [ text "Around the Clock : ", text (around_the_clock_variation_text v)]
    AroundTheClock180 v -> span [] [ text "Around the Clock 180 : ", text (around_the_clock_180_variation_text v)]    
    Baseball v -> span [] [ text "Baseball : ", text (baseball_variation_text v)]
    ChaseTheDragon v -> span [] [ text "Chase the Dragon : ", text (dragon_variation_text v)]
    Cricket v -> span [] [ text "Cricket : ", text (cricket_variation_text v)]

game_to_option : GameMode -> GameMode -> Html msg
game_to_option current mode =
  let 
    is_selected = if shallow_eq (game_to_id current) (game_to_id mode) then [ selected True ] else []
    shallow_eq c m = List.head (String.split ":" c) == List.head (String.split ":" m)
  in
    case mode of
      NoGame -> option ([ value <| game_to_id mode ] ++ is_selected) [ text "Select a Game" ]
      Numbers701 _ _ -> option ([ value <| game_to_id mode ] ++ is_selected) [ text "701" ]
      Numbers501 _ _ -> option ([ value <| game_to_id mode ] ++ is_selected) [ text "501" ]
      Numbers301 _ _ -> option ([ value <| game_to_id mode ] ++ is_selected) [ text "301" ]
      AroundTheClock _ -> option ([ value <| game_to_id mode ] ++ is_selected) [ text "Around the Clock" ]
      AroundTheClock180 _ -> option ([ value <| game_to_id mode ] ++ is_selected) [ text "Around the Clock 180" ]
      Baseball _ -> option ([ value <| game_to_id mode ] ++ is_selected) [ text "Baseball" ]
      ChaseTheDragon _ -> option ([ value <| game_to_id mode ] ++ is_selected) [ text "Chase the Dragon" ]
      Cricket _ -> option ([ value <| game_to_id mode ] ++ is_selected) [ text "Cricket" ]

game_description : GameMode -> Html msg
game_description mode =
  case mode of
    NoGame         -> span [] []
    Numbers701 _ _ -> span []
      [ p [] [ text "Total score of a 3 dart turn is deducted from the player's starting number of 701." ]
      , p [] [ text "Inner bull is 50, outter bull is 25." ]
      , p [] [ text "Winner must reach EXACTLY 0 points." ]
      , p [] [ text "If 0 is reached before finishing a turn, the turn is over, it is a win." ]
      , p [] [ text "If the turn results in a less than 0 score, called a Bust, no points are deducted for that turn." ]
      , p [] [ text "Variations:" ]
      , p [] [ text "Double In / Triple In : Requires double or triple hits during the opening turn in order to begin point deduction." ]
      , p [] [ text "Double Out / Triple Out : Requires double or triple hits during the ending turn in order to end the game. Busts happen on a turn score of 1 or 2 respectively." ]
      ]
    Numbers501 _ _ ->  span []
      [ p [] [ text "Total score of a 3 dart turn is deducted from the player's starting number of 501." ]
      , p [] [ text "Inner bull is 50, outter bull is 25." ]
      , p [] [ text "Winner must reach EXACTLY 0 points." ]
      , p [] [ text "If 0 is reached before finishing a turn, the turn is over, it is a win." ]
      , p [] [ text "If the turn results in a less than 0 score, called a Bust, no points are deducted for that turn." ]
      , p [] [ text "Variations:" ]
      , p [] [ text "Double In / Triple In : Requires double or triple hits during the opening turn in order to begin point deduction." ]
      , p [] [ text "Double Out / Triple Out : Requires double or triple hits during the ending turn in order to end the game. Busts happen on a turn score of 1 or 2 respectively." ]
      ]
    Numbers301 _ _ ->  span []
      [ p [] [ text "Total score of a 3 dart turn is deducted from the player's starting number of 301." ]
      , p [] [ text "Inner bull is 50, outter bull is 25." ]
      , p [] [ text "Winner must reach EXACTLY 0 points." ]
      , p [] [ text "If 0 is reached before finishing a turn, the turn is over, it is a win." ]
      , p [] [ text "If the turn results in a less than 0 score, called a Bust, no points are deducted for that turn." ]
      , p [] [ text "Variations:" ]
      , p [] [ text "Double In / Triple In : Requires double or triple hits during the opening turn in order to begin point deduction." ]
      , p [] [ text "Double Out / Triple Out : Requires double or triple hits during the ending turn in order to end the game. Busts happen on a turn score of 1 or 2 respectively." ]
      ]
    AroundTheClock _ ->  span []
      [ p [] [ text "Each player takes a 3 dart turn." ]
      , p [] [ text "Objective is to hit 1 to 20 in order." ]
      , p [] [ text "The player can not move on to the next number until the target number is hit, starting at 1." ]
      , p [] [ text "The target number increments after a successful hit on the current target number, so at most a player can advance 3 numbers in a turn." ]
      , p [] [ text "The first player to hit 20 wins." ]
      , p [] [ text "Doubles and triples count as a normal hit." ]
      , p [] [ text "Variations:" ]
      , p [] [ text "Bull Out : After 20, player must hit double or single bullseye to win." ]
      , p [] [ text "Split Bull Out : After 20, player must hit the outter bullseye, then the inner bullseye to win." ]
      ]
    AroundTheClock180 _ ->  span []
      [ p [] [ text "For the game, choose if triples or doubles will reward bonus points." ]
      , p [] [ text "Each player takes a 3 dart turn." ]
      , p [] [ text "Objective is to hit 1 to 20 in order." ]
      , p [] [ text "The player can not move on to the next number until the target number is hit, starting at 1." ]
      , p [] [ text "The target number increments after a successful hit on the current target number, so at most a player can advance 3 numbers in a turn." ]
      , p [] [ text "Points are only issued on hits to the target number. Hits to old or future numbers do not issue points." ]
      , p [] [ text "A normal hit is worth 1 point. A hit to a double or triple (depending on what was chosen for the game) is worth 3 points." ]
      , p [] [ text "Players who hit 20 are done with their turns." ]
      , p [] [ text "When all players finish, the one with the most points wins." ]
      ]
    Baseball _ ->  span []
      [ p [] [ text "Each player takes a 3 dart turn." ]
      , p [] [ text "There are 9 innings and the inning increments each round." ]
      , p [] [ text "Players target the number based on the inning, so board positions 1 to 9 will be used." ]
      , p [] [ text "Hitting the target number gives 1 run. Doubles and triples give 2 and 3 runs respectively." ]
      , p [] [ text "Ties at the end of the 9th inning are broken by adding additional innings where the bullseye is the target." ]
      , p [] [ text "Player with the most points wins." ]
      , p [] [ text "Variations: " ]
      , p [] [ text "Seventh Inning Catch : No hits in the 7th inning results in the player's score being cut in half, rounded up." ]
      ]
    ChaseTheDragon _ ->  span []
      [ p [] [ text "Each player takes a 3 dart turn." ]
      , p [] [ text "Objective is to hit triples of 10 to 20 in order, followed by the outter then inner bullseye." ]
      , p [] [ text "The player can not move on to the next number until the target number triple is hit, starting at 10." ]
      , p [] [ text "The target number increments after a successful hit on the current target number, so at most a player can advance 3 numbers in a turn." ]
      , p [] [ text "The first player to hit the inner bullseye wins." ]
      , p [] [ text "Variations:" ]
      , p [] [ text "Three Headed Dragon : Player must complete the 10 to 20, outter bullseye, inner bullseye pattern 3 times to win." ]
      ]
    Cricket _ -> span []
      [ p [] [ text "Each player takes a 3 dart turn." ]
      , p [] [ text "The targets are 15 to 20 and the inner and outter bullseye." ]
      , p [] [ text "A player can attempt to hit any target in any order during their turn." ]
      , p [] [ text "Objective is for a player to open all targets and earn the most points." ]
      , p [] [ text "Each player must open their own targets, one player opening a target does not open it for all other players." ]
      , p [] [ text "A player marks unopened targets with dart hits. A regular hit is 1 mark, a double hit is 2 marks, and a triple hit is 3 marks." ]
      , p [] [ text "A target is open when it has 3 marks." ]
      , p [] [ text "If all players have opened a target, it becomes closed for all players." ]
      , p [] [ text "A player can earn points by hitting their open targets. Points are rewarded based on the number of the target, double and triple multipliers apply." ]
      , p [] [ text "No points are rewarded for hits to closed targets." ]
      , p [] [ text "The game ends when all targets have been closed. The player with the most points wins." ]
      , p [] [ text "Variations:" ]
      , p [] [ text "Golf : Gameplay is the same, but any points a player earns during a turn are given to all other players who have not yet opened the target. Once all targets are closed the player with the least points wins." ]
      ]
