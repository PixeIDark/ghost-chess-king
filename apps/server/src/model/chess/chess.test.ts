import { Chess } from "./Chess";
import { IChessBoard, IChessRuler, IChessTimer, IPiece, Position, Move } from "@ghost-chess-king/shared";

describe("Chess 클래스 테스트", () => {
  let chess: Chess;
  let mockRuler: jest.Mocked<IChessRuler>;
  let mockTimer: jest.Mocked<IChessTimer>;
  let mockBoard: jest.Mocked<IChessBoard>;

  beforeEach(() => {
    mockRuler = {
      getValidMoves: jest.fn(),
      getSpecialRule: jest.fn(),
      isCheckmate: jest.fn(),
      isStalemate: jest.fn(),
      isInCheck: jest.fn(),
      needsPromotion: jest.fn(),
      getPromotionOptions: jest.fn(),
    } as unknown as jest.Mocked<IChessRuler>;

    mockTimer = {
      start: jest.fn(),
      stop: jest.fn(),
      switchTurn: jest.fn(),
      getTime: jest.fn().mockReturnValue({ whiteTime: 60000, blackTime: 60000 }),
    } as unknown as jest.Mocked<IChessTimer>;

    mockBoard = {
      getPiece: jest.fn(),
      movePiece: jest.fn(),
      applySpecialRule: jest.fn(),
      clone: jest.fn(),
      clear: jest.fn(),
      toDto: jest.fn(),
      toBoardString: jest.fn().mockReturnValue("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"),
    } as unknown as jest.Mocked<IChessBoard>;

    chess = new Chess(mockRuler, mockTimer, mockBoard);
  });

  test("startGame 호출 시 타이머가 시작되어야 한다", () => {
    chess.startGame();
    expect(mockTimer.start).toHaveBeenCalledWith("white");
  });

  describe("executeMove 테스트", () => {
    const from: Position = { row: 6, col: 4 };
    const to: Position = { row: 4, col: 4 };
    const mockPiece = { id: 1, type: "pawn", color: "white" } as IPiece;

    test("잘못된 턴의 기물을 움직이려 하면 실패해야 한다", () => {
      mockBoard.getPiece.mockReturnValue({ ...mockPiece, color: "black" } as IPiece);
      const result = chess.executeMove(from, to);
      expect(result.success).toBe(false);
    });

    test("유효한 이동 경로가 아니면 실패해야 한다", () => {
      mockBoard.getPiece.mockReturnValue(mockPiece);
      mockRuler.getValidMoves.mockReturnValue([{ row: 5, col: 4 }]);
      const result = chess.executeMove(from, to);
      expect(result.success).toBe(false);
    });

    test("성공적인 이동 시 보드 상태와 타이머 턴이 업데이트되어야 한다", () => {
      mockBoard.getPiece.mockReturnValue(mockPiece);
      mockRuler.getValidMoves.mockReturnValue([to]);
      mockBoard.clone.mockReturnValue(mockBoard);

      const result = chess.executeMove(from, to);

      expect(result.success).toBe(true);
      expect(mockBoard.movePiece).toHaveBeenCalledWith(from, to);
      expect(mockTimer.switchTurn).toHaveBeenCalledWith("black");
      expect(chess.currentTurn).toBe("black");
    });

    test("승격이 필요한 경우 success가 false이고 needsPromotion이 true여야 한다", () => {
      mockBoard.getPiece.mockReturnValue(mockPiece);
      mockRuler.getValidMoves.mockReturnValue([to]);
      mockRuler.needsPromotion.mockReturnValue(true);
      mockBoard.clone.mockReturnValue(mockBoard);

      const result = chess.executeMove(from, to);

      expect(result.success).toBe(false);
      expect(result.needsPromotion).toBe(true);
    });
  });

  describe("게임 상태 관리 테스트", () => {
    test("체크메이트 시 게임 결과가 올바르게 설정되어야 한다", () => {
      mockBoard.getPiece.mockReturnValue({ id: 1, type: "queen", color: "white" } as IPiece);
      mockRuler.getValidMoves.mockReturnValue([{ row: 0, col: 0 }]);
      mockRuler.isCheckmate.mockReturnValue(true);
      mockBoard.clone.mockReturnValue(mockBoard);

      chess.executeMove({ row: 1, col: 0 }, { row: 0, col: 0 });

      expect(chess.matchResult).toBe("CHECKMATE");
      expect(chess.isGameOver()).toBe(true);
      expect(chess.getGameResult()).toEqual({ status: "CHECKMATE", winner: "white" });
    });

    test("undoMove 호출 시 이전 보드 상태로 복구되어야 한다", () => {
      mockBoard.getPiece.mockReturnValue({ id: 1, type: "pawn", color: "white" } as IPiece);
      mockRuler.getValidMoves.mockReturnValue([{ row: 5, col: 4 }]);
      const clonedBoard = { ...mockBoard } as IChessBoard;
      mockBoard.clone.mockReturnValue(clonedBoard);

      chess.executeMove({ row: 6, col: 4 }, { row: 5, col: 4 });
      const undoResult = chess.undoMove();

      expect(undoResult).toBe(true);
      expect(chess.board).toBe(clonedBoard);
      expect(chess.currentTurn).toBe("white");
    });
  });

  describe("FEN 생성 테스트", () => {
    test("기본적인 FEN 문자열 형식을 만족해야 한다", () => {
      const fen = chess.getFen();
      const parts = fen.split(" ");
      expect(parts.length).toBe(6);
      expect(parts[1]).toBe("w");
    });

    test("앙파상 타겟 위치가 FEN에 올바르게 반영되어야 한다", () => {
      const lastMove: Move = {
        pieceId: 1,
        pieceType: "pawn",
        from: { row: 6, col: 4 },
        to: { row: 4, col: 4 },
        color: "white",
        timestamp: Date.now(),
      };
      chess.moveHistory.push(lastMove);

      const fen = chess.getFen();
      expect(fen).toContain("e3");
    });
  });

  test("resign 호출 시 상대방이 승리해야 한다", () => {
    const result = chess.resign("white");
    expect(result.winner).toBe("black");
    expect(chess.matchResult).toBe("RESIGNATION");
    expect(mockTimer.stop).toHaveBeenCalled();
  });
});
