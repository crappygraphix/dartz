module Cascade exposing (..)

cascade : a -> List (Bool, a) -> a
cascade def l = 
  let
    check (b, a) acc = case acc of
      Nothing -> if b then Just a else acc
      v -> v
  in
    case List.foldl check Nothing l of
      Just a -> a
      Nothing -> def