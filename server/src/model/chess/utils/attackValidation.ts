import type { Board, Piece } from "../../../types/chess.ts";
import { pieceFunctions } from "./pieceMoves.ts";

export const canPieceAttack = (
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  piece: Piece,
): boolean => {
  const moveFunction = pieceFunctions[piece.type];
  return moveFunction(board, fromRow, fromCol, toRow, toCol);
};
