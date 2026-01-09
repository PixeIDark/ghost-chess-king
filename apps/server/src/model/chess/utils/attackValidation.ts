import { Board, Piece } from "@ghost-chess-king/shared";
import { pieceFunctions } from "@/model/chess/utils/pieceMoves";

export const canPieceAttack = (
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  piece: Piece
): boolean => {
  const moveFunction = pieceFunctions[piece.type];
  return moveFunction(board, fromRow, fromCol, toRow, toCol);
};
