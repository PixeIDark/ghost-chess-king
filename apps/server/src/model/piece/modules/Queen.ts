import { PieceName, Position } from "@ghost-chess-king/shared";
import { Piece } from "@/model/piece";

export class Queen extends Piece {
  public readonly type: PieceName = "queen";

  public clone(): Piece {
    return new Queen(this.id, this.color, { ...this.position }, this.hasMoved);
  }

  public getAttackPaths(): Position[][] {
    return [
      this.generateLinePath(0, 1),
      this.generateLinePath(0, -1),
      this.generateLinePath(1, 0),
      this.generateLinePath(-1, 0),
      this.generateLinePath(1, 1),
      this.generateLinePath(1, -1),
      this.generateLinePath(-1, -1),
      this.generateLinePath(-1, 1),
    ];
  }

  public getPotentialPaths(): Position[][] {
    return [
      this.generateLinePath(0, 1),
      this.generateLinePath(0, -1),
      this.generateLinePath(1, 0),
      this.generateLinePath(-1, 0),
      this.generateLinePath(1, 1),
      this.generateLinePath(1, -1),
      this.generateLinePath(-1, -1),
      this.generateLinePath(-1, 1),
    ];
  }
}
