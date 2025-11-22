import { type Board, type Color } from "../../constants/board.ts";
import { type SelectedSquare, useChessBoard } from "./hooks/useChessBoard.ts";
import { getDisplayBoard, isSelectedSquare, isValidMoveSquare } from "./utils/boardView.ts";
import { Square } from "./Square";

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

  // 타입을 최하위 계층에 저장해야함 순환참조
  const getBorderState = (
    row: number,
    col: number,
    playerColor: Color,
    selectedSquare: SelectedSquare,
    validMoves: [number, number][]
  ) => {
    if (isSelectedSquare(selectedSquare, row, col, playerColor)) return "selected";
    if (isValidMoveSquare(validMoves, row, col, playerColor)) return "movable";

    return "none";
  };

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
                borderState={getBorderState(displayRowIndex, displayColIndex, playerColor, selectedSquare, validMoves)}
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
