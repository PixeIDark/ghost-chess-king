import { useEffect, useState } from "react";

const LIMITED_SECONDS = 600;

export const useGameTimer = (currentTurn: "white" | "black", onTimeout: (losingColor: "white" | "black") => void) => {
  const [whiteTime, setWhiteTime] = useState(LIMITED_SECONDS);
  const [blackTime, setBlackTime] = useState(LIMITED_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTurn === "white") {
        setWhiteTime((prev) => {
          if (prev - 1 <= 0) {
            onTimeout("black");
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev - 1 <= 0) {
            onTimeout("white");
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTurn, onTimeout]);

  const addTime = (color: "white" | "black") => {
    if (color === "white") setWhiteTime((prev) => prev + 2);
    else setBlackTime((prev) => prev + 2);
  };

  const resetTime = () => {
    setWhiteTime(LIMITED_SECONDS);
    setBlackTime(LIMITED_SECONDS);
  };

  return { whiteTime, blackTime, addTime, resetTime };
};
