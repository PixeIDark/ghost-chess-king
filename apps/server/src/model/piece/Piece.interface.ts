import { PieceName, Side } from "@ghost-chess-king/shared";

export interface Position {
  row: number;
  col: number;
}

export interface IPiece {
  id: number;
  type: PieceName;
  color: Side;
  position: Position;
  hasMoved: boolean;
}
