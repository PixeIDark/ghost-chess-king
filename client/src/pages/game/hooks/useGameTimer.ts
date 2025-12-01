import { useEffect, useState } from "react";
import type { Side } from "../../../types/chess.ts";

interface UseGameTimerProps {
  whiteTime: number;
  blackTime: number;
  currentTurn: Side;
  isGameActive: boolean;
}

export const useGameTimer = ({
  whiteTime: initialWhiteTime,
  blackTime: initialBlackTime,
  currentTurn,
  isGameActive,
}: UseGameTimerProps) => {
  const [whiteTime, setWhiteTime] = useState(initialWhiteTime);
  const [blackTime, setBlackTime] = useState(initialBlackTime);

  // TODO: 잘 작동하는데, 매직넘버 죽여라
  useEffect(() => {
    if (!isGameActive) return;

    const interval = setInterval(() => {
      if (currentTurn === "white") setWhiteTime((prev) => Math.max(0, prev - 1000));
      else setBlackTime((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTurn, isGameActive]);

  return { whiteTime, blackTime };
};
