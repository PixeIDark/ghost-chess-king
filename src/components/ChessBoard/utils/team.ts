import type { Piece } from "../../../constants/board.ts";

export const isSameColor = (piece1: Piece | null, piece2: Piece | null): boolean => {
  if (!piece1 || !piece2) return false;
  return piece1.color === piece2.color;
};
