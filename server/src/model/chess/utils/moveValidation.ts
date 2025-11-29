import {
  type Board,
  type Piece,
  type Side,
  type Square,
} from "../../../types/chess.ts";
import {
  indicesToSquare,
  squareToIndices,
} from "../../../utils/squareUtils.ts";
import { isSquareAttacked, wouldBeCheck } from "./gameState.ts";
import { canPieceAttack } from "./attackValidation.ts";
import { getCastlingRights, getEnPassantTarget } from "./fenUtils.ts";
import { BOARD_SIZE } from "../chess.constants.ts";

export const getValidMoves = (
  board: Board,
  fen: string,
  from: Square,
): Square[] => {
  const { row, col } = squareToIndices(from);
  const piece = board[row][col];

  if (!piece) return [];

  const moves: Square[] = [];
  moves.push(...getBasicMoves(board, row, col, piece));

  if (piece.type === "pawn")
    moves.push(...getEnPassantMoves(fen, row, col, piece.color));

  if (piece.type === "king")
    moves.push(...getCastlingMoves(board, fen, piece.color));

  return moves.filter(
    (move) => !wouldBeCheck(board, from, move, piece.color, fen),
  );
};

const getBasicMoves = (
  board: Board,
  row: number,
  col: number,
  piece: Piece,
): Square[] => {
  const moves: Square[] = [];

  for (let toRow = 0; toRow < BOARD_SIZE; toRow++) {
    for (let toCol = 0; toCol < BOARD_SIZE; toCol++) {
      const toPiece = board[toRow][toCol];
      if (toPiece?.color === piece.color) continue;

      if (canPieceAttack(board, row, col, toRow, toCol, piece))
        moves.push(indicesToSquare(toRow, toCol));
    }
  }

  return moves;
};

const getEnPassantMoves = (
  fen: string,
  row: number,
  col: number,
  color: Side,
): Square[] => {
  const moves: Square[] = [];
  const enPassant = getEnPassantTarget(fen);

  if (enPassant === "-") return moves;

  const { row: epRow, col: epCol } = squareToIndices(enPassant as Square);
  const direction = color === "white" ? -1 : 1;

  if (Math.abs(col - epCol) === 1 && row + direction === epRow)
    moves.push(enPassant as Square);

  return moves;
};

const getCastlingMoves = (board: Board, fen: string, color: Side): Square[] => {
  const moves: Square[] = [];
  const castling = getCastlingRights(fen);
  const baseRow = color === "white" ? 7 : 0;

  const canKingSide =
    ((color === "white" && castling.includes("K")) ||
      (color === "black" && castling.includes("k"))) &&
    board[baseRow][5] === null &&
    board[baseRow][6] === null &&
    !isSquareAttacked(board, baseRow, 4, color) &&
    !isSquareAttacked(board, baseRow, 5, color) &&
    !isSquareAttacked(board, baseRow, 6, color);

  if (canKingSide) moves.push(indicesToSquare(baseRow, 6));

  const canQueenSide =
    ((color === "white" && castling.includes("Q")) ||
      (color === "black" && castling.includes("q"))) &&
    board[baseRow][1] === null &&
    board[baseRow][2] === null &&
    board[baseRow][3] === null &&
    !isSquareAttacked(board, baseRow, 4, color) &&
    !isSquareAttacked(board, baseRow, 3, color) &&
    !isSquareAttacked(board, baseRow, 2, color);

  if (canQueenSide) moves.push(indicesToSquare(baseRow, 2));

  return moves;
};
