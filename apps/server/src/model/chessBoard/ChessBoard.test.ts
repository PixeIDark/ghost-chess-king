import { ChessBoard } from "./ChessBoard";
import { BoardEntity, IPiece, PieceName, Position, Side } from "@ghost-chess-king/shared";

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

  getAttackPaths(): Position[][] {
    return [];
  }

  getPotentialPaths(): Position[][] {
    return [];
  }
}

describe("ChessBoard", () => {
  let board: ChessBoard;
  let boardEntity: BoardEntity;

  beforeEach(() => {
    boardEntity = Array.from({ length: 8 }, () => Array(8).fill(null));
    board = new ChessBoard(boardEntity);
  });

  describe("getPiece()", () => {
    it("지정된 위치의 기물을 반환해야 한다", () => {
      const piece = new MockPiece(1, "rook", "white", { row: 0, col: 0 });
      boardEntity[0][0] = piece;

      const result = board.getPiece({ row: 0, col: 0 });

      expect(result).toBe(piece);
    });

    it("빈 칸은 null을 반환해야 한다", () => {
      const result = board.getPiece({ row: 3, col: 3 });

      expect(result).toBeNull();
    });
  });

  describe("setPiece()", () => {
    it("지정된 위치에 기물을 배치해야 한다", () => {
      const piece = new MockPiece(1, "queen", "black", { row: 4, col: 4 });

      board.setPiece({ row: 4, col: 4 }, piece);

      expect(board.getPiece({ row: 4, col: 4 })).toBe(piece);
    });

    it("null을 설정하여 칸을 비울 수 있어야 한다", () => {
      const piece = new MockPiece(1, "pawn", "white", { row: 2, col: 2 });
      board.setPiece({ row: 2, col: 2 }, piece);

      board.setPiece({ row: 2, col: 2 }, null);

      expect(board.getPiece({ row: 2, col: 2 })).toBeNull();
    });
  });

  describe("movePiece()", () => {
    it("기물을 from 위치에서 to 위치로 이동시켜야 한다", () => {
      const piece = new MockPiece(1, "knight", "white", { row: 1, col: 1 });
      board.setPiece({ row: 1, col: 1 }, piece);

      board.movePiece({ row: 1, col: 1 }, { row: 3, col: 2 });

      expect(board.getPiece({ row: 1, col: 1 })).toBeNull();
      expect(board.getPiece({ row: 3, col: 2 })).toBe(piece);
      expect(piece.position).toEqual({ row: 3, col: 2 });
    });

    it("to 위치에 있던 기물은 덮어써져야 한다", () => {
      const piece1 = new MockPiece(1, "pawn", "white", { row: 2, col: 2 });
      const piece2 = new MockPiece(2, "pawn", "black", { row: 4, col: 4 });
      board.setPiece({ row: 2, col: 2 }, piece1);
      board.setPiece({ row: 4, col: 4 }, piece2);

      board.movePiece({ row: 2, col: 2 }, { row: 4, col: 4 });

      expect(board.getPiece({ row: 4, col: 4 })).toBe(piece1);
      expect(board.getPiece({ row: 2, col: 2 })).toBeNull();
    });
  });

  describe("removePiece()", () => {
    it("지정된 위치의 기물을 제거하고 반환해야 한다", () => {
      const piece = new MockPiece(1, "bishop", "white", { row: 3, col: 3 });
      board.setPiece({ row: 3, col: 3 }, piece);

      const removed = board.removePiece({ row: 3, col: 3 });

      expect(removed).toBe(piece);
      expect(board.getPiece({ row: 3, col: 3 })).toBeNull();
    });

    it("빈 칸을 제거하면 null을 반환해야 한다", () => {
      const removed = board.removePiece({ row: 5, col: 5 });

      expect(removed).toBeNull();
    });
  });

  describe("clone()", () => {
    it("보드의 깊은 복사본을 생성해야 한다", () => {
      const piece1 = new MockPiece(1, "rook", "white", { row: 0, col: 0 });
      const piece2 = new MockPiece(2, "king", "black", { row: 7, col: 7 });
      board.setPiece({ row: 0, col: 0 }, piece1);
      board.setPiece({ row: 7, col: 7 }, piece2);

      const cloned = board.clone();

      expect(cloned).not.toBe(board);
      expect(cloned.getPiece({ row: 0, col: 0 })).not.toBe(piece1);
      expect(cloned.getPiece({ row: 0, col: 0 })?.id).toBe(1);
      expect(cloned.getPiece({ row: 7, col: 7 })?.id).toBe(2);
    });

    it("원본 보드 수정이 복사본에 영향을 주지 않아야 한다", () => {
      const piece = new MockPiece(1, "queen", "white", { row: 4, col: 4 });
      board.setPiece({ row: 4, col: 4 }, piece);

      const cloned = board.clone();
      board.removePiece({ row: 4, col: 4 });

      expect(board.getPiece({ row: 4, col: 4 })).toBeNull();
      expect(cloned.getPiece({ row: 4, col: 4 })).not.toBeNull();
    });
  });

  describe("findKing()", () => {
    it("지정된 색상의 킹 위치를 반환해야 한다", () => {
      const whiteKing = new MockPiece(1, "king", "white", { row: 0, col: 4 });
      const blackKing = new MockPiece(2, "king", "black", { row: 7, col: 4 });
      board.setPiece({ row: 0, col: 4 }, whiteKing);
      board.setPiece({ row: 7, col: 4 }, blackKing);

      const whiteKingPos = board.findKing("white");
      const blackKingPos = board.findKing("black");

      expect(whiteKingPos).toEqual({ row: 0, col: 4 });
      expect(blackKingPos).toEqual({ row: 7, col: 4 });
    });

    it("킹이 없으면 undefined를 반환해야 한다", () => {
      const result = board.findKing("white");

      expect(result).toBeUndefined();
    });
  });

  describe("getAllPieces()", () => {
    it("지정된 색상의 모든 기물을 반환해야 한다", () => {
      const white1 = new MockPiece(1, "pawn", "white", { row: 1, col: 0 });
      const white2 = new MockPiece(2, "rook", "white", { row: 0, col: 0 });
      const black1 = new MockPiece(3, "pawn", "black", { row: 6, col: 0 });
      board.setPiece({ row: 1, col: 0 }, white1);
      board.setPiece({ row: 0, col: 0 }, white2);
      board.setPiece({ row: 6, col: 0 }, black1);

      const whitePieces = board.getAllPieces("white");
      const blackPieces = board.getAllPieces("black");

      expect(whitePieces).toHaveLength(2);
      expect(blackPieces).toHaveLength(1);
      expect(whitePieces).toContain(white1);
      expect(whitePieces).toContain(white2);
    });

    it("해당 색상의 기물이 없으면 빈 배열을 반환해야 한다", () => {
      const result = board.getAllPieces("white");

      expect(result).toEqual([]);
    });
  });

  describe("getAttackedPositions()", () => {
    it("특정 색상이 공격하는 모든 위치를 반환해야 한다", () => {
      const whiteRook = new MockPiece(1, "rook", "white", { row: 0, col: 0 });
      whiteRook.getAttackPaths = () => [
        [
          { row: 0, col: 1 },
          { row: 0, col: 2 },
          { row: 0, col: 3 },
        ],
        [
          { row: 1, col: 0 },
          { row: 2, col: 0 },
          { row: 3, col: 0 },
        ],
      ];
      board.setPiece({ row: 0, col: 0 }, whiteRook);

      const attacked = board.getAttackedPositions("white");

      expect(attacked).toContainEqual({ row: 0, col: 1 });
      expect(attacked).toContainEqual({ row: 0, col: 2 });
      expect(attacked).toContainEqual({ row: 1, col: 0 });
    });

    it("경로에 기물이 있으면 그 위치까지만 공격 범위에 포함해야 한다", () => {
      const whiteRook = new MockPiece(1, "rook", "white", { row: 0, col: 0 });
      whiteRook.getAttackPaths = () => [
        [
          { row: 0, col: 1 },
          { row: 0, col: 2 },
          { row: 0, col: 3 },
        ],
      ];
      const blackPawn = new MockPiece(2, "pawn", "black", { row: 0, col: 2 });

      board.setPiece({ row: 0, col: 0 }, whiteRook);
      board.setPiece({ row: 0, col: 2 }, blackPawn);

      const attacked = board.getAttackedPositions("white");

      expect(attacked).toContainEqual({ row: 0, col: 1 });
      expect(attacked).toContainEqual({ row: 0, col: 2 });
      expect(attacked).not.toContainEqual({ row: 0, col: 3 });
    });

    it("공격 가능한 기물이 없으면 빈 배열을 반환해야 한다", () => {
      const attacked = board.getAttackedPositions("white");

      expect(attacked).toEqual([]);
    });
  });

  describe("isPositionUnderAttack()", () => {
    it("특정 위치가 공격받고 있으면 true를 반환해야 한다", () => {
      const blackRook = new MockPiece(1, "rook", "black", { row: 0, col: 0 });
      blackRook.getAttackPaths = () => [
        [
          { row: 0, col: 1 },
          { row: 0, col: 2 },
          { row: 0, col: 3 },
        ],
      ];
      board.setPiece({ row: 0, col: 0 }, blackRook);

      const result = board.isPositionUnderAttack({ row: 0, col: 2 }, "black");

      expect(result).toBe(true);
    });

    it("특정 위치가 공격받지 않으면 false를 반환해야 한다", () => {
      const blackRook = new MockPiece(1, "rook", "black", { row: 0, col: 0 });
      blackRook.getAttackPaths = () => [
        [
          { row: 0, col: 1 },
          { row: 0, col: 2 },
        ],
      ];
      board.setPiece({ row: 0, col: 0 }, blackRook);

      const result = board.isPositionUnderAttack({ row: 5, col: 5 }, "black");

      expect(result).toBe(false);
    });
  });

  describe("toDto()", () => {
    it("보드 상태를 DTO 형태로 변환해야 한다", () => {
      const piece = new MockPiece(1, "knight", "white", { row: 2, col: 3 });
      board.setPiece({ row: 2, col: 3 }, piece);

      const dto = board.toDto();

      expect(dto[2][3]).toEqual({
        id: 1,
        type: "knight",
        color: "white",
        position: { row: 2, col: 3 },
        hasMoved: false,
      });
      expect(dto[0][0]).toBeNull();
    });
  });

  describe("clear()", () => {
    it("보드의 모든 칸을 null로 초기화해야 한다", () => {
      const piece1 = new MockPiece(1, "pawn", "white", { row: 1, col: 1 });
      const piece2 = new MockPiece(2, "rook", "black", { row: 7, col: 7 });
      board.setPiece({ row: 1, col: 1 }, piece1);
      board.setPiece({ row: 7, col: 7 }, piece2);

      board.clear();

      expect(board.getPiece({ row: 1, col: 1 })).toBeNull();
      expect(board.getPiece({ row: 7, col: 7 })).toBeNull();
      expect(board.getAllPieces("white")).toHaveLength(0);
      expect(board.getAllPieces("black")).toHaveLength(0);
    });
  });
});
