import { IPiece, IPieceData } from "./models";

export type PieceName = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";
export type PromotionPieceName = "queen" | "rook" | "bishop" | "knight";

export type Side = "black" | "white";

export interface Piece {
  type: PieceName;
  color: Side;
}

export type Cell = Piece | null;

export type BoardDTO = (IPieceData | null)[][];
export type BoardEntity = (IPiece | null)[][];

export type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
export type Rank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
export type Square = `${File}${Rank}`;

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  readonly pieceId: number;
  readonly pieceType: PieceName;
  readonly from: Position;
  readonly to: Position;
  readonly color: Side;
  readonly capturedPieceId?: string;
  readonly promotion?: PieceName;
  readonly isEnPassant?: boolean;
  readonly isCastle?: boolean;
  readonly timestamp: number;
}
