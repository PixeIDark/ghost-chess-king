import type { Square } from "../../../types/chess.ts";
import { fenToBoard } from "./fenToBoard.ts";
import { boardToFen } from "./boardToFen.ts";
import {
  updateTurn,
  updateCastlingRights,
  updateEnPassantTarget,
  updateHalfmoveClock,
  updateFullmoveNumber,
} from "./fenUtils.ts";
import { squareToIndices } from "../../../utils/squareUtils.ts";

export const executeMove = (
  fen: string,
  history: string[],
  from: Square,
  to: Square,
): { newFen: string; newHistory: string[] } => {
  const board = fenToBoard(fen);
  const { row: fromRow, col: fromCol } = squareToIndices(from);
  const { row: toRow, col: toCol } = squareToIndices(to);

  const piece = board[fromRow][fromCol];
  const captured = board[toRow][toCol] !== null;

  board[toRow][toCol] = piece;
  board[fromRow][fromCol] = null;

  let newFen = boardToFen(board, fen);
  newFen = updateTurn(newFen);
  newFen = updateCastlingRights(newFen, from, piece);
  newFen = updateEnPassantTarget(newFen, from, to, piece);
  newFen = updateHalfmoveClock(newFen, piece, captured);
  newFen = updateFullmoveNumber(newFen);

  return {
    newFen,
    newHistory: [...history, newFen],
  };
};
