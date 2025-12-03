import { useEffect, useState } from "react";
import type { Side } from "../../../../../types/chess.ts";

interface UseGameTimerProps {
  whiteTime: number;
  blackTime: number;
  currentTurn: Side;
  isGameActive: boolean;
}

const INTERVAL_MS = 1000;
const DECREMENT_MS = 1000;
const MIN_TIME = 0;

export const useGameTimer = ({
  whiteTime: initialWhiteTime,
  blackTime: initialBlackTime,
  currentTurn,
  isGameActive,
}: UseGameTimerProps) => {
  const [whiteTime, setWhiteTime] = useState(initialWhiteTime);
  const [blackTime, setBlackTime] = useState(initialBlackTime);

  useEffect(() => {
    if (!isGameActive) return;

    const interval = setInterval(() => {
      if (currentTurn === "white") setWhiteTime((prev) => Math.max(MIN_TIME, prev - DECREMENT_MS));
      else setBlackTime((prev) => Math.max(MIN_TIME, prev - DECREMENT_MS));
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, [currentTurn, isGameActive]);

  return { whiteTime, blackTime };
};
