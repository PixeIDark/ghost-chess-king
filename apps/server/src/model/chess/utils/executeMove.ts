import { Square, squareToIndices } from "@ghost-chess/shared";
import { fenToBoard } from "@/model/chess/utils/fenToBoard";
import { getValidMoves } from "@/model/chess/utils/moveValidation";
import { boardToFen } from "@/model/chess/utils/boardToFen";
import {
  updateCastlingRights,
  updateEnPassantTarget,
  updateFullmoveNumber,
  updateHalfmoveClock,
  updateTurn,
} from "@/model/chess/utils/fenUtils";

export const executeMove = (
  fen: string,
  history: string[],
  from: Square,
  to: Square
): { newFen: string; newHistory: string[] } => {
  const board = fenToBoard(fen);
  const validMoves = getValidMoves(board, fen, from);

  if (!validMoves || !validMoves.includes(to)) throw new Error(`Invalid move: ${from} -> ${to}`);

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
