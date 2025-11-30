import { useGameTimer } from "./hooks/useGameTimer";
import type { Side } from "./types/chess";

interface TimerDisplayProps {
  whiteTime: number;
  blackTime: number;
  currentTurn: Side;
  isGameActive: boolean;
}

export const TimerDisplay = ({
  whiteTime: initialWhiteTime,
  blackTime: initialBlackTime,
  currentTurn,
  isGameActive,
}: TimerDisplayProps) => {
  const { whiteTime, blackTime } = useGameTimer({
    whiteTime: initialWhiteTime,
    blackTime: initialBlackTime,
    currentTurn,
    isGameActive,
  });

  console.log(initialBlackTime, initialWhiteTime);

  return (
    <>
      <div>백: {Math.floor(whiteTime / 1000)}초</div>
      <div>흑: {Math.floor(blackTime / 1000)}초</div>
    </>
  );
};
