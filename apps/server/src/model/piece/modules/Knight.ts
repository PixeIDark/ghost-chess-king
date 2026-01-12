import { PieceName, Position } from "@ghost-chess-king/shared";
import { Piece } from "@/model/piece";

export class Knight extends Piece {
  public readonly type: PieceName = "knight";

  public clone(): Piece {
    return new Knight(this.id, this.color, { ...this.position }, this.hasMoved);
  }

  public getAttackPaths(): Position[][] {
    const { row, col } = this.position;
    const candidates: Position[] = [
      { row: row - 2, col: col - 1 },
      { row: row - 2, col: col + 1 },
      { row: row + 2, col: col - 1 },
      { row: row + 2, col: col + 1 },
      { row: row - 1, col: col - 2 },
      { row: row - 1, col: col + 2 },
      { row: row + 1, col: col - 2 },
      { row: row + 1, col: col + 2 },
    ];

    return candidates.filter((pos) => pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8).map((pos) => [pos]);
  }

  public getPotentialPaths(): Position[][] {
    const { row, col } = this.position;
    const candidates: Position[] = [
      { row: row - 2, col: col - 1 },
      { row: row - 2, col: col + 1 },
      { row: row + 2, col: col - 1 },
      { row: row + 2, col: col + 1 },
      { row: row - 1, col: col - 2 },
      { row: row - 1, col: col + 2 },
      { row: row + 1, col: col - 2 },
      { row: row + 1, col: col + 2 },
    ];

    return candidates.filter((pos) => pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8).map((pos) => [pos]);
  }
}
