import type { Board, Color } from "../../constants/board.ts";

export const getActualCoords = (displayRow: number, displayCol: number, playerColor: Color): [number, number] => {
  if (playerColor === "black") return [7 - displayRow, 7 - displayCol];
  else return [displayRow, displayCol];
};

export const getDisplayBoard = (board: Board, playerColor: Color): Board => {
  if (playerColor === "black") return board.map((row) => [...row].reverse()).reverse();
  else return board;
};

export const isValidMoveSquare = (
  validMoves: [number, number][],
  displayRowIndex: number,
  displayColIndex: number,
  playerColor: Color
): boolean => {
  return validMoves.some(([actualRow, actualCol]) => {
    const [displayR, displayC] = getActualCoords(actualRow, actualCol, playerColor);
    return displayR === displayRowIndex && displayC === displayColIndex;
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
