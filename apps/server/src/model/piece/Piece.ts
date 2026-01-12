import { MAX_INDEX, MIN_INDEX, IPiece, PieceName, Position, Side, IPieceData } from "@ghost-chess-king/shared";

export abstract class Piece implements IPiece {
  public abstract readonly type: PieceName;

  constructor(
    public readonly id: number,
    public readonly color: Side,
    public position: Position,
    public hasMoved: boolean = false
  ) {}

  public abstract clone(): IPiece;
  public abstract getAttackPaths(): Position[][];
  public abstract getPotentialPaths(): Position[][];

  protected generateLinePath(dRow: number, dCol: number): Position[] {
    const path: Position[] = [];
    let row = this.position.row + dRow;
    let col = this.position.col + dCol;

    while (row >= MIN_INDEX && row <= MAX_INDEX && col >= MIN_INDEX && col <= MAX_INDEX) {
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
