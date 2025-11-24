import { getPieceMoves } from "./pieceMoves.ts";
import type { Board, Color, PieceType } from "../types/chess.ts";

export const findPiece = (board: Board, color: Color, type: PieceType): [number, number] | null => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];
      if (piece?.type === type && piece?.color === color) return [row, col];
    }
  }

  return null;
};

export const isSquareUnderAttack = (board: Board, row: number, col: number, byColor: "white" | "black"): boolean => {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const piece = board[r][c];
      if (piece?.color !== byColor) continue;

      const moves = getPieceMoves(board, r, c);
      if (moves.some(([mr, mc]) => mr === row && mc === col)) {
        return true;
      }
    }
  }

  return false;
};
