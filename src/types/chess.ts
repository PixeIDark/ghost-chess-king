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
export type PlayerColor = Color | null;
export type GameMode = "solo" | "ai" | null;
