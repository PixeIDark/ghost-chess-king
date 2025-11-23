import { type Board, type Color } from "../../constants/board.ts";
import { type SelectedSquare, useChessBoard } from "./hooks/useChessBoard.ts";
import { getDisplayBoard, isCheckedSquare, isSelectedSquare, isValidMoveSquare } from "./utils/boardView.ts";
import { Square } from "./Square";

interface ChessBoardProps {
  board: Board;
  onUpdateGameState: (newBoard: Board) => void;
  playerColor: "white" | "black";
  currentTurn: "white" | "black";
  gameMode: null | "ai" | "solo";
}

function ChessBoard({ board, onUpdateGameState, playerColor, currentTurn, gameMode }: ChessBoardProps) {
  const { selectedSquare, validMoves, handleSquareClick } = useChessBoard(
    board,
    playerColor,
    currentTurn,
    onUpdateGameState,
    gameMode
  );
  const displayBoard = getDisplayBoard(board, playerColor);

  const getBorderState = (
    row: number,
    col: number,
    playerColor: Color,
    selectedSquare: SelectedSquare,
    validMoves: [number, number][]
  ) => {
    if (isSelectedSquare(selectedSquare, row, col, playerColor)) return "selected";
    if (isValidMoveSquare(validMoves, row, col, playerColor)) return "movable";
    if (isCheckedSquare(board, row, col, playerColor)) return "checked";

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
