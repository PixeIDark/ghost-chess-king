import { BoardDTO, BoardEntity, IChessBoard, IPiece, isSamePosition, Position, Side } from "@ghost-chess-king/shared";

export class ChessBoard implements IChessBoard {
  public readonly rows: number;
  public readonly cols: number;

  constructor(public readonly boardEntity: BoardEntity) {
    this.rows = boardEntity.length;
    this.cols = boardEntity[0].length;
  }

  public getPiece(position: Position): IPiece | null {
    return this.boardEntity[position.row][position.col];
  }

  public setPiece(position: Position, piece: IPiece | null) {
    this.boardEntity[position.row][position.col] = piece;
  }

  public movePiece(from: Position, to: Position) {
    const fromPiece = this.boardEntity[from.row][from.col]!;
    this.boardEntity[to.row][to.col] = fromPiece;
    this.boardEntity[from.row][from.col] = null;
    fromPiece.moveTo(to.row, to.col);
  }

  public removePiece(position: Position): IPiece | null {
    const piece = this.boardEntity[position.row][position.col];
    this.boardEntity[position.row][position.col] = null;
    return piece;
  }

  public clone(): IChessBoard {
    const clonedEntity: BoardEntity = this.boardEntity.map((row) => row.map((piece) => (piece ? piece.clone() : null)));
    return new ChessBoard(clonedEntity);
  }

  public findKing(color: Side): Position | undefined {
    const king = this.boardEntity.flat().find((piece) => piece?.color === color && piece.type === "king");
    return king?.position;
  }

  public getAllPieces(color: Side): IPiece[] {
    return this.boardEntity.flat().filter((piece): piece is IPiece => piece?.color === color);
  }

  public getAttackedPositions(color: Side): Position[] {
    const pieces = this.getAllPieces(color);
    const attacked: Position[] = [];

    pieces.forEach((piece) => {
      const attackPaths = piece.getAttackPaths(this.rows, this.cols);
      attackPaths.forEach((path) => {
        for (const pos of path) {
          attacked.push(pos);
          if (this.getPiece(pos)) break;
        }
      });
    });

    return attacked;
  }

  public isPositionUnderAttack(position: Position, byColor: Side): boolean {
    const attackedPositions = this.getAttackedPositions(byColor);
    return attackedPositions.some((pos) => isSamePosition(pos, position));
  }

  public toDto(): BoardDTO {
    return this.boardEntity.map((row) => row.map((piece) => (piece ? piece.toDto() : null)));
  }

  public clear() {
    this.boardEntity.forEach((row) => row.fill(null));
  }
}
