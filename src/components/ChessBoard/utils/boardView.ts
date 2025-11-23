import type { Board, Color } from "../../../constants/board.ts";
import { isKingInCheck } from "../../../utils/legalityChecker.ts";

export const getDisplayBoard = (board: Board, playerColor: Color): Board => {
  if (playerColor === "black") return board.map((row) => [...row].reverse()).reverse();
  else return board;
};

export const getActualCoords = (displayRow: number, displayCol: number, playerColor: Color): [number, number] => {
  if (playerColor === "black") return [7 - displayRow, 7 - displayCol];
  else return [displayRow, displayCol];
};

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
