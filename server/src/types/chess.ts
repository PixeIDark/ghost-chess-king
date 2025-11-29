export type PieceName = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";

export type Side = "black" | "white";

export interface Piece {
  type: PieceName;
  color: Side;
}

export type Cell = Piece | null;

export type Board = Cell[][];

export type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
export type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type Square = `${File}${Rank}`;
