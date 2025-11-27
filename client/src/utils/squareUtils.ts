import type { BoardIndex, File, Rank, Square } from "../types/chess.ts";

export const squareToIndices = (square: Square) => {
  const row = Number(square[1]) - 1;
  const col = square.charCodeAt(0) - "a".charCodeAt(0);
  return { row, col };
};

export const indicesToSquare = (row: BoardIndex, col: BoardIndex): Square => {
  const rank = String(row + 1) as Rank;
  const file = String.fromCharCode(97 + col) as File;
  return `${file}${rank}`;
};
