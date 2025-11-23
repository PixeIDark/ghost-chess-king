import { type Board, pieceDirections } from "../constants/board.ts";
import { canMoveThere, hasEnemyPiece, isInsideBoard } from "./squareValidator.ts";

type Moves = [number, number][];
type MoveAdder = (board: Board, row: number, col: number, color: "white" | "black") => Moves;

export const getLinearMoves = (
  board: Board,
  row: number,
  col: number,
  color: "white" | "black",
  directions: [number, number][],
  maxDistance = 8
): Moves => {
  const moves: Moves = [];

  for (const [dr, dc] of directions) {
    for (let distance = 1; distance <= maxDistance; distance++) {
      const nextRow = row + dr * distance;
      const nextCol = col + dc * distance;
      if (!isInsideBoard(nextRow, nextCol) || !canMoveThere(board, nextRow, nextCol, color)) break;

      moves.push([nextRow, nextCol]);
      if (hasEnemyPiece(board, nextRow, nextCol, color)) break;
    }
  }

  return moves;
};

const getRookMoves: MoveAdder = (board, row, col, color) => {
  return getLinearMoves(board, row, col, color, pieceDirections["rook"]);
};

const getBishopMoves: MoveAdder = (board, row, col, color) => {
  return getLinearMoves(board, row, col, color, pieceDirections["bishop"]);
};

const getQueenMoves: MoveAdder = (board, row, col, color) => {
  return [...getRookMoves(board, row, col, color), ...getBishopMoves(board, row, col, color)];
};

const getKnightMoves: MoveAdder = (board, row, col, color) => {
  return getLinearMoves(board, row, col, color, pieceDirections["knight"], 1);
};

const getKingMoves: MoveAdder = (board, row, col, color) => {
  return getLinearMoves(board, row, col, color, pieceDirections["king"], 1);
};

const getPawnMoves: MoveAdder = (board, row, col, color) => {
  const moves: Moves = [];
  const direction = color === "white" ? -1 : 1;
  const startRow = color === "white" ? 6 : 1;
  const nextRow = row + direction;

  if (isInsideBoard(nextRow, col) && board[nextRow][col] === null) {
    moves.push([nextRow, col]);

    const twoStepsRow = row + 2 * direction;
    if (row === startRow && board[twoStepsRow][col] === null) moves.push([twoStepsRow, col]);
  }

  for (const dc of [-1, 1]) {
    const nextCol = col + dc;
    if (!isInsideBoard(nextRow, nextCol)) continue;

    const target = board[nextRow][nextCol];
    if (target && target.color !== color) moves.push([nextRow, nextCol]);

    const sidePiece = board[row][nextCol];
    if (sidePiece?.type === "pawn" && sidePiece.color !== color && sidePiece.hasEnPassant) {
      moves.push([nextRow, nextCol]);
    }
  }

  return moves;
};

export const moveCalculators: Record<string, MoveAdder> = {
  pawn: getPawnMoves,
  rook: getRookMoves,
  bishop: getBishopMoves,
  queen: getQueenMoves,
  knight: getKnightMoves,
  king: getKingMoves,
};

export const getPieceMoves = (board: Board, row: number, col: number) => {
  const piece = board[row][col];
  if (!piece) return [];

  const adder = moveCalculators[piece.type];
  if (typeof adder !== "function") return [];

  return adder(board, row, col, piece.color);
};
