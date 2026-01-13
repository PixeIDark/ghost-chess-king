import { isValidPosition, PieceName, Position } from "@ghost-chess-king/shared";
import { Piece } from "@/model/piece/Piece";

export class King extends Piece {
  public readonly type: PieceName = "king";

  public clone(): Piece {
    return new King(this.id, this.color, { ...this.position }, this.hasMoved);
  }

  public getAttackPaths(maxRow: number, maxCol: number): Position[][] {
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

    return candidates.filter((pos) => isValidPosition(pos, maxRow, maxCol)).map((pos) => [pos]);
  }

  public getPotentialPaths(maxRow: number, maxCol: number): Position[][] {
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

    return candidates.filter((pos) => isValidPosition(pos, maxRow, maxCol)).map((pos) => [pos]);
  }
}
