import { PLAYER_TIME_LIMIT } from "../constants/game.ts";

interface TimerProps {
  time: number;
  player: "white" | "black";
  playerColor: "white" | "black";
}

const playerConfig = {
  white: { label: "화이트" },
  black: { label: "블랙" },
};

const getDisplayName = (isCurrentPlayer: boolean): string => {
  if (isCurrentPlayer) return "당신";
  return "상대";
};

const getContainerStyle = (isLowTime: boolean, isCurrentPlayer: boolean): string => {
  if (isLowTime && isCurrentPlayer) return "border-red-500 bg-red-500/10";
  if (isCurrentPlayer) return "border-blue-500 bg-blue-500/10";

  return "border-gray-600 bg-gray-700/50";
};

const getTimeStyle = (isLowTime: boolean, isCurrentPlayer: boolean): string => {
  if (isLowTime && isCurrentPlayer) return "text-red-400";
  if (isCurrentPlayer) return "text-blue-300";

  return "text-gray-300";
};

function Timer({ time, player, playerColor }: TimerProps) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const isCurrentPlayer = player === playerColor;
  const isLowTime = time < PLAYER_TIME_LIMIT / 10;
  const config = playerConfig[player];
  const displayName = getDisplayName(isCurrentPlayer);
  const containerStyle = getContainerStyle(isLowTime, isCurrentPlayer);
  const timeStyle = getTimeStyle(isLowTime, isCurrentPlayer);

  return (
    <div className={`rounded-lg border px-6 py-4 text-center transition ${containerStyle}`}>
      <p className="text-xs font-medium text-gray-400">
        {displayName} · {config.label}
      </p>
      <p className={`mt-2 font-mono text-3xl font-bold ${timeStyle}`}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </p>
    </div>
  );
}

export default Timer;
