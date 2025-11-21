import { useState } from "react";
import ColorSelector from "./components/ColorSelector.tsx";
import { ChessBoard } from "./components/ChessBoard";
import { useAIMove } from "./hooks/useAiMove.ts";
import Timer from "./components/Timer.tsx";
import { useGameState } from "./hooks/useGameState.ts";

function App() {
  const [playerColor, setPlayerColor] = useState<"white" | "black" | null>(null);
  const { board, currentTurn, winner, status, whiteTime, blackTime, updateGameState } = useGameState();
  useAIMove(board, currentTurn, playerColor, updateGameState);

  if (playerColor === null) return <ColorSelector onColorSelect={setPlayerColor} />;

  const opponentColor = playerColor === "white" ? "black" : "white";
  const opponentTime = opponentColor === "white" ? whiteTime : blackTime;
  const playerTime = playerColor === "white" ? whiteTime : blackTime;

  return (
    <div className="flex flex-col items-center">
      <Timer time={opponentTime} player={opponentColor} playerColor={playerColor} />
      <ChessBoard board={board} updateGameState={updateGameState} playerColor={playerColor} currentTurn={currentTurn} />
      <Timer time={playerTime} player={playerColor} playerColor={playerColor} />
      {winner && (
        <p>
          승자는... {winner}! {status}!
        </p>
      )}
    </div>
  );
}

export default App;
