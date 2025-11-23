import { type Board, type Color, MAX_COL, MAX_ROW, MIN_COL, MIN_ROW } from "../constants/board.ts";

export const isInsideBoard = (row: number, col: number): boolean => {
  return row >= MIN_ROW && row <= MAX_ROW && col >= MIN_COL && col <= MAX_COL;
};

export const isEmptySquare = (board: Board, row: number, col: number): boolean => {
  return board[row][col] === null;
};

export const hasFriendlyPiece = (board: Board, row: number, col: number, color: Color): boolean => {
  const piece = board[row][col];
  return piece !== null && piece.color === color;
};

export const hasEnemyPiece = (board: Board, row: number, col: number, color: Color): boolean => {
  const piece = board[row][col];
  return piece !== null && piece.color !== color;
};

export const canMoveThere = (board: Board, row: number, col: number, color: Color): boolean => {
  return isEmptySquare(board, row, col) || !hasFriendlyPiece(board, row, col, color);
};
