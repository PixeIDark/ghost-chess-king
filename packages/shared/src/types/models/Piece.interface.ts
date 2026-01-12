import { PieceName, Position, Side } from "../chess";

export interface IPieceData {
  readonly id: number;
  readonly type: PieceName;
  readonly color: Side;
  readonly position: Position;
  readonly hasMoved: boolean;
}

export interface IPiece extends IPieceData {
  clone(): IPiece;
  getAttackPaths(): Position[][];
  getPotentialPaths(): Position[][];
  moveTo(row: number, col: number): void;
  setPosition(row: number, col: number): void;
  toDto(): IPieceData;
}
