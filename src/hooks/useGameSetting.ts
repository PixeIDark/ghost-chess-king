import { useState } from "react";
import type { Color } from "../types/chess.ts";

export const useGameSetting = () => {
  const [gameMode, setGameMode] = useState<"solo" | "ai" | null>(null);
  const [playerColor, setPlayerColor] = useState<Color | null>(null);
  const isReadyToPlay = gameMode !== null && playerColor !== null;

  return { gameMode, playerColor, isReadyToPlay, setGameMode, setPlayerColor };
};
