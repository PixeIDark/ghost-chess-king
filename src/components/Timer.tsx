interface TimerProps {
  time: number;
  player: "white" | "black";
  playerColor: "white" | "black";
}

function Timer({ time, player, playerColor }: TimerProps) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const isCurrentPlayer = player === playerColor;
  const displayName = isCurrentPlayer ? "당신" : "상대";
  const playerLabel = player === "white" ? "화이트" : "블랙";
  const isLowTime = time < 60;

  return (
    <div className={`rounded-lg border px-6 py-4 text-center transition ${
      isCurrentPlayer
        ? "border-blue-500 bg-blue-500/10"
        : "border-gray-600 bg-gray-700/50"
    } ${isLowTime && isCurrentPlayer ? "border-red-500 bg-red-500/10" : ""}`}>
      <p className="text-xs font-medium text-gray-400">{displayName} · {playerLabel}</p>
      <p className={`mt-2 font-mono text-3xl font-bold ${
        isLowTime && isCurrentPlayer
          ? "text-red-400"
          : isCurrentPlayer ? "text-blue-300" : "text-gray-300"
      }`}>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </p>
    </div>
  );
}

export default Timer;