import { ChessTimer } from "@/model/chessTimer";
import { AppServer } from "@/types/socket";
import { GameMode, GameRoom, Side, Position } from "@ghost-chess-king/shared";
import { StandardRuler } from "@/model/chessRuler";
import { Chess } from "@/model/chess";

export class GameService {
  private rooms: Map<string, GameRoom> = new Map();
  private odIdToSocketId: Map<string, string> = new Map();

  constructor(private readonly io: AppServer) {}

  updateSocketId(odId: string, socketId: string): void {
    this.odIdToSocketId.set(odId, socketId);
  }

  removeSocketId(odId: string): void {
    this.odIdToSocketId.delete(odId);
  }

  private getPlayerSide(room: GameRoom, odId: string): Side | undefined {
    if (room.whitePlayer === odId) return "white";
    if (room.blackPlayer === odId) return "black";
    return undefined;
  }

  createRoom(roomId: string, whitePlayerOdId: string, blackPlayerOdId: string, mode: GameMode): GameRoom {
    const ruler = new StandardRuler();
    const timer = new ChessTimer(1000, 10000);
    const chess = new Chess(ruler, timer);

    chess.eventManager.on("gameStarted", (data) => this.io.to(roomId).emit("game-state", data.initialState));
    chess.eventManager.on("moveExecuted", (data) => this.io.to(roomId).emit("game-state", data.gameState));
    chess.eventManager.on("turnChanged", (data) => this.io.to(roomId).emit("game-state", data.gameState));
    chess.eventManager.on("check", (data) => this.io.to(roomId).emit("game-state", data.gameState));
    chess.eventManager.on("promotionRequired", (data) => this.io.to(roomId).emit("promotion-required", data));
    chess.eventManager.on("timeUpdate", (data) => this.io.to(roomId).emit("time-update", data));
    chess.eventManager.on("gameOver", (data) => {
      const room = this.rooms.get(roomId);
      if (!room) return;

      room.status = "FINISHED";
      room.winner = data.winner || "draw";
      room.winReason = data.result;

      this.io.to(roomId).emit("game-over", {
        winner: room.winner,
        reason: room.winReason,
      });

      this.rooms.delete(roomId);
    });

    const room: GameRoom = {
      roomId,
      mode,
      chess,
      timer,
      whitePlayer: whitePlayerOdId,
      blackPlayer: blackPlayerOdId,
      status: "PLAYING",
    };

    this.rooms.set(roomId, room);
    chess.startGame();

    return room;
  }

  makeMove(roomId: string, odId: string, from: Position, to: Position): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    const playerSide = this.getPlayerSide(room, odId);
    if (room.mode === "pvp" && playerSide !== room.chess.currentTurn) return false;

    return room.chess.executeMove(from, to);
  }

  resign(roomId: string, odId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const playerSide = this.getPlayerSide(room, odId);
    if (!playerSide) return;

    room.chess.resign(playerSide);
  }

  getValidMoves(roomId: string, odId: string, from: Position): Position[] | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const playerSide = this.getPlayerSide(room, odId);
    if (playerSide !== room.chess.currentTurn) return null;

    return room.chess.getValidMoves(from);
  }

  leaveRoom(roomId: string, odId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    if (room.status === "PLAYING") {
      const playerSide = this.getPlayerSide(room, odId);
      if (playerSide) room.chess.resign(playerSide);
    }
  }

  getRoomByOdId(odId: string): GameRoom | undefined {
    for (const room of this.rooms.values()) {
      if (room.whitePlayer === odId || room.blackPlayer === odId) return room;
    }
    return undefined;
  }

  getRoomByRoomId(roomId: string): GameRoom | undefined {
    return this.rooms.get(roomId);
  }

  sendGameState(roomId: string, socketId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    this.io.to(socketId).emit("game-state", room.chess.getGameState());
  }

  getGameStateForRestore(roomId: string, odId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const yourSide = this.getPlayerSide(room, odId);
    if (!yourSide) return null;

    return { yourSide, gameState: room.chess.getGameState() };
  }
}
