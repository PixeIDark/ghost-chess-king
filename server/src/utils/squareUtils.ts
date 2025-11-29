import type { Side, Square } from "../types/chess.ts";

export const squareToIndices = (square: Square) => {
  const row = 8 - Number(square[1]);
  const col = square.charCodeAt(0) - "a".charCodeAt(0);
  return { row, col };
};

export const indicesToSquare = (row: number, col: number): Square => {
  const rank = String(8 - row);
  const file = String.fromCharCode(97 + col);
  return `${file}${rank}` as Square;
};

export const getOppositeSide = (side: Side) => {
  if (side === "white") return "black";
  return "white";
};
