import { PieceName, Side } from "@ghost-chess-king/shared";

export interface Position {
  row: number;
  col: number;
}

export interface IPiece {
  readonly id: number;
  readonly type: PieceName;
  readonly color: Side;
  readonly position: Position;
  readonly hasMoved: boolean;
}
