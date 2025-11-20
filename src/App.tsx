import { useState } from "react";
import { type Board, initialBoard } from "./constants/board.ts";
import ColorSelector from "./components/ColorSelector.tsx";
import { ChessBoard } from "./components/ChessBoard";
import { useAIMove } from "./hooks/useAiMove.ts";

function App() {
  const [playerColor, setPlayerColor] = useState<"white" | "black" | null>(null);
  const [board, setBoard] = useState<Board>(initialBoard);
  const [currentTurn, setCurrentTurn] = useState<"white" | "black">("white");
  const handleBoardChange = (newBoard: Board) => {
    setBoard(newBoard);
    setCurrentTurn(currentTurn === "white" ? "black" : "white");
  };

  useAIMove(board, currentTurn, playerColor, handleBoardChange);

  if (playerColor === null) return <ColorSelector onColorSelect={setPlayerColor} />;

  return (
    <ChessBoard board={board} onBoardChange={handleBoardChange} playerColor={playerColor} currentTurn={currentTurn} />
  );
}

export default App;
