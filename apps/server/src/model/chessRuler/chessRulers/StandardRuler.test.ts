import { StandardRuler } from "./StandardRuler";
import { IChessBoard, IPiece, Move, Position } from "@ghost-chess-king/shared";

describe("StandardRuler 테스트", () => {
  let ruler: StandardRuler;
  let mockBoard: jest.Mocked<IChessBoard>;

  beforeEach(() => {
    ruler = new StandardRuler();
    mockBoard = {
      getPiece: jest.fn(),
      findKing: jest.fn(),
      isPositionUnderAttack: jest.fn(),
      clone: jest.fn(),
      movePiece: jest.fn(),
      getAllPieces: jest.fn(),
      rows: 8,
      cols: 8,
    } as unknown as jest.Mocked<IChessBoard>;
  });

  describe("getEnPassantMoves - 앙파상", () => {
    test("상대방 폰이 두 칸 전진했을 때 앙파상 이동이 가능해야 한다", () => {
      const whitePawnPos: Position = { row: 3, col: 4 };
      const whitePawn = {
        type: "pawn",
        color: "white",
        position: whitePawnPos,
        getPotentialPaths: () => [],
      } as unknown as IPiece;

      const lastMove: Move = {
        from: { row: 1, col: 5 },
        to: { row: 3, col: 5 },
        pieceType: "pawn",
        color: "black",
        pieceId: 10,
        timestamp: Date.now(),
      };

      mockBoard.getPiece.mockImplementation((pos) => {
        if (pos.row === 3 && pos.col === 5) return { color: "black", type: "pawn" } as IPiece;
        return null;
      });

      const moves = ruler.getValidMoves(mockBoard, whitePawn, [lastMove]);
      expect(moves).toContainEqual({ row: 2, col: 5 });
    });
  });

  describe("getSpecialRule - 특별 규칙 판정", () => {
    test("앙파상 이동 시 'en-passant' 문자열을 반환해야 한다", () => {
      const from: Position = { row: 3, col: 4 };
      const to: Position = { row: 2, col: 5 };
      const pawn = { type: "pawn", color: "white", position: from } as IPiece;

      const lastMove: Move = {
        from: { row: 1, col: 5 },
        to: { row: 3, col: 5 },
        pieceType: "pawn",
        color: "black",
        pieceId: 20,
        timestamp: Date.now(),
      };

      mockBoard.getPiece.mockImplementation((pos) => {
        if (pos.row === from.row && pos.col === from.col) return pawn;
        if (pos.row === 3 && pos.col === 5) return { color: "black", type: "pawn" } as IPiece;
        return null;
      });

      const rule = ruler.getSpecialRule(mockBoard, from, to, [lastMove]);
      expect(rule).toBe("en-passant");
    });
  });
});
