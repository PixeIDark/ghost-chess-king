import { BoardEntity, Position } from "@ghost-chess-king/shared";
import { PieceFactory } from "@/model/piece";
import { ChessBoard } from "@/model/chessBoard";

export class StandardBoard extends ChessBoard {
  public readonly rows: number = 8;
  public readonly cols: number = 8;
  public readonly boardEntity: BoardEntity;

  constructor() {
    super();
    this.boardEntity = this.createInitialBoard();
  }

  // TODO: 승격 테스트를 위해 초기 상태를 이렇게함. 추후 유저 프로모션 구현완료 시 교체예정
  private createInitialBoard(): BoardEntity {
    const board: BoardEntity = Array.from({ length: 8 }, () => Array(8).fill(null));

    board[0][0] = PieceFactory.create("rook", "black", { row: 0, col: 0 });
    board[0][4] = PieceFactory.create("king", "black", { row: 0, col: 4 });
    board[0][7] = PieceFactory.create("rook", "black", { row: 0, col: 7 });
    for (let i = 0; i < 8; i++) {
      board[1][i] = PieceFactory.create("pawn", "black", { row: 1, col: i });
    }
    board[1][2] = PieceFactory.create("pawn", "white", { row: 1, col: 2 });
    for (let i = 0; i < 8; i++) {
      board[6][i] = PieceFactory.create("pawn", "white", { row: 6, col: i });
    }
    board[6][2] = PieceFactory.create("pawn", "black", { row: 6, col: 2 });
    board[7][0] = PieceFactory.create("rook", "white", { row: 7, col: 0 });
    board[7][4] = PieceFactory.create("king", "white", { row: 7, col: 4 });
    board[7][7] = PieceFactory.create("rook", "white", { row: 7, col: 7 });

    return board;
  }

  public applySpecialRule(type: string, from: Position, to: Position): void {
    const piece = this.getPiece(from);
    if (!piece) return;

    const row = from.row;

    switch (type) {
      case "castling-kingside": {
        const kingPos = this.findKing(piece.color)!;
        this.movePiece(kingPos, { row, col: this.cols - 2 });
        this.movePiece({ row, col: this.cols - 1 }, { row, col: this.cols - 3 });
        break;
      }
      case "castling-queenside": {
        const kingPos = this.findKing(piece.color)!;
        this.movePiece(kingPos, { row, col: 2 });
        this.movePiece({ row, col: 0 }, { row, col: 3 });
        break;
      }
      case "en-passant": {
        this.movePiece(from, to);
        const capturedRow = piece.color === "white" ? to.row + 1 : to.row - 1;
        this.removePiece({ row: capturedRow, col: to.col });
        break;
      }
    }
  }

  public clone(): StandardBoard {
    const cloned = new StandardBoard();
    cloned.clear();

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const piece = this.boardEntity[row][col];
        cloned.boardEntity[row][col] = piece ? piece.clone() : null;
      }
    }

    return cloned;
  }
}
