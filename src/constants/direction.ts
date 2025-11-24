import type { PieceType } from "../types/chess.ts";

export const pieceDirections: Record<PieceType, [number, number][]> = {
  pawn: [[1, 0]],
  rook: [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ],
  bishop: [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ],
  queen: [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ],
  knight: [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ],
  king: [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ],
};
