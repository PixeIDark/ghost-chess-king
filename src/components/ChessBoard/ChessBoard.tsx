import { type Board } from "../../constants/board.ts";
import Square from "./Square.tsx";
import { useChessBoard } from "./useChessBoard.ts";
import { getDisplayBoard, isSelectedSquare, isValidMoveSquare } from "./helper.ts";

interface ChessBoardProps {
  board: Board;
  updateGameState: (newBoard: Board) => void;
  playerColor: "white" | "black";
  currentTurn: "white" | "black";
}

function ChessBoard({ board, updateGameState, playerColor, currentTurn }: ChessBoardProps) {
  const { selectedSquare, validMoves, handleSquareClick } = useChessBoard(
    board,
    playerColor,
    currentTurn,
    updateGameState
  );
  const displayBoard = getDisplayBoard(board, playerColor);

  return (
    <div>
      <div className="m-auto w-fit">
        {displayBoard.map((row, displayRowIndex) => (
          <div className="flex" key={displayRowIndex}>
            {row.map((square, displayColIndex) => (
              <Square
                onSquareClick={handleSquareClick}
                square={square}
                rowIndex={displayRowIndex}
                colIndex={displayColIndex}
                isSelected={isSelectedSquare(selectedSquare, displayRowIndex, displayColIndex, playerColor)}
                canMoveSquare={isValidMoveSquare(validMoves, displayRowIndex, displayColIndex, playerColor)}
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
