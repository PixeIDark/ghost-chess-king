import { useEffect, useRef, useState } from "react";
import { PLAYER_TIME_LIMIT } from "../constants/board.ts";

export const useGameTimer = (
  currentTurn: "white" | "black",
  isReadyToPlay: boolean,
  onTimeout: (losingColor: "white" | "black") => void
) => {
  const [whiteTime, setWhiteTime] = useState(PLAYER_TIME_LIMIT);
  const [blackTime, setBlackTime] = useState(PLAYER_TIME_LIMIT);
  const intervalRef = useRef<number | null>(null);

  const clearExistingInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!isReadyToPlay) return;
    clearExistingInterval();

    intervalRef.current = setInterval(() => {
      if (currentTurn === "white") {
        setWhiteTime((prev) => {
          if (prev - 1 <= 0) {
            clearExistingInterval();
            onTimeout("white");
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev - 1 <= 0) {
            clearExistingInterval();
            onTimeout("black");
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return clearExistingInterval;
  }, [currentTurn, onTimeout, isReadyToPlay]);

  const addTime = (color: "white" | "black") => {
    if (color === "white") setWhiteTime((prev) => prev + 2);
    else setBlackTime((prev) => prev + 2);
  };

  const resetTime = () => {
    clearExistingInterval();
    setWhiteTime(PLAYER_TIME_LIMIT);
    setBlackTime(PLAYER_TIME_LIMIT);
  };

  return { whiteTime, blackTime, addTime, resetTime };
};
