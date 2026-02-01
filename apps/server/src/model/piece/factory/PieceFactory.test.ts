import { King, Queen, Rook, Bishop, Knight, Pawn, PieceFactory } from "@/model/piece";
import { IPiece, Position } from "@ghost-chess-king/shared";

describe("PieceFactory 테스트", () => {
  const position: Position = { row: 0, col: 0 };

  beforeEach(() => {});

  describe("create - 기물 생성", () => {
    test("킹(king)을 올바르게 생성해야 한다", () => {
      const piece = PieceFactory.create("king", "white", position);
      expect(piece).toBeInstanceOf(King);
      expect(piece.type).toBe("king");
      expect(piece.color).toBe("white");
    });

    test("퀸(queen)을 올바르게 생성해야 한다", () => {
      const piece = PieceFactory.create("queen", "black", position);
      expect(piece).toBeInstanceOf(Queen);
      expect(piece.type).toBe("queen");
    });

    test("룩(rook)을 올바르게 생성해야 한다", () => {
      const piece = PieceFactory.create("rook", "white", position);
      expect(piece).toBeInstanceOf(Rook);
    });

    test("비숍(bishop)을 올바르게 생성해야 한다", () => {
      const piece = PieceFactory.create("bishop", "black", position);
      expect(piece).toBeInstanceOf(Bishop);
    });

    test("나이트(knight)를 올바르게 생성해야 한다", () => {
      const piece = PieceFactory.create("knight", "white", position);
      expect(piece).toBeInstanceOf(Knight);
    });

    test("폰(pawn)을 올바르게 생성해야 한다", () => {
      const piece = PieceFactory.create("pawn", "black", position);
      expect(piece).toBeInstanceOf(Pawn);
    });

    test("생성될 때마다 고유한 ID를 가져야 한다", () => {
      const piece1 = PieceFactory.create("pawn", "white", position);
      const piece2 = PieceFactory.create("pawn", "white", position);
      expect(piece1.id).not.toBe(piece2.id);
    });

    test("hasMoved 옵션이 올바르게 반영되어야 한다", () => {
      const piece = PieceFactory.create("rook", "white", position, true);
      expect(piece.hasMoved).toBe(true);
    });
  });

  describe("createPromotion - 기물 승격", () => {
    let mockPawn: IPiece;

    beforeEach(() => {
      mockPawn = PieceFactory.create("pawn", "white", { row: 0, col: 4 });
    });

    test("폰의 ID와 색상을 유지하며 퀸으로 승격해야 한다", () => {
      const promoted = PieceFactory.createPromotion(mockPawn, "queen");

      expect(promoted).toBeInstanceOf(Queen);
      expect(promoted.id).toBe(mockPawn.id);
      expect(promoted.color).toBe(mockPawn.color);
      expect(promoted.position).toEqual(mockPawn.position);
      expect(promoted.hasMoved).toBe(true);
    });

    test("나이트로 승격 시 올바른 클래스 인스턴스를 반환해야 한다", () => {
      const promoted = PieceFactory.createPromotion(mockPawn, "knight");
      expect(promoted).toBeInstanceOf(Knight);
    });

    test("룩으로 승격 시 올바른 클래스 인스턴스를 반환해야 한다", () => {
      const promoted = PieceFactory.createPromotion(mockPawn, "rook");
      expect(promoted).toBeInstanceOf(Rook);
    });

    test("비숍으로 승격 시 올바른 클래스 인스턴스를 반환해야 한다", () => {
      const promoted = PieceFactory.createPromotion(mockPawn, "bishop");
      expect(promoted).toBeInstanceOf(Bishop);
    });
  });
});
