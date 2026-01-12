import { PieceName, Position } from "@ghost-chess-king/shared";
import { Piece } from "@/model/piece";

export class Bishop extends Piece {
  public readonly type: PieceName = "bishop";

  public clone(): Piece {
    return new Bishop(this.id, this.color, { ...this.position }, this.hasMoved);
  }

  public getAttackPaths(): Position[][] {
    return [
      this.generateLinePath(1, 1),
      this.generateLinePath(1, -1),
      this.generateLinePath(-1, -1),
      this.generateLinePath(-1, 1),
    ];
  }

  public getPotentialPaths(): Position[][] {
    return [
      this.generateLinePath(1, 1),
      this.generateLinePath(1, -1),
      this.generateLinePath(-1, -1),
      this.generateLinePath(-1, 1),
    ];
  }
}
