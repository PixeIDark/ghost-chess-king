import { Position, Side } from "../types";

export const squareToIndices = (square: string): Position => {
  const row = 8 - Number(square[1]);
  const col = square.charCodeAt(0) - "a".charCodeAt(0);
  return { row, col };
};

export const indicesToSquare = (row: number, col: number): string => {
  const rank = String(8 - row);
  const file = String.fromCharCode(97 + col);
  return `${file}${rank}`;
};

export const getOppositeSide = (side: Side) => {
  if (side === "white") return "black";
  return "white";
};
