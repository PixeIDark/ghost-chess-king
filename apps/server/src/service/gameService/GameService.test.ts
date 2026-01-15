import { GameService } from "./GameService";
import { Position } from "@ghost-chess-king/shared";
import { AppServer } from "@/types/socket";

describe("GameService", () => {
  let gameService: GameService;
  let mockIo: Partial<AppServer>;

  beforeEach(() => {
    const mockRoom = {
      emit: jest.fn().mockReturnThis(),
    };

    mockIo = {
      to: jest.fn().mockReturnValue(mockRoom),
      emit: jest.fn().mockReturnThis(),
    };

    gameService = new GameService(mockIo as AppServer);
  });

  describe("updateSocketId", () => {
    it("odId와 socketId 매핑을 업데이트해야 한다", () => {
      gameService.updateSocketId("user1", "socket1");
      gameService.updateSocketId("user1", "socket2");

      expect(() => gameService.updateSocketId("user1", "socket2")).not.toThrow();
    });
  });

  describe("removeSocketId", () => {
    it("odId의 socketId 매핑을 제거해야 한다", () => {
      gameService.updateSocketId("user1", "socket1");
      gameService.removeSocketId("user1");

      expect(() => gameService.removeSocketId("user1")).not.toThrow();
    });
  });

  describe("createRoom", () => {
    it("새로운 게임 방을 생성하고 반환해야 한다", () => {
      const room = gameService.createRoom("room1", "white-player", "black-player", "pvp");

      expect(room).toBeDefined();
      expect(room.roomId).toBe("room1");
      expect(room.mode).toBe("pvp");
      expect(room.whitePlayer).toBe("white-player");
      expect(room.blackPlayer).toBe("black-player");
      expect(room.status).toBe("PLAYING");
      expect(room.chess).toBeDefined();
      expect(room.timer).toBeDefined();
    });

    it("생성된 방을 getRoomByRoomId로 조회할 수 있어야 한다", () => {
      gameService.createRoom("room1", "white-player", "black-player", "pvp");

      const room = gameService.getRoomByRoomId("room1");

      expect(room).toBeDefined();
      expect(room?.roomId).toBe("room1");
    });
  });

  describe("makeMove", () => {
    beforeEach(() => {
      gameService.createRoom("room1", "white-player", "black-player", "pvp");
      gameService.updateSocketId("white-player", "socket-white");
      gameService.updateSocketId("black-player", "socket-black");
    });

    it("유효한 이동이 성공해야 한다", () => {
      const from: Position = { row: 6, col: 4 };
      const to: Position = { row: 4, col: 4 };

      const result = gameService.makeMove("room1", "white-player", from, to);

      expect(result).toBe(true);
    });

    it("존재하지 않는 방에서 이동 시도하면 실패해야 한다", () => {
      const from: Position = { row: 6, col: 4 };
      const to: Position = { row: 4, col: 4 };

      const result = gameService.makeMove("non-existent", "white-player", from, to);

      expect(result).toBe(false);
    });

    it("잘못된 턴에 이동 시도하면 실패해야 한다", () => {
      const from: Position = { row: 1, col: 4 };
      const to: Position = { row: 3, col: 4 };

      const result = gameService.makeMove("room1", "black-player", from, to);

      expect(result).toBe(false);
    });

    it("유효하지 않은 이동은 실패해야 한다", () => {
      const from: Position = { row: 6, col: 4 };
      const to: Position = { row: 3, col: 4 };

      const result = gameService.makeMove("room1", "white-player", from, to);

      expect(result).toBe(false);
    });
  });

  describe("getValidMoves", () => {
    beforeEach(() => {
      gameService.createRoom("room1", "white-player", "black-player", "pvp");
    });

    it("현재 턴 플레이어의 유효한 이동을 반환해야 한다", () => {
      const position: Position = { row: 6, col: 4 };

      const validMoves = gameService.getValidMoves("room1", "white-player", position);

      expect(validMoves).not.toBeNull();
      expect(validMoves!.length).toBeGreaterThan(0);
    });

    it("현재 턴이 아닌 플레이어는 null을 반환해야 한다", () => {
      const position: Position = { row: 1, col: 4 };

      const validMoves = gameService.getValidMoves("room1", "black-player", position);

      expect(validMoves).toBeNull();
    });

    it("존재하지 않는 방은 null을 반환해야 한다", () => {
      const position: Position = { row: 6, col: 4 };

      const validMoves = gameService.getValidMoves("non-existent", "white-player", position);

      expect(validMoves).toBeNull();
    });
  });

  describe("resign", () => {
    beforeEach(() => {
      gameService.createRoom("room1", "white-player", "black-player", "pvp");
    });

    it("존재하지 않는 방에서 기권 시도해도 에러가 발생하지 않아야 한다", () => {
      expect(() => gameService.resign("non-existent", "white-player")).not.toThrow();
    });
  });

  describe("leaveRoom", () => {
    beforeEach(() => {
      gameService.createRoom("room1", "white-player", "black-player", "pvp");
    });

    it("존재하지 않는 방에서 나가기 시도해도 에러가 발생하지 않아야 한다", () => {
      expect(() => gameService.leaveRoom("non-existent", "white-player")).not.toThrow();
    });
  });

  describe("getRoomByOdId", () => {
    beforeEach(() => {
      gameService.createRoom("room1", "white-player", "black-player", "pvp");
    });

    it("플레이어의 odId로 방을 찾을 수 있어야 한다", () => {
      const room = gameService.getRoomByOdId("white-player");

      expect(room).toBeDefined();
      expect(room?.roomId).toBe("room1");
    });

    it("방에 속하지 않은 플레이어는 undefined를 반환해야 한다", () => {
      const room = gameService.getRoomByOdId("non-player");

      expect(room).toBeUndefined();
    });
  });

  describe("getRoomByRoomId", () => {
    beforeEach(() => {
      gameService.createRoom("room1", "white-player", "black-player", "pvp");
    });

    it("roomId로 방을 찾을 수 있어야 한다", () => {
      const room = gameService.getRoomByRoomId("room1");

      expect(room).toBeDefined();
      expect(room?.roomId).toBe("room1");
    });

    it("존재하지 않는 roomId는 undefined를 반환해야 한다", () => {
      const room = gameService.getRoomByRoomId("non-existent");

      expect(room).toBeUndefined();
    });
  });

  describe("sendGameState", () => {
    beforeEach(() => {
      gameService.createRoom("room1", "white-player", "black-player", "pvp");
    });

    it("특정 소켓에 게임 상태를 전송해야 한다", () => {
      gameService.sendGameState("room1", "socket1");

      expect(mockIo.to).toHaveBeenCalledWith("socket1");
    });

    it("존재하지 않는 방은 to를 호출하지 않아야 한다", () => {
      const toMock = mockIo.to as jest.Mock;
      toMock.mockClear();

      gameService.sendGameState("non-existent", "socket1");

      expect(toMock).not.toHaveBeenCalled();
    });
  });

  describe("getGameStateForRestore", () => {
    beforeEach(() => {
      gameService.createRoom("room1", "white-player", "black-player", "pvp");
    });

    it("플레이어의 게임 상태 복원 정보를 반환해야 한다", () => {
      const restoreData = gameService.getGameStateForRestore("room1", "white-player");

      expect(restoreData).not.toBeNull();
      expect(restoreData?.yourSide).toBe("white");
      expect(restoreData?.gameState).toBeDefined();
    });

    it("방에 속하지 않은 플레이어는 null을 반환해야 한다", () => {
      const restoreData = gameService.getGameStateForRestore("room1", "non-player");

      expect(restoreData).toBeNull();
    });

    it("존재하지 않는 방은 null을 반환해야 한다", () => {
      const restoreData = gameService.getGameStateForRestore("non-existent", "white-player");

      expect(restoreData).toBeNull();
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });
});
