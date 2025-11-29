import { type Board, type Square } from "../../../types/chess.ts";
import { squareToIndices } from "../../../utils/squareUtils.ts";
import { getEnPassantTarget } from "./fenUtils.ts";

export const simulateMove = (
  board: Board,
  from: Square,
  to: Square,
  fen: string,
): Board => {
  const newBoard = board.map((row) => [...row]);
  const { row: fromRow, col: fromCol } = squareToIndices(from);
  const { row: toRow, col: toCol } = squareToIndices(to);
  const piece = newBoard[fromRow][fromCol];

  newBoard[toRow][toCol] = piece;
  newBoard[fromRow][fromCol] = null;

  if (!piece) return newBoard;

  const colDiff = toCol - fromCol;
  if (piece.type === "king" && Math.abs(colDiff) === 2) {
    const rookFromCol = colDiff > 0 ? 7 : 0;
    const rookToCol = colDiff > 0 ? 5 : 3;
    newBoard[toRow][rookToCol] = newBoard[toRow][rookFromCol];
    newBoard[toRow][rookFromCol] = null;
  }

  const enPassant = getEnPassantTarget(fen);
  if (piece.type === "pawn" && enPassant !== "-" && to === enPassant) {
    const direction = piece.color === "white" ? -1 : 1;
    newBoard[toRow - direction][toCol] = null;
  }

  return newBoard;
};
