import { useEffect, useState } from "react";

export const useGameTimer = (currentTurn: "white" | "black", onTimeout: (losingColor: "white" | "black") => void) => {
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentTurn === "white") {
        setWhiteTime((prev) => {
          if (prev - 1 <= 0) {
            onTimeout("white");
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev - 1 <= 0) {
            onTimeout("black");
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

  return { whiteTime, blackTime, addTime };
};
