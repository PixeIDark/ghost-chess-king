import type { Board } from "../../constants/board.ts";
import { isKingInCheck } from "../../utils/gameState.ts";

type MoveAdder = (board: Board, row: number, col: number, color: "white" | "black", moves: [number, number][]) => void;

const addLinearMoves = (
  board: Board,
  row: number,
  col: number,
  color: "white" | "black",
  moves: [number, number][],
  directions: [number, number][],
  maxDistance = 8
) => {
  for (const [dr, dc] of directions) {
    let distance = 1;
    while (distance <= maxDistance) {
      const r = row + dr * distance;
      const c = col + dc * distance;

      if (r < 0 || r >= 8 || c < 0 || c >= 8) break;

      const target = board[r][c];
      if (target === null) {
        moves.push([r, c]);
      } else {
        if (target.color !== color) moves.push([r, c]);
        break;
      }
      distance++;
    }
  }
};

const addRookMoves: MoveAdder = (b, r, c, color, moves) => {
  addLinearMoves(b, r, c, color, moves, [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ]);
};

const addBishopMoves: MoveAdder = (b, r, c, color, moves) => {
  addLinearMoves(b, r, c, color, moves, [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ]);
};

const addQueenMoves: MoveAdder = (b, r, c, color, moves) => {
  addRookMoves(b, r, c, color, moves);
  addBishopMoves(b, r, c, color, moves);
};

const addKnightMoves: MoveAdder = (b, r, c, color, moves) => {
  addLinearMoves(
    b,
    r,
    c,
    color,
    moves,
    [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ],
    1
  );
};

const addKingMoves: MoveAdder = (b, r, c, color, moves) => {
  addLinearMoves(
    b,
    r,
    c,
    color,
    moves,
    [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ],
    1
  );
};

const addPawnMoves: MoveAdder = (b, r, c, color, moves) => {
  const direction = color === "white" ? -1 : 1;
  const startRow = color === "white" ? 6 : 1;

  const nextRow = r + direction;
  if (nextRow >= 0 && nextRow < 8 && b[nextRow][c] === null) {
    moves.push([nextRow, c]);
    if (r === startRow && b[r + 2 * direction][c] === null) {
      moves.push([r + 2 * direction, c]);
    }
  }

  for (const dc of [-1, 1]) {
    const col = c + dc;
    if (col < 0 || col >= 8) continue;
    const target = b[nextRow]?.[col];
    if (target && target.color !== color) moves.push([nextRow, col]);
  }
};

const moveAdders: Record<string, MoveAdder> = {
  pawn: addPawnMoves,
  rook: addRookMoves,
  bishop: addBishopMoves,
  queen: addQueenMoves,
  knight: addKnightMoves,
  king: addKingMoves,
};

const wouldBeInCheck = (
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  color: "white" | "black"
): boolean => {
  const testBoard = board.map((r) => [...r]);
  testBoard[toRow][toCol] = testBoard[fromRow][fromCol];
  testBoard[fromRow][fromCol] = null;

  return isKingInCheck(testBoard, color);
};

export const getValidMoves = (board: Board, row: number, col: number): [number, number][] => {
  const piece = board[row][col];
  if (!piece) return [];

  const validMoves: Array<[number, number]> = [];
  const adder = moveAdders[piece.type];

  if (typeof adder === "function") adder(board, row, col, piece.color, validMoves);

  return validMoves.filter(([toRow, toCol]) => !wouldBeInCheck(board, row, col, toRow, toCol, piece.color));
};
