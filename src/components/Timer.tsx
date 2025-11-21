interface TimerProps {
  time: number;
  player: "white" | "black";
  playerColor: "white" | "black";
}

function Timer({ time, player, playerColor }: TimerProps) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="my-4 text-center">
      <p className="text-sm">
        {player === playerColor ? "당신" : "상대"} ({player}) - {minutes}분 {seconds}초
      </p>
    </div>
  );
}

export default Timer;
