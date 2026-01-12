import { PieceName, Position } from "@ghost-chess-king/shared";
import { Piece } from "@/model/piece";

export class Pawn extends Piece {
  public readonly type: PieceName = "pawn";

  public getAttackPaths(): Position[][] {
    const { row, col } = this.position;
    const direction = this.color === "white" ? -1 : 1;
    const paths: Position[][] = [];

    const diagonals = [
      { row: row + direction, col: col - 1 },
      { row: row + direction, col: col + 1 },
    ];

    diagonals.forEach((pos) => {
      if (this.isValidBounds(pos)) {
        paths.push([pos]);
      }
    });

    return paths;
  }

  public getPotentialPaths(): Position[][] {
    const { row, col } = this.position;
    const direction = this.color === "white" ? -1 : 1;
    const paths: Position[][] = [];
    const forward1 = { row: row + direction, col };

    if (this.isValidBounds(forward1)) {
      paths.push([forward1]);

      if (!this.hasMoved) {
        const forward2 = { row: row + direction * 2, col };
        if (this.isValidBounds(forward2)) paths.push([forward1, forward2]);
      }
    }

    const diagonals = [
      { row: row + direction, col: col - 1 },
      { row: row + direction, col: col + 1 },
    ];

    diagonals.forEach((pos) => {
      if (this.isValidBounds(pos)) paths.push([pos]);
    });

    return paths;
  }

  private isValidBounds(pos: Position): boolean {
    return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
  }

  public clone(): Piece {
    return new Pawn(this.id, this.color, { ...this.position }, this.hasMoved);
  }
}
