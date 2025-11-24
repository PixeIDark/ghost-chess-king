import type { Board } from "../types/chess.ts";

export const MIN_ROW = 0;
export const MAX_ROW = 7;
export const MIN_COL = 0;
export const MAX_COL = 7;

export const initialBoard: Board = [
  [
    { type: "rook", color: "black", hasMoved: false },
    { type: "knight", color: "black" },
    { type: "bishop", color: "black" },
    { type: "queen", color: "black" },
    { type: "king", color: "black", hasMoved: false },
    { type: "bishop", color: "black" },
    { type: "knight", color: "black" },
    { type: "rook", color: "black", hasMoved: false },
  ],
  [
    { type: "pawn", color: "black", hasEnPassant: false },
    { type: "pawn", color: "black", hasEnPassant: false },
    { type: "pawn", color: "black", hasEnPassant: false },
    { type: "pawn", color: "black", hasEnPassant: false },
    { type: "pawn", color: "black", hasEnPassant: false },
    { type: "pawn", color: "black", hasEnPassant: false },
    { type: "pawn", color: "black", hasEnPassant: false },
    { type: "pawn", color: "black", hasEnPassant: false },
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    { type: "pawn", color: "white", hasEnPassant: false },
    { type: "pawn", color: "white", hasEnPassant: false },
    { type: "pawn", color: "white", hasEnPassant: false },
    { type: "pawn", color: "white", hasEnPassant: false },
    { type: "pawn", color: "white", hasEnPassant: false },
    { type: "pawn", color: "white", hasEnPassant: false },
    { type: "pawn", color: "white", hasEnPassant: false },
    { type: "pawn", color: "white", hasEnPassant: false },
  ],
  [
    { type: "rook", color: "white", hasMoved: false },
    { type: "knight", color: "white" },
    { type: "bishop", color: "white" },
    { type: "queen", color: "white" },
    { type: "king", color: "white", hasMoved: false },
    { type: "bishop", color: "white" },
    { type: "knight", color: "white" },
    { type: "rook", color: "white", hasMoved: false },
  ],
];
