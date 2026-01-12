import { PieceName, Position } from "@ghost-chess-king/shared";
import { Piece } from "@/model/piece";

export class Pawn extends Piece {
  public readonly type: PieceName = "pawn";

  public getAttackPaths(maxRow: number, maxCol: number): Position[][] {
    const { row, col } = this.position;
    const direction = this.color === "white" ? -1 : 1;
    const paths: Position[][] = [];

    const diagonals = [
      { row: row + direction, col: col - 1 },
      { row: row + direction, col: col + 1 },
    ];

    diagonals.forEach((pos) => {
      if (this.isValidBounds(pos, maxRow, maxCol)) {
        paths.push([pos]);
      }
    });

    return paths;
  }

  public getPotentialPaths(maxRow: number, maxCol: number): Position[][] {
    const { row, col } = this.position;
    const direction = this.color === "white" ? -1 : 1;
    const paths: Position[][] = [];
    const forward1 = { row: row + direction, col };

    if (this.isValidBounds(forward1, maxRow, maxCol)) {
      paths.push([forward1]);

      if (!this.hasMoved) {
        const forward2 = { row: row + direction * 2, col };
        if (this.isValidBounds(forward2, maxRow, maxCol)) {
          paths.push([forward1, forward2]);
        }
      }
    }

    const diagonals = [
      { row: row + direction, col: col - 1 },
      { row: row + direction, col: col + 1 },
    ];

    diagonals.forEach((pos) => {
      if (this.isValidBounds(pos, maxRow, maxCol)) {
        paths.push([pos]);
      }
    });

    return paths;
  }

  private isValidBounds(pos: Position, maxRow: number, maxCol: number): boolean {
    return pos.row >= 0 && pos.row < maxRow && pos.col >= 0 && pos.col < maxCol;
  }

  public clone(): Piece {
    return new Pawn(this.id, this.color, { ...this.position }, this.hasMoved);
  }
}
