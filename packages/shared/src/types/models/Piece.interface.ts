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
  getAttackPaths(maxRow: number, maxCol: number): Position[][];
  getPotentialPaths(maxRow: number, maxCol: number): Position[][];
  moveTo(row: number, col: number): void;
  setPosition(row: number, col: number): void;
  toDto(): IPieceData;
}
