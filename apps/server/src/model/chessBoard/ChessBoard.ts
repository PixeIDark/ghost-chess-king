import { BoardDTO, BoardEntity, IChessBoard, IPiece, Position, Side } from "@ghost-chess-king/shared";

export class ChessBoard implements IChessBoard {
  // ChessRuler에서 boardEntity를 주입하는 방식
  constructor(
    public readonly boardEntity: BoardEntity,
    public readonly rows: number,
    public readonly cols: number
  ) {}

  public getPiece(position: Position): IPiece | null {
    return this.boardEntity[position.row][position.col];
  }

  // 프로모션에서 사용할 수 있다.
  public setPiece(position: Position, piece: IPiece | null) {
    this.boardEntity[position.row][position.col] = piece;
  }

  public movePiece(from: Position, to: Position) {
    const fromPiece = this.boardEntity[from.row][from.col]!;
    this.boardEntity[to.row][to.col] = fromPiece;
    this.boardEntity[from.row][from.col] = null;
    fromPiece.setPosition(to.row, to.col);
  }

  public removePiece(position: Position): IPiece | null {
    const piece = this.boardEntity[position.row][position.col];
    this.boardEntity[position.row][position.col] = null;
    return piece;
  }

  public clone(): IChessBoard {
    const clonedEntity: BoardEntity = this.boardEntity.map((row) => row.map((piece) => (piece ? piece.clone() : null)));
    return new ChessBoard(clonedEntity, this.rows, this.cols);
  }

  public findKing(color: Side): Position | undefined {
    const king = this.boardEntity.flat().find((piece) => piece?.color === color && piece.type === "king");
    return king?.position;
  }

  public getAllPieces(color: Side): IPiece[] {
    return this.boardEntity.flat().filter((piece): piece is IPiece => piece?.color === color);
  }

  public toDto(): BoardDTO {
    return this.boardEntity.map((row) => row.map((piece) => (piece ? piece.toDto() : null)));
  }

  public clear() {
    this.boardEntity.forEach((row) => row.fill(null));
  }
}
