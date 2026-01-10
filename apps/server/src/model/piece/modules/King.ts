import { Piece } from "@/model/piece/Piece";
import { PieceName } from "@ghost-chess-king/shared";
import { Position } from "@/model/piece/Piece.interface";

export class King extends Piece {
  public readonly type: PieceName = "king";

  public clone(): Piece {
    return new King(this.id, this.color, { ...this.position }, this.hasMoved);
  }

  public getPotentialPaths(): Position[][] {
    const { row, col } = this.position;
    const candidates: Position[] = [
      { row: row - 1, col: col },
      { row: row + 1, col: col },
      { row: row, col: col - 1 },
      { row: row, col: col + 1 },
      { row: row - 1, col: col - 1 },
      { row: row - 1, col: col + 1 },
      { row: row + 1, col: col - 1 },
      { row: row + 1, col: col + 1 },
    ];

    return candidates.filter((pos) => pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8).map((pos) => [pos]);
  }
}
