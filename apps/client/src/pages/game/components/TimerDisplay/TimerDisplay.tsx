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
    <div className="mt-4 flex w-full max-w-[640px] justify-between gap-4">
      <div
        className={`flex flex-1 items-center justify-between rounded-xl px-4 py-3 font-mono text-lg shadow-sm transition-all ${currentTurn === "white" ? "bg-white ring-2 ring-amber-400" : "bg-white/80"}`}
      >
        <span className="font-semibold text-neutral-700">백</span>
        <span className="text-neutral-900 tabular-nums">{Math.floor(whiteTime / 1000)}초</span>
      </div>
      <div
        className={`flex flex-1 items-center justify-between rounded-xl px-4 py-3 font-mono text-lg shadow-sm transition-all ${currentTurn === "black" ? "bg-neutral-800 ring-2 ring-amber-400" : "bg-neutral-800/90"}`}
      >
        <span className="font-semibold text-neutral-200">흑</span>
        <span className="text-white tabular-nums">{Math.floor(blackTime / 1000)}초</span>
      </div>
    </div>
  );
}

export default TimerDisplay;
