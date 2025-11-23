import type { Board, Color } from "../../../constants/board.ts";
import { isKingInCheck } from "../../../utils/legalityChecker.ts";
import { getActualCoords } from "../../../utils/boardUtils.ts";

export const isValidMoveSquare = (
  validMoves: [number, number][],
  displayRowIndex: number,
  displayColIndex: number,
  playerColor: Color
): boolean => {
  return validMoves.some(([actualRow, actualCol]) => {
    const [displayRow, displayCol] = getActualCoords(actualRow, actualCol, playerColor);
    return displayRow === displayRowIndex && displayCol === displayColIndex;
  });
};

export const isSelectedSquare = (
  selectedSquare: { row: number; col: number } | null,
  displayRowIndex: number,
  displayColIndex: number,
  playerColor: Color
): boolean => {
  if (!selectedSquare) return false;
  const [displayRow, displayCol] = getActualCoords(selectedSquare.row, selectedSquare.col, playerColor);

  return displayRow === displayRowIndex && displayCol === displayColIndex;
};

export const isCheckedSquare = (
  board: Board,
  displayRowIndex: number,
  displayColIndex: number,
  playerColor: Color
): boolean => {
  const [displayRow, displayCol] = getActualCoords(displayRowIndex, displayColIndex, playerColor);
  const piece = board[displayRow][displayCol];
  if (!piece || piece.type !== "king") return false;

  return isKingInCheck(board, piece.color);
};
