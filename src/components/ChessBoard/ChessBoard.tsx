import { type Board, type Color } from "../../constants/board.ts";
import { type SelectedSquare, useChessBoard } from "./hooks/useChessBoard.ts";
import { isCheckedSquare, isSelectedSquare, isValidMoveSquare } from "./utils/boardView.ts";
import { Square } from "./Square";
import { getDisplayBoard } from "../../utils/boardUtils.ts";
import type { Advice } from "../../hooks/useAdvice.ts";

interface ChessBoardProps {
  board: Board;
  onUpdateGameState: (newBoard: Board) => void;
  playerColor: "white" | "black";
  currentTurn: "white" | "black";
  gameMode: null | "ai" | "solo";
  advice: Advice;
}

function ChessBoard({ board, onUpdateGameState, playerColor, currentTurn, gameMode, advice }: ChessBoardProps) {
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
    advice: Advice,
    selectedSquare: SelectedSquare,
    validMoves: [number, number][]
  ) => {
    if (isSelectedSquare(selectedSquare, row, col, playerColor)) return "selected";
    if (advice && advice.fromRow === row && advice.fromCol === col) return "advisedFrom";
    if (advice && advice.toRow === row && advice.toCol === col) return "advisedTo";
    if (isValidMoveSquare(validMoves, row, col, playerColor)) return "movable";
    if (isCheckedSquare(board, row, col, playerColor)) return "checked";

    return "none";
  };

  return (
    <div className="rounded-lg bg-gradient-to-br from-gray-900 to-black p-2">
      <div className="m-auto w-fit">
        {displayBoard.map((row, displayRowIndex) => (
          <div className="flex" key={displayRowIndex}>
            {row.map((square, displayColIndex) => (
              <Square
                onSquareClick={handleSquareClick}
                square={square}
                rowIndex={displayRowIndex}
                colIndex={displayColIndex}
                borderState={getBorderState(
                  displayRowIndex,
                  displayColIndex,
                  playerColor,
                  advice,
                  selectedSquare,
                  validMoves
                )}
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