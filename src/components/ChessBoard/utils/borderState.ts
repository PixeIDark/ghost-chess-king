import type { Board, Color } from "../../../constants/board.ts";
import type { Advice } from "../../../hooks/useAdvice.ts";
import type { SelectedSquare } from "../hooks/useChessBoard.ts";
import { isCheckedSquare, isSelectedSquare, isValidMoveSquare } from "./boardView.ts";

export const getBorderState = (
  board: Board,
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
