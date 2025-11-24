import { useChessBoard } from "./hooks/useChessBoard.ts";
import { getDisplayBoard } from "../../utils/boardUtils.ts";
import type { Advice } from "../../hooks/useAdvice.ts";
import { getBorderState } from "./utils/borderState.ts";
import type { Board, Color, GameMode } from "../../types/chess.ts";
import { Square } from "./Square";

interface ChessBoardProps {
  board: Board;
  onUpdateGameState: (newBoard: Board) => void;
  playerColor: Color;
  currentTurn: Color;
  gameMode: GameMode;
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
                  board,
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
