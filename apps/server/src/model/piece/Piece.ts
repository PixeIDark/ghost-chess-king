import { IPiece, PieceName, Position, Side, IPieceData, isValidPosition } from "@ghost-chess-king/shared";

export abstract class Piece implements IPiece {
  public abstract readonly type: PieceName;

  constructor(
    public readonly id: number,
    public readonly color: Side,
    public position: Position,
    public hasMoved: boolean = false
  ) {}

  public abstract clone(): IPiece;
  public abstract getAttackPaths(maxRow: number, maxCol: number): Position[][];
  public abstract getPotentialPaths(maxRow: number, maxCol: number): Position[][];

  protected generateLinePath(dRow: number, dCol: number, maxRow: number, maxCol: number): Position[] {
    const path: Position[] = [];
    let row = this.position.row + dRow;
    let col = this.position.col + dCol;

    while (isValidPosition({ row, col }, maxRow, maxCol)) {
      path.push({ row, col });
      row += dRow;
      col += dCol;
    }

    return path;
  }

  public moveTo(row: number, col: number) {
    this.position = { row, col };
    this.hasMoved = true;
  }

  public setPosition(row: number, col: number) {
    this.position = { row, col };
  }

  public toDto(): IPieceData {
    return {
      id: this.id,
      type: this.type,
      color: this.color,
      position: { ...this.position },
      hasMoved: this.hasMoved,
    };
  }
}
