import { Chess } from "@/model/chess";
import { StandardRuler } from "@/model/chessRuler";
import { ChessTimer } from "@/model/chessTimer";
import { Position } from "@ghost-chess-king/shared";

describe("Chess 클래스 테스트", () => {
  let chess: Chess;
  let ruler: StandardRuler;
  let timer: ChessTimer;

  beforeEach(() => {
    ruler = new StandardRuler();
    timer = new ChessTimer(1000, 10000);
    chess = new Chess(ruler, timer);
  });

  afterEach(() => {
    timer.stop();
  });

  describe("초기화", () => {
    it("초기 상태가 올바르게 설정되어야 한다", () => {
      expect(chess.currentTurn).toBe("white");
      expect(chess.matchResult).toBe("PLAYING");
      expect(chess.moveHistory).toHaveLength(0);
      expect(chess.board).toBeDefined();
    });

    it("eventManager가 public으로 노출되어야 한다", () => {
      expect(chess.eventManager).toBeDefined();
      expect(typeof chess.eventManager.on).toBe("function");
      expect(typeof chess.eventManager.emit).toBe("function");
    });

    it("ruler와 timer가 주입되어야 한다", () => {
      expect(chess.ruler).toBe(ruler);
      expect(chess.timer).toBe(timer);
    });
  });

  describe("startGame()", () => {
    it("게임 시작 시 gameStarted 이벤트를 발생시켜야 한다", (done) => {
      chess.eventManager.on("gameStarted", (data) => {
        expect(data.initialState).toBeDefined();
        expect(data.initialState.currentTurn).toBe("white");
        expect(data.initialState.matchResult).toBe("PLAYING");
        done();
      });

      chess.startGame();
    });

    it("타이머를 white 턴으로 시작해야 한다", () => {
      const timerStartSpy = jest.spyOn(timer, "start");

      chess.startGame();

      expect(timerStartSpy).toHaveBeenCalledWith("white");
    });
  });

  describe("executeMove()", () => {
    beforeEach(() => {
      chess.startGame();
    });

    it("유효한 폰 이동이 성공해야 한다", () => {
      const from: Position = { row: 6, col: 4 };
      const to: Position = { row: 4, col: 4 };

      const result = chess.executeMove(from, to);

      expect(result).toBe(true);
      expect(chess.currentTurn).toBe("black");
      expect(chess.moveHistory).toHaveLength(1);
    });

    it("잘못된 턴의 기물을 이동하려 하면 실패해야 한다", () => {
      const from: Position = { row: 1, col: 4 };
      const to: Position = { row: 3, col: 4 };

      const result = chess.executeMove(from, to);

      expect(result).toBe(false);
      expect(chess.currentTurn).toBe("white");
      expect(chess.moveHistory).toHaveLength(0);
    });

    it("유효하지 않은 이동은 실패해야 한다", () => {
      const from: Position = { row: 6, col: 4 };
      const to: Position = { row: 3, col: 4 };

      const result = chess.executeMove(from, to);

      expect(result).toBe(false);
      expect(chess.moveHistory).toHaveLength(0);
    });

    it("빈 칸에서 이동하려 하면 실패해야 한다", () => {
      const from: Position = { row: 4, col: 4 };
      const to: Position = { row: 3, col: 4 };

      const result = chess.executeMove(from, to);

      expect(result).toBe(false);
    });

    it("moveExecuted 이벤트를 발생시켜야 한다", (done) => {
      chess.eventManager.on("moveExecuted", (data) => {
        expect(data.move).toBeDefined();
        expect(data.move.from).toEqual({ row: 6, col: 4 });
        expect(data.move.to).toEqual({ row: 4, col: 4 });
        expect(data.gameState).toBeDefined();
        done();
      });

      chess.executeMove({ row: 6, col: 4 }, { row: 4, col: 4 });
    });

    it("turnChanged 이벤트를 발생시켜야 한다", (done) => {
      chess.eventManager.on("turnChanged", (data) => {
        expect(data.currentTurn).toBe("black");
        expect(data.gameState).toBeDefined();
        done();
      });

      chess.executeMove({ row: 6, col: 4 }, { row: 4, col: 4 });
    });

    it("게임이 종료된 상태에서는 이동할 수 없어야 한다", () => {
      chess.matchResult = "CHECKMATE";

      const result = chess.executeMove({ row: 6, col: 4 }, { row: 4, col: 4 });

      expect(result).toBe(false);
    });
  });

  describe("undoMove()", () => {
    beforeEach(() => {
      chess.startGame();
    });

    it("이동 기록이 없으면 실패해야 한다", () => {
      const result = chess.undoMove();

      expect(result).toBe(false);
    });

    it("이동을 되돌리고 상태를 복원해야 한다", () => {
      chess.executeMove({ row: 6, col: 4 }, { row: 4, col: 4 });
      expect(chess.currentTurn).toBe("black");
      expect(chess.moveHistory).toHaveLength(1);

      const result = chess.undoMove();

      expect(result).toBe(true);
      expect(chess.currentTurn).toBe("white");
      expect(chess.moveHistory).toHaveLength(0);
      expect(chess.matchResult).toBe("PLAYING");
    });
  });

  describe("resign()", () => {
    it("기권 시 gameOver 이벤트를 발생시켜야 한다", (done) => {
      chess.eventManager.on("gameOver", (data) => {
        expect(data.result).toBe("RESIGNATION");
        expect(data.winner).toBe("black");
        expect(data.gameState).toBeDefined();
        done();
      });

      chess.resign("white");
    });

    it("matchResult를 RESIGNATION으로 설정하고 타이머를 정지해야 한다", () => {
      const timerStopSpy = jest.spyOn(timer, "stop");

      chess.resign("white");

      expect(chess.matchResult).toBe("RESIGNATION");
      expect(timerStopSpy).toHaveBeenCalled();
    });
  });

  describe("acceptDraw()", () => {
    it("무승부 합의 시 gameOver 이벤트를 발생시켜야 한다", (done) => {
      chess.eventManager.on("gameOver", (data) => {
        expect(data.result).toBe("DRAW_AGREEMENT");
        expect(data.winner).toBeUndefined();
        expect(data.gameState).toBeDefined();
        done();
      });

      chess.acceptDraw();
    });

    it("matchResult를 DRAW_AGREEMENT로 설정하고 타이머를 정지해야 한다", () => {
      const timerStopSpy = jest.spyOn(timer, "stop");

      chess.acceptDraw();

      expect(chess.matchResult).toBe("DRAW_AGREEMENT");
      expect(timerStopSpy).toHaveBeenCalled();
    });
  });

  describe("getValidMoves()", () => {
    beforeEach(() => {
      chess.startGame();
    });

    it("현재 턴의 기물에 대한 유효한 이동을 반환해야 한다", () => {
      const position: Position = { row: 6, col: 4 };

      const validMoves = chess.getValidMoves(position);

      expect(validMoves.length).toBeGreaterThan(0);
      expect(validMoves).toContainEqual({ row: 5, col: 4 });
      expect(validMoves).toContainEqual({ row: 4, col: 4 });
    });

    it("현재 턴이 아닌 기물에 대해서는 빈 배열을 반환해야 한다", () => {
      const position: Position = { row: 1, col: 4 };

      const validMoves = chess.getValidMoves(position);

      expect(validMoves).toHaveLength(0);
    });

    it("빈 칸에 대해서는 빈 배열을 반환해야 한다", () => {
      const position: Position = { row: 4, col: 4 };

      const validMoves = chess.getValidMoves(position);

      expect(validMoves).toHaveLength(0);
    });
  });

  describe("isGameOver()", () => {
    it("PLAYING 상태에서는 false를 반환해야 한다", () => {
      expect(chess.isGameOver()).toBe(false);
    });

    it("CHECK 상태에서는 false를 반환해야 한다", () => {
      chess.matchResult = "CHECK";

      expect(chess.isGameOver()).toBe(false);
    });

    it("CHECKMATE 상태에서는 true를 반환해야 한다", () => {
      chess.matchResult = "CHECKMATE";

      expect(chess.isGameOver()).toBe(true);
    });

    it("STALEMATE 상태에서는 true를 반환해야 한다", () => {
      chess.matchResult = "STALEMATE";

      expect(chess.isGameOver()).toBe(true);
    });
  });

  describe("getGameState()", () => {
    it("현재 게임 상태를 반환해야 한다", () => {
      const state = chess.getGameState();

      expect(state.currentTurn).toBe("white");
      expect(state.matchResult).toBe("PLAYING");
      expect(state.board).toBeDefined();
      expect(state.moveHistory).toEqual([]);
      expect(state.fen).toBeDefined();
      expect(state.timeRemaining).toBeDefined();
    });

    it("moveHistory는 복사본이어야 한다", () => {
      chess.startGame();
      chess.executeMove({ row: 6, col: 4 }, { row: 4, col: 4 });

      const state = chess.getGameState();

      expect(state.moveHistory).not.toBe(chess.moveHistory);
      expect(state.moveHistory).toEqual(chess.moveHistory);
    });
  });

  describe("getFen()", () => {
    it("초기 보드의 FEN 문자열을 생성해야 한다", () => {
      const fen = chess.getFen();

      expect(fen).toContain("rnbqkbnr/pppppppp");
      expect(fen).toContain("w");
      expect(fen).toContain("KQkq");
    });

    it("이동 후 FEN이 업데이트되어야 한다", () => {
      chess.startGame();
      chess.executeMove({ row: 6, col: 4 }, { row: 4, col: 4 });

      const fen = chess.getFen();

      expect(fen).toContain("b");
    });
  });

  describe("resetGame()", () => {
    it("게임을 초기 상태로 리셋해야 한다", () => {
      chess.startGame();
      chess.executeMove({ row: 6, col: 4 }, { row: 4, col: 4 });
      chess.matchResult = "CHECK";

      chess.resetGame();

      expect(chess.currentTurn).toBe("white");
      expect(chess.matchResult).toBe("PLAYING");
      expect(chess.moveHistory).toHaveLength(0);
    });

    it("타이머를 정지해야 한다", () => {
      const timerStopSpy = jest.spyOn(timer, "stop");

      chess.resetGame();

      expect(timerStopSpy).toHaveBeenCalled();
    });
  });

  describe("타이머 이벤트 통합", () => {
    it("타이머 timeUpdate 이벤트를 Chess의 이벤트로 전달해야 한다", (done) => {
      chess.eventManager.on("timeUpdate", (data) => {
        expect(data.whiteTime).toBeDefined();
        expect(data.blackTime).toBeDefined();
        done();
      });

      chess.startGame();
    });

    it("타이머 timeout 이벤트 발생 시 gameOver 이벤트를 발생시켜야 한다", (done) => {
      const shortTimer = new ChessTimer(0, 100);
      const shortChess = new Chess(ruler, shortTimer);

      shortChess.eventManager.on("gameOver", (data) => {
        expect(data.result).toBe("TIMEOUT");
        expect(data.winner).toBeDefined();
        shortTimer.stop();
        done();
      });

      shortChess.startGame();
    }, 1000);
  });
});
