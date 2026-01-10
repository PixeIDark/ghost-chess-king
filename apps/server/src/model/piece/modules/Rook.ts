import { PieceName } from "@ghost-chess-king/shared";
import { Position } from "@/model/piece/Piece.interface";
import { Piece } from "@/model/piece";

export class Rook extends Piece {
  public readonly type: PieceName = "rook";

  public clone(): Piece {
    return new Rook(this.id, this.color, { ...this.position }, this.hasMoved);
  }

  public getPotentialPaths(): Position[][] {
    return [
      this.generateLinePath(0, 1),
      this.generateLinePath(0, -1),
      this.generateLinePath(1, 0),
      this.generateLinePath(-1, 0),
    ];
  }
}
