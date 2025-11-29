import { type Board, type Side, type Square } from "../../../types/chess.ts";
import {
  getOppositeSide,
  indicesToSquare,
} from "../../../utils/squareUtils.ts";
import { canPieceAttack } from "./attackValidation.ts";
import { simulateMove } from "./boardSimulation.ts";
import { BOARD_SIZE } from "../chess.constants.ts";

export const isSquareAttacked = (
  board: Board,
  targetRow: number,
  targetCol: number,
  defenderColor: Side,
): boolean => {
  const attackerColor = getOppositeSide(defenderColor);

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = board[row][col];
      if (cell?.color !== attackerColor) continue;

      if (canPieceAttack(board, row, col, targetRow, targetCol, cell))
        return true;
    }
  }
  return false;
};

export const isCheckmate = (
  board: Board,
  fen: string,
  color: Side,
): boolean => {
  if (!isCheck(board, color)) return false;
  return hasNoLegalMoves(board, fen, color);
};

export const isStalemate = (
  board: Board,
  fen: string,
  color: Side,
): boolean => {
  if (isCheck(board, color)) return false;
  return hasNoLegalMoves(board, fen, color);
};

export const isCheck = (board: Board, color: Side): boolean => {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;

  return isSquareAttacked(board, kingPos.row, kingPos.col, color);
};

export const findKing = (board: Board, color: Side) => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = board[row][col];
      if (cell?.type === "king" && cell?.color === color) return { row, col };
    }
  }
  return null;
};

export const wouldBeCheck = (
  board: Board,
  from: Square,
  to: Square,
  color: Side,
  fen: string,
): boolean => {
  const newBoard = simulateMove(board, from, to, fen);
  return isCheck(newBoard, color);
};

export const hasNoLegalMoves = (
  board: Board,
  fen: string,
  color: Side,
): boolean => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = board[row][col];
      if (!cell || cell.color !== color) continue;

      for (let toRow = 0; toRow < BOARD_SIZE; toRow++) {
        for (let toCol = 0; toCol < BOARD_SIZE; toCol++) {
          const toPiece = board[toRow][toCol];
          if (toPiece?.color === color) continue;

          if (!canPieceAttack(board, row, col, toRow, toCol, cell)) continue;

          const from = indicesToSquare(row, col);
          const to = indicesToSquare(toRow, toCol);

          if (!wouldBeCheck(board, from, to, color, fen)) return false;
        }
      }
    }
  }
  return true;
};
