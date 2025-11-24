import type { Color, PieceType } from "../types/chess.ts";

export const pieceImages: Record<PieceType, Record<Color, string>> = {
  pawn: {
    white: "/pieces/white_pawn.svg",
    black: "/pieces/black_pawn.svg",
  },
  knight: {
    white: "/pieces/white_knight.svg",
    black: "/pieces/black_knight.svg",
  },
  bishop: {
    white: "/pieces/white_bishop.svg",
    black: "/pieces/black_bishop.svg",
  },
  rook: {
    white: "/pieces/white_rook.svg",
    black: "/pieces/black_rook.svg",
  },
  queen: {
    white: "/pieces/white_queen.svg",
    black: "/pieces/black_queen.svg",
  },
  king: {
    white: "/pieces/white_king.svg",
    black: "/pieces/black_king.svg",
  },
};
