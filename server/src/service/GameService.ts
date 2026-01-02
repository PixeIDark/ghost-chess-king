import { GameMode, GameRoom, GameState } from "../types/game.ts";
import { Server } from "socket.io";
import { GameEndReason, Side, Square } from "../types/chess.ts";
import { Chess } from "../model/chess";
import { ChessTimer } from "../model/chessTimer";
import { getOppositeSide } from "../utils/squareUtils.ts";
import { ClientToServerEvents, ServerToClientEvents } from "../types/socket.ts";

export class GameService {
  private rooms: Map<string, GameRoom> = new Map();
  private odIdToSocketId: Map<string, string> = new Map(); // odId -> socketId
  private io: Server<ClientToServerEvents, ServerToClientEvents>;

  constructor(io: Server) {
    this.io = io;
  }

  updateSocketId(odId: string, socketId: string): void {
    this.odIdToSocketId.set(odId, socketId);
  }

  removeSocketId(odId: string): void {
    this.odIdToSocketId.delete(odId);
  }

  private getSocketId(odId: string): string | undefined {
    if (odId === "AI") return undefined;
    return this.odIdToSocketId.get(odId);
  }

  private getPlayerSide(room: GameRoom, odId: string): Side | undefined {
    if (room.whitePlayer === odId) return "white";
    if (room.blackPlayer === odId) return "black";
    return undefined;
  }

  createRoom(roomId: string, whitePlayerOdId: string, blackPlayerOdId: string, mode: GameMode): GameRoom {
    const chess = new Chess();
    const timer = new ChessTimer(
      (whiteTime, blackTime) => this.io.to(roomId).emit("time-update", { whiteTime, blackTime }),
      (loser) => {
        const winner = getOppositeSide(loser);
        this.endGame(roomId, winner, "timeout");
      }
    );
    const room: GameRoom = {
      roomId,
      mode,
      chess,
      timer,
      whitePlayer: whitePlayerOdId,
      blackPlayer: blackPlayerOdId,
      status: "playing",
    };

    timer.start(chess.turn());
    this.rooms.set(roomId, room);
    this.broadcastGameState(roomId);

    return room;
  }

  makeMove(roomId: string, odId: string, from: Square, to: Square): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    const playerSide = this.getPlayerSide(room, odId);
    if (room.mode === "pvp" && playerSide !== room.chess.turn()) return false;

    try {
      room.chess = room.chess.move(from, to);
      room.timer.switchTurn(room.chess.turn());
      this.broadcastGameState(roomId, { from, to });

      const status = room.chess.status();
      if (status.state === "checkmate") this.endGame(roomId, status.winner as Side, "checkmate");
      if (status.state === "stalemate") this.endGame(roomId, "draw", "stalemate");

      return true;
    } catch (error) {
      console.error("Invalid move:", error);
      return false;
    }
  }

  private broadcastGameState(roomId: string, lastMove?: { from: Square; to: Square }) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const gameState: GameState = {
      board: room.chess.board(),
      fen: room.chess.getFen(),
      turn: room.chess.turn(),
      timeState: room.timer.getTime(),
      status: room.chess.status(),
      lastMove,
    };

    const whiteSocketId = this.getSocketId(room.whitePlayer);
    const blackSocketId = this.getSocketId(room.blackPlayer);

    if (whiteSocketId) this.io.to(whiteSocketId).emit("game-state", gameState);
    if (blackSocketId) this.io.to(blackSocketId).emit("game-state", gameState);
  }

  private endGame(roomId: string, winner: Side | "draw", reason: GameEndReason) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.status = "finished";
    room.winner = winner;
    room.winReason = reason;
    room.timer.stop();

    this.io.to(roomId).emit("game-over", { winner, reason });
    this.rooms.delete(roomId);
  }

  resign(roomId: string, odId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const playerSide = this.getPlayerSide(room, odId);
    if (!playerSide) return;

    const winner = getOppositeSide(playerSide);
    this.endGame(roomId, winner, "resignation");
  }

  getValidMoves(roomId: string, odId: string, from: Square): Square[] | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const playerSide = this.getPlayerSide(room, odId);

    if (room.mode === "ai") {
      if (playerSide !== room.chess.turn()) return null;
      return room.chess.validMove(from);
    }

    if (playerSide !== room.chess.turn()) return null;
    return room.chess.validMove(from);
  }

  leaveRoom(roomId: string, odId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    if (room.status === "playing") {
      const playerSide = this.getPlayerSide(room, odId);
      if (playerSide) {
        const winner = getOppositeSide(playerSide);
        this.endGame(roomId, winner, "resignation");
      }
    }

    room.timer.stop();
    this.rooms.delete(roomId);
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

  sendGameState(roomId: string, socketId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const gameState: GameState = {
      board: room.chess.board(),
      turn: room.chess.turn(),
      timeState: room.timer.getTime(),
      status: room.chess.status(),
      fen: room.chess.getFen(),
    };

    this.io.to(socketId).emit("game-state", gameState);
  }

  getGameStateForRestore(roomId: string, odId: string): { yourSide: Side; gameState: GameState } | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const yourSide = this.getPlayerSide(room, odId);
    if (!yourSide) return null;

    const gameState: GameState = {
      board: room.chess.board(),
      turn: room.chess.turn(),
      timeState: room.timer.getTime(),
      status: room.chess.status(),
      fen: room.chess.getFen(),
    };

    return { yourSide, gameState };
  }
}
