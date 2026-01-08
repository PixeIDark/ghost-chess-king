import { useGameTimer } from "@/pages/game/components/TimerDisplay/hooks/useGameTimer";
import { Side } from "@ghost-chess-king/shared";

interface TimerDisplayProps {
  whiteTime: number;
  blackTime: number;
  currentTurn: Side;
  isGameActive: boolean;
}

function TimerDisplay({
  whiteTime: initialWhiteTime,
  blackTime: initialBlackTime,
  currentTurn,
  isGameActive,
}: TimerDisplayProps) {
  const { whiteTime, blackTime } = useGameTimer({
    whiteTime: initialWhiteTime,
    blackTime: initialBlackTime,
    currentTurn,
    isGameActive,
  });

  return (
    <>
      <div>백: {Math.floor(whiteTime / 1000)}초</div>
      <div>흑: {Math.floor(blackTime / 1000)}초</div>
    </>
  );
}

export default TimerDisplay;
