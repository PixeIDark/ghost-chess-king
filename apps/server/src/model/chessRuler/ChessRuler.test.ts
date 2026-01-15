import { ChessRuler } from "./ChessRuler";
import {
  BoardEntity,
  IChessBoard,
  IPiece,
  PieceName,
  Position,
  PromotionPieceName,
  Side,
} from "@ghost-chess-king/shared";
import { ChessBoard } from "@/model/chessBoard";

class MockPiece implements IPiece {
  constructor(
    public id: number,
    public type: PieceName,
    public color: Side,
    public position: Position,
    public hasMoved: boolean = false
  ) {}

  clone(): IPiece {
    return new MockPiece(this.id, this.type, this.color, { ...this.position }, this.hasMoved);
  }

  setPosition(row: number, col: number): void {
    this.position = { row, col };
  }

  moveTo(row: number, col: number): void {
    this.position = { row, col };
    this.hasMoved = true;
  }

  toDto() {
    return {
      id: this.id,
      type: this.type,
      color: this.color,
      position: { ...this.position },
      hasMoved: this.hasMoved,
    };
  }

  getAttackPaths(maxRow: number, maxCol: number): Position[][] {
    if (this.type === "rook") {
      return [
        this.generateLine(0, 1, maxRow, maxCol),
        this.generateLine(0, -1, maxRow, maxCol),
        this.generateLine(1, 0, maxRow, maxCol),
        this.generateLine(-1, 0, maxRow, maxCol),
      ];
    }
    if (this.type === "knight") {
      const moves = [
        { row: this.position.row + 2, col: this.position.col + 1 },
        { row: this.position.row + 2, col: this.position.col - 1 },
        { row: this.position.row - 2, col: this.position.col + 1 },
        { row: this.position.row - 2, col: this.position.col - 1 },
        { row: this.position.row + 1, col: this.position.col + 2 },
        { row: this.position.row + 1, col: this.position.col - 2 },
        { row: this.position.row - 1, col: this.position.col + 2 },
        { row: this.position.row - 1, col: this.position.col - 2 },
      ];
      return moves
        .filter((pos) => pos.row >= 0 && pos.row < maxRow && pos.col >= 0 && pos.col < maxCol)
        .map((pos) => [pos]);
    }
    if (this.type === "king") {
      const moves = [
        { row: this.position.row - 1, col: this.position.col },
        { row: this.position.row + 1, col: this.position.col },
        { row: this.position.row, col: this.position.col - 1 },
        { row: this.position.row, col: this.position.col + 1 },
        { row: this.position.row - 1, col: this.position.col - 1 },
        { row: this.position.row - 1, col: this.position.col + 1 },
        { row: this.position.row + 1, col: this.position.col - 1 },
        { row: this.position.row + 1, col: this.position.col + 1 },
      ];
      return moves
        .filter((pos) => pos.row >= 0 && pos.row < maxRow && pos.col >= 0 && pos.col < maxCol)
        .map((pos) => [pos]);
    }
    return [];
  }

  getPotentialPaths(maxRow: number, maxCol: number): Position[][] {
    return this.getAttackPaths(maxRow, maxCol);
  }

  private generateLine(dRow: number, dCol: number, maxRow: number, maxCol: number): Position[] {
    const path: Position[] = [];
    let row = this.position.row + dRow;
    let col = this.position.col + dCol;

    while (row >= 0 && row < maxRow && col >= 0 && col < maxCol) {
      path.push({ row, col });
      row += dRow;
      col += dCol;
    }

    return path;
  }
}

class TestRuler extends ChessRuler {
  createBoard(): BoardEntity {
    return Array.from({ length: 8 }, () => Array(8).fill(null));
  }

  getValidMoves(): Position[] {
    return [];
  }

  getCastlingMoves(): Position[] {
    return [];
  }

  getEnPassantMoves(): Position[] {
    return [];
  }

  isCheckmate(): boolean {
    return false;
  }

  isStalemate(): boolean {
    return false;
  }

  needsPromotion(): boolean {
    return false;
  }

  getPromotionOptions(): PromotionPieceName[] {
    return [];
  }

  executePromotion(): IPiece {
    throw new Error("Not implemented in test");
  }

  canCastling(): boolean {
    return false;
  }

  getEnPassantTarget(): Position | null {
    return null;
  }

  public testIsPinned(board: IChessBoard, piece: IPiece): boolean {
    return this.isPinned(board, piece);
  }
}

describe("ChessRuler", () => {
  let ruler: TestRuler;
  let board: IChessBoard;

  beforeEach(() => {
    ruler = new TestRuler();
    const boardEntity = ruler.createBoard();
    board = new ChessBoard(boardEntity);
  });

  describe("wouldExposeKing()", () => {
    it("이동 후 킹이 체크 상태가 되면 true를 반환해야 한다", () => {
      const king = new MockPiece(1, "king", "white", { row: 4, col: 4 });
      const piece = new MockPiece(2, "rook", "white", { row: 4, col: 5 });
      const enemyRook = new MockPiece(3, "rook", "black", { row: 4, col: 7 });

      board.setPiece({ row: 4, col: 4 }, king);
      board.setPiece({ row: 4, col: 5 }, piece);
      board.setPiece({ row: 4, col: 7 }, enemyRook);

      const result = ruler.wouldExposeKing(board, { row: 4, col: 5 }, { row: 5, col: 5 });

      expect(result).toBe(true);
    });

    it("이동 후 킹이 안전하면 false를 반환해야 한다", () => {
      const king = new MockPiece(1, "king", "white", { row: 4, col: 4 });
      const piece = new MockPiece(2, "knight", "white", { row: 2, col: 2 });

      board.setPiece({ row: 4, col: 4 }, king);
      board.setPiece({ row: 2, col: 2 }, piece);

      const result = ruler.wouldExposeKing(board, { row: 2, col: 2 }, { row: 3, col: 4 });

      expect(result).toBe(false);
    });

    it("from 위치에 기물이 없으면 false를 반환해야 한다", () => {
      const result = ruler.wouldExposeKing(board, { row: 0, col: 0 }, { row: 1, col: 1 });

      expect(result).toBe(false);
    });
  });

  describe("isInCheck()", () => {
    it("킹이 공격받고 있으면 true를 반환해야 한다", () => {
      const king = new MockPiece(1, "king", "white", { row: 4, col: 4 });
      const enemyRook = new MockPiece(2, "rook", "black", { row: 4, col: 0 });

      board.setPiece({ row: 4, col: 4 }, king);
      board.setPiece({ row: 4, col: 0 }, enemyRook);

      const result = ruler.isInCheck(board, "white");

      expect(result).toBe(true);
    });

    it("킹이 안전하면 false를 반환해야 한다", () => {
      const king = new MockPiece(1, "king", "white", { row: 4, col: 4 });
      const enemyRook = new MockPiece(2, "rook", "black", { row: 7, col: 7 });

      board.setPiece({ row: 4, col: 4 }, king);
      board.setPiece({ row: 7, col: 7 }, enemyRook);

      const result = ruler.isInCheck(board, "white");

      expect(result).toBe(false);
    });

    it("킹이 보드에 없으면 false를 반환해야 한다", () => {
      const result = ruler.isInCheck(board, "white");

      expect(result).toBe(false);
    });
  });

  describe("isPinned()", () => {
    it("기물을 제거했을 때 킹이 체크되면 true를 반환해야 한다", () => {
      const king = new MockPiece(1, "king", "white", { row: 4, col: 4 });
      const piece = new MockPiece(2, "rook", "white", { row: 4, col: 5 });
      const enemyRook = new MockPiece(3, "rook", "black", { row: 4, col: 7 });

      board.setPiece({ row: 4, col: 4 }, king);
      board.setPiece({ row: 4, col: 5 }, piece);
      board.setPiece({ row: 4, col: 7 }, enemyRook);

      const result = ruler.testIsPinned(board, piece);

      expect(result).toBe(true);
    });

    it("기물을 제거해도 킹이 안전하면 false를 반환해야 한다", () => {
      const king = new MockPiece(1, "king", "white", { row: 4, col: 4 });
      const piece = new MockPiece(2, "knight", "white", { row: 2, col: 2 });

      board.setPiece({ row: 4, col: 4 }, king);
      board.setPiece({ row: 2, col: 2 }, piece);

      const result = ruler.testIsPinned(board, piece);

      expect(result).toBe(false);
    });
  });
});
