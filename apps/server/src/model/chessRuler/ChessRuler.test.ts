import { ChessRuler } from "./ChessRuler";
import { IChessBoard, IPiece, Move, Position, Side, PromotionPieceName } from "@ghost-chess-king/shared";

class MockChessRuler extends ChessRuler {
  public validMovesToReturn: Position[] = [];

  public getValidMoves(_board: IChessBoard, _piece: IPiece, _moveHistory: Move[]): Position[] {
    return this.validMovesToReturn;
  }
  public getSpecialRule(_board: IChessBoard, _from: Position, _to: Position, _moveHistory: Move[]): string | null {
    return null;
  }

  public publicHasAnyLegalMove(board: IChessBoard, color: Side, moveHistory: Move[]): boolean {
    return this.hasAnyLegalMove(board, color, moveHistory);
  }
}

describe("ChessRuler 테스트", () => {
  let ruler: MockChessRuler;
  let mockBoard: jest.Mocked<IChessBoard>;

  beforeEach(() => {
    ruler = new MockChessRuler();
    mockBoard = {
      getPiece: jest.fn(),
      findKing: jest.fn(),
      isPositionUnderAttack: jest.fn(),
      clone: jest.fn(),
      movePiece: jest.fn(),
      removePiece: jest.fn(),
      getAllPieces: jest.fn(),
      rows: 8,
      cols: 8,
    } as unknown as jest.Mocked<IChessBoard>;
  });

  describe("isInCheck (체크 확인)", () => {
    test("왕이 공격받고 있으면 true를 반환해야 한다", () => {
      const kingPos: Position = { row: 7, col: 4 };
      mockBoard.findKing.mockReturnValue(kingPos);
      mockBoard.isPositionUnderAttack.mockReturnValue(true);

      expect(ruler.isInCheck(mockBoard, "white")).toBe(true);
      expect(mockBoard.isPositionUnderAttack).toHaveBeenCalledWith(kingPos, "black");
    });

    test("왕을 찾을 수 없으면 false를 반환해야 한다", () => {
      mockBoard.findKing.mockReturnValue(undefined);
      expect(ruler.isInCheck(mockBoard, "white")).toBe(false);
    });
  });

  describe("needsPromotion (승급 확인)", () => {
    test("백색 폰이 0행에 도달하면 true를 반환해야 한다", () => {
      const pos: Position = { row: 0, col: 0 };
      const pawn: Partial<IPiece> = { type: "pawn", color: "white" };
      mockBoard.getPiece.mockReturnValue(pawn as IPiece);

      expect(ruler.needsPromotion(mockBoard, pos)).toBe(true);
    });
  });

  describe("wouldExposeKing (왕 노출 확인)", () => {
    test("기물 이동 후 자신의 왕이 체크 상태가 되면 true를 반환해야 한다", () => {
      const from: Position = { row: 6, col: 4 };
      const to: Position = { row: 5, col: 4 };

      const clonedBoard = {
        ...mockBoard,
        movePiece: jest.fn(),
        findKing: jest.fn().mockReturnValue({ row: 7, col: 4 }),
        isPositionUnderAttack: jest.fn().mockReturnValue(true),
      } as unknown as jest.Mocked<IChessBoard>;

      mockBoard.getPiece.mockReturnValue({ color: "white" } as IPiece);
      mockBoard.clone.mockReturnValue(clonedBoard);

      expect(ruler.wouldExposeKing(mockBoard, from, to)).toBe(true);
    });
  });

  describe("isCheckmate (체크메이트)", () => {
    test("체크 상태이고 유효한 이동이 없으면 true를 반환해야 한다", () => {
      jest.spyOn(ruler, "isInCheck").mockReturnValue(true);
      mockBoard.getAllPieces.mockReturnValue([{ type: "king", color: "white" } as IPiece]);
      ruler.validMovesToReturn = [];

      expect(ruler.isCheckmate(mockBoard, "white", [])).toBe(true);
    });
  });

  test("getPromotionOptions는 정해진 기물 목록을 반환해야 한다", () => {
    const expected: PromotionPieceName[] = ["queen", "rook", "bishop", "knight"];
    expect(ruler.getPromotionOptions()).toEqual(expected);
  });
});
