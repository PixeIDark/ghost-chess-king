import type { Board } from "../../../types/chess.ts";

const isPathClear = (
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
): boolean => {
  const rowDir = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
  const colDir = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
  let row = fromRow + rowDir;
  let col = fromCol + colDir;

  while (row !== toRow || col !== toCol) {
    if (board[row][col] !== null) return false;
    row += rowDir;
    col += colDir;
  }

  return true;
};

export const pawnMove = (
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
): boolean => {
  const piece = board[fromRow][fromCol];
  if (!piece) return false;

  const direction = piece.color === "white" ? -1 : 1;
  const startRow = piece.color === "white" ? 6 : 1;
  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;

  if (colDiff === 0 && rowDiff === direction)
    return board[toRow][toCol] === null;
  if (colDiff === 0 && rowDiff === 2 * direction && fromRow === startRow)
    return (
      board[toRow][toCol] === null &&
      board[fromRow + direction][fromCol] === null
    );
  if (Math.abs(colDiff) === 1 && rowDiff === direction)
    return board[toRow][toCol] !== null;

  return false;
};

export const knightMove = (
  _board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
): boolean => {
  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;

  return (
    (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) ||
    (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)
  );
};

export const bishopMove = (
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
): boolean => {
  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;
  if (Math.abs(rowDiff) !== Math.abs(colDiff)) return false;

  return isPathClear(board, fromRow, fromCol, toRow, toCol);
};

export const rookMove = (
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
): boolean => {
  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;
  if (rowDiff !== 0 && colDiff !== 0) return false;

  return isPathClear(board, fromRow, fromCol, toRow, toCol);
};

export const queenMove = (
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
): boolean => {
  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;
  if (rowDiff !== 0 && colDiff !== 0 && Math.abs(rowDiff) !== Math.abs(colDiff))
    return false;

  return isPathClear(board, fromRow, fromCol, toRow, toCol);
};

export const kingMove = (
  _board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
): boolean => {
  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;

  return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;
};

export const pieceFunctions = {
  pawn: pawnMove,
  knight: knightMove,
  bishop: bishopMove,
  rook: rookMove,
  queen: queenMove,
  king: kingMove,
} as const;
