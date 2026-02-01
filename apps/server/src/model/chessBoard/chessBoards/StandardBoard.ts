import { BoardEntity, Position, Side } from "@ghost-chess-king/shared";
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

  private createInitialBoard(): BoardEntity {
    const board: BoardEntity = Array.from({ length: 8 }, () => Array(8).fill(null));

    const createRow = (row: number, color: Side) => {
      board[row][0] = PieceFactory.create("rook", color, { row, col: 0 });
      board[row][1] = PieceFactory.create("knight", color, { row, col: 1 });
      board[row][2] = PieceFactory.create("bishop", color, { row, col: 2 });
      board[row][3] = PieceFactory.create("queen", color, { row, col: 3 });
      board[row][4] = PieceFactory.create("king", color, { row, col: 4 });
      board[row][5] = PieceFactory.create("bishop", color, { row, col: 5 });
      board[row][6] = PieceFactory.create("knight", color, { row, col: 6 });
      board[row][7] = PieceFactory.create("rook", color, { row, col: 7 });
    };

    const pawnRow = (row: number, color: Side) => {
      for (let col = 0; col < 8; col++) {
        board[row][col] = PieceFactory.create("pawn", color, { row, col });
      }
    };

    createRow(0, "black");
    pawnRow(1, "black");
    pawnRow(6, "white");
    createRow(7, "white");

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
