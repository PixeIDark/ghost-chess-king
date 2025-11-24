import { findPiece, isSquareUnderAttack } from "./pieceUtils.ts";
import { getPieceMoves } from "./pieceMoves.ts";
import type { Board, Color } from "../types/chess.ts";

export const getPromotablePawn = (board: Board, color: Color): [number, number] | null => {
  const promotionRow = color === "white" ? 0 : 7;

  for (let col = 0; col < board[promotionRow].length; col++) {
    const piece = board[promotionRow][col];
    if (piece?.type === "pawn" && piece.color === color) return [promotionRow, col];
  }

  return null;
};

export const canPieceMove = (board: Board, currentTurn: Color): boolean => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];
      if (piece?.color !== currentTurn) continue;

      const moves = getValidMoves(board, row, col, currentTurn);
      if (moves.length > 0) return true;
    }
  }

  return false;
};

export const isKingInCheck = (board: Board, color: Color): boolean => {
  const kingPos = findPiece(board, color, "king");
  if (!kingPos) return false;

  const enemyColor = color === "white" ? "black" : "white";
  return isSquareUnderAttack(board, kingPos[0], kingPos[1], enemyColor);
};

export const wouldBeInCheck = (
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  color: "white" | "black"
): boolean => {
  const testBoard = structuredClone(board);
  testBoard[toRow][toCol] = testBoard[fromRow][fromCol];
  testBoard[fromRow][fromCol] = null;

  return isKingInCheck(testBoard, color);
};

const isCastlingMove = (board: Board, fromRow: number, fromCol: number, toCol: number, color: Color): boolean => {
  const piece = board[fromRow][fromCol];

  if (piece?.type !== "king") return false;

  const enemyColor = color === "white" ? "black" : "white";
  const rook = board[fromRow][toCol];

  if (!rook || rook.type !== "rook" || rook.color !== color) return false;

  if (piece.hasMoved || rook.hasMoved) return false;

  if (toCol === 7) {
    return (
      board[fromRow][fromCol + 1] === null &&
      board[fromRow][fromCol + 2] === null &&
      !isSquareUnderAttack(board, fromRow, fromCol, enemyColor) &&
      !isSquareUnderAttack(board, fromRow, fromCol + 1, enemyColor) &&
      !isSquareUnderAttack(board, fromRow, fromCol + 2, enemyColor)
    );
  }

  if (toCol === 0) {
    return (
      board[fromRow][fromCol - 1] === null &&
      board[fromRow][fromCol - 2] === null &&
      board[fromRow][fromCol - 3] === null &&
      !isSquareUnderAttack(board, fromRow, fromCol, enemyColor) &&
      !isSquareUnderAttack(board, fromRow, fromCol - 1, enemyColor) &&
      !isSquareUnderAttack(board, fromRow, fromCol - 2, enemyColor)
    );
  }

  return false;
};

export const getValidMoves = (board: Board, row: number, col: number, color: Color) => {
  const piece = board[row][col];
  const moves = getPieceMoves(board, row, col);

  const validMoves = moves.filter(([toRow, toCol]) => {
    return !wouldBeInCheck(board, row, col, toRow, toCol, color);
  });

  if (piece?.type === "king") {
    const kingRow = row;
    const kingCol = col;

    if (isCastlingMove(board, kingRow, kingCol, 7, color)) {
      validMoves.push([kingRow, 7]);
    }

    if (isCastlingMove(board, kingRow, kingCol, 0, color)) {
      validMoves.push([kingRow, 0]);
    }
  }

  if (piece?.type === "rook") {
    const kingPos = findPiece(board, color, "king");

    if (kingPos) {
      const [kingRow, kingCol] = kingPos;

      if (col === 7) {
        if (isCastlingMove(board, kingRow, kingCol, 7, color)) {
          validMoves.push([kingRow, kingCol]);
        }
      }

      if (col === 0) {
        if (isCastlingMove(board, kingRow, kingCol, 0, color)) {
          validMoves.push([kingRow, kingCol]);
        }
      }
    }
  }

  return validMoves;
};
