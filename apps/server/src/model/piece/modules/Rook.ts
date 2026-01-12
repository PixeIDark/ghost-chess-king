import { PieceName, Position } from "@ghost-chess-king/shared";
import { Piece } from "@/model/piece";

export class Rook extends Piece {
  public readonly type: PieceName = "rook";

  public clone(): Piece {
    return new Rook(this.id, this.color, { ...this.position }, this.hasMoved);
  }

  public getAttackPaths(maxRow: number, maxCol: number): Position[][] {
    return [
      this.generateLinePath(0, 1, maxRow, maxCol),
      this.generateLinePath(0, -1, maxRow, maxCol),
      this.generateLinePath(1, 0, maxRow, maxCol),
      this.generateLinePath(-1, 0, maxRow, maxCol),
    ];
  }

  public getPotentialPaths(maxRow: number, maxCol: number): Position[][] {
    return [
      this.generateLinePath(0, 1, maxRow, maxCol),
      this.generateLinePath(0, -1, maxRow, maxCol),
      this.generateLinePath(1, 0, maxRow, maxCol),
      this.generateLinePath(-1, 0, maxRow, maxCol),
    ];
  }
}
