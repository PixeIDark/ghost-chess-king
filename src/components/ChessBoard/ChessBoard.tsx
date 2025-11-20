import { useState } from "react";
import { type Board } from "../../constants/board.ts";
import { movePiece } from "./move.ts";
import Square from "./Square.tsx";
import { getValidMoves } from "./pieceRule.ts";
import { isSameColor } from "./same.ts";

interface ChessBoardProps {
  board: Board;
  onBoardChange: (newBoard: Board) => void;
  playerColor: "white" | "black";
  currentTurn: "white" | "black";
}

function ChessBoard({ board, onBoardChange, playerColor, currentTurn }: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<{ row: number | null; col: number | null }>({
    row: null,
    col: null,
  });

  const displayBoard = playerColor === "black" ? board.map((row) => [...row].reverse()).reverse() : board;

  const getActualCoords = (displayRow: number, displayCol: number): [number, number] => {
    if (playerColor === "black") return [7 - displayRow, 7 - displayCol];
    else return [displayRow, displayCol];
  };

  const handleSquareClick = (displayRow: number, displayCol: number) => {
    if (currentTurn !== playerColor) return;

    const [actualRow, actualCol] = getActualCoords(displayRow, displayCol);
    const { row: fromRow, col: fromCol } = selectedSquare;

    if ((fromRow === null || fromCol === null) && board[actualRow][actualCol]?.color === playerColor) {
      setSelectedSquare({ row: actualRow, col: actualCol });
      return;
    }

    if (fromRow === null || fromCol === null) return;

    const validMoves = getValidMoves(board, fromRow, fromCol);
    const isValidMove = validMoves.some(([r, c]) => r === actualRow && c === actualCol);
    const clickedPiece = board[actualRow][actualCol];
    const selectedPiece = board[fromRow][fromCol];

    if (isSameColor(clickedPiece, selectedPiece) || !isValidMove) {
      setSelectedSquare({ row: null, col: null });
      return;
    }

    const newBoard = movePiece(board, fromRow, fromCol, actualRow, actualCol);
    setSelectedSquare({ row: null, col: null });
    onBoardChange(newBoard);
  };

  return (
    <div>
      <div className="mb-4 text-center">
        <p className="text-sm">{`너는 ${playerColor}`}</p>
      </div>
      <div className="m-auto w-fit border border-blue-200">
        {displayBoard.map((row, displayRowIndex) => (
          <div className="flex" key={displayRowIndex}>
            {row.map((square, displayColIndex) => (
              <Square
                onSquareClick={handleSquareClick}
                square={square}
                rowIndex={displayRowIndex}
                colIndex={displayColIndex}
                key={displayColIndex}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChessBoard;
