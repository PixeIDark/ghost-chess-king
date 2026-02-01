import { StandardBoard } from "./StandardBoard";
import { PieceFactory } from "@/model/piece";
import { Position } from "@ghost-chess-king/shared";

describe("StandardBoard 테스트", () => {
  let board: StandardBoard;

  beforeEach(() => {
    board = new StandardBoard();
  });

  describe("초기화 (createInitialBoard)", () => {
    test("8x8 크기의 보드 엔티티가 생성되어야 한다", () => {
      expect(board.boardEntity.length).toBe(8);
      expect(board.boardEntity[0].length).toBe(8);
    });

    test("특정 위치에 기물들이 올바르게 배치되어야 한다", () => {
      const whiteKing = board.getPiece({ row: 7, col: 4 });
      const blackKing = board.getPiece({ row: 0, col: 4 });

      expect(whiteKing?.type).toBe("king");
      expect(whiteKing?.color).toBe("white");
      expect(blackKing?.type).toBe("king");
      expect(blackKing?.color).toBe("black");
    });
  });

  describe("applySpecialRule - 특수 규칙 적용", () => {
    test("castling-kingside 적용 시 왕과 룩이 정해진 위치로 이동해야 한다", () => {
      const row = 7;
      board.applySpecialRule("castling-kingside", { row, col: 4 }, { row, col: 6 });

      expect(board.getPiece({ row, col: 6 })?.type).toBe("king");
      expect(board.getPiece({ row, col: 5 })?.type).toBe("rook");
      expect(board.getPiece({ row, col: 4 })).toBeNull();
      expect(board.getPiece({ row, col: 7 })).toBeNull();
    });

    test("castling-queenside 적용 시 왕과 룩이 정해진 위치로 이동해야 한다", () => {
      const row = 0;
      board.applySpecialRule("castling-queenside", { row, col: 4 }, { row, col: 2 });

      expect(board.getPiece({ row, col: 2 })?.type).toBe("king");
      expect(board.getPiece({ row, col: 3 })?.type).toBe("rook");
      expect(board.getPiece({ row, col: 4 })).toBeNull();
      expect(board.getPiece({ row, col: 0 })).toBeNull();
    });

    test("en-passant 적용 시 상대 기물이 제거되어야 한다", () => {
      const whitePawnPos: Position = { row: 3, col: 4 };
      const blackPawnPos: Position = { row: 3, col: 5 };
      const targetPos: Position = { row: 2, col: 5 };

      board.clear();
      const whitePawn = PieceFactory.create("pawn", "white", whitePawnPos);
      const blackPawn = PieceFactory.create("pawn", "black", blackPawnPos);

      board.setPiece(whitePawnPos, whitePawn);
      board.setPiece(blackPawnPos, blackPawn);

      board.applySpecialRule("en-passant", whitePawnPos, targetPos);

      expect(board.getPiece(targetPos)).toBe(whitePawn);
      expect(board.getPiece(blackPawnPos)).toBeNull();
    });
  });

  describe("clone - 보드 복제", () => {
    test("복제된 보드는 원본 보드와 동일한 기물 상태를 가져야 한다", () => {
      const clonedBoard = board.clone();

      expect(clonedBoard.rows).toBe(board.rows);
      expect(clonedBoard.cols).toBe(board.cols);
      expect(clonedBoard.toBoardString()).toBe(board.toBoardString());
    });

    test("복제된 보드의 기물을 변경해도 원본 보드에 영향을 주지 않아야 한다 (Deep Copy)", () => {
      const clonedBoard = board.clone();
      const testPos: Position = { row: 4, col: 4 };

      clonedBoard.setPiece(testPos, PieceFactory.create("queen", "white", testPos));

      expect(board.getPiece(testPos)).toBeNull();
      expect(clonedBoard.getPiece(testPos)).not.toBeNull();
    });
  });

  describe("PieceFactory 연동", () => {
    test("createInitialBoard에서 생성된 기물들이 올바른 인스턴스여야 한다", () => {
      const piece = board.getPiece({ row: 1, col: 0 });
      expect(piece).toBeDefined();
      expect(typeof piece?.moveTo).toBe("function");
    });
  });
});
