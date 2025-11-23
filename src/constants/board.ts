export type PieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king";
export type Color = "white" | "black";

interface BasePiece {
  color: Color;
}

export interface Pawn extends BasePiece {
  type: "pawn";
  hasEnPassant: boolean;
}

export interface King extends BasePiece {
  type: "king";
  hasMoved: boolean;
}

export interface Rook extends BasePiece {
  type: "rook";
  hasMoved: boolean;
}

export interface OtherPiece extends BasePiece {
  type: Exclude<PieceType, "pawn" | "king" | "rook">;
}

export type Piece = King | Rook | Pawn | OtherPiece;

export type Square = Piece | null;
export type Board = Square[][];

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

export const MIN_ROW = 0;
export const MAX_ROW = 7;
export const MIN_COL = 0;
export const MAX_COL = 7;
export const ADVICE_LIMIT = 100;

export const pieceDirections: Record<string, [number, number][]> = {
  pawn: [[1, 0]],
  rook: [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ],
  bishop: [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ],
  queen: [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ],
  knight: [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ],
  king: [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ],
};

export const pieceImages = {
  pawn: {
    white: "/pieces/white_pawn.svg",
    black: "/pieces/black_pawn.svg",
  },
  knight: {
    white: "/pieces/white_knight.svg",
    black: "/pieces/black_knight.svg",
  },
  bishop: {
    white: "/pieces/white_bishop.svg",
    black: "/pieces/black_bishop.svg",
  },
  rook: {
    white: "/pieces/white_rook.svg",
    black: "/pieces/black_rook.svg",
  },
  queen: {
    white: "/pieces/white_queen.svg",
    black: "/pieces/black_queen.svg",
  },
  king: {
    white: "/pieces/white_king.svg",
    black: "/pieces/black_king.svg",
  },
} as const;
