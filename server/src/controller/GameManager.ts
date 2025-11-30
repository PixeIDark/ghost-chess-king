import { GameMode, GameRoom, GameState } from "../types/game.ts";
import { Server } from "socket.io";
import { Side, Square } from "../types/chess.ts";
import { Chess } from "../model/chess";
import { ChessTimer } from "../model/chessTimer";
import { getOppositeSide } from "../utils/squareUtils.ts";
import { ClientToServerEvents, ServerToClientEvents } from "../types/socket.ts";

export class GameManager {
  private rooms: Map<string, GameRoom> = new Map();
  private io: Server<ClientToServerEvents, ServerToClientEvents>;

  constructor(io: Server) {
    this.io = io;
  }

  createRoom(roomId: string, whitePlayerId: string, blackPlayerId: string, mode: GameMode): GameRoom {
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
      whitePlayer: whitePlayerId,
      blackPlayer: blackPlayerId,
      playerSides: new Map([
        [whitePlayerId, "white"],
        [blackPlayerId === "AI" ? "AI" : blackPlayerId, "black"],
      ]),
      status: "playing",
    };

    timer.start(chess.turn());
    this.rooms.set(roomId, room);
    this.broadcastGameState(roomId);

    return room;
  }

  makeMove(roomId: string, socketId: string, from: Square, to: Square): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    const playerSide = room.playerSides.get(socketId);
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

    if (room.whitePlayer !== "AI") this.io.to(room.whitePlayer).emit("game-state", gameState);
    if (room.blackPlayer !== "AI") this.io.to(room.blackPlayer).emit("game-state", gameState);
  }

  private endGame(
    roomId: string,
    winner: Side | "draw",
    reason: "checkmate" | "timeout" | "stalemate" | "resignation"
  ) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.status = "finished";
    room.winner = winner;
    room.winReason = reason;
    room.timer.stop();

    this.io.to(roomId).emit("game-over", { winner, reason });
  }

  resign(roomId: string, socketId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const playerSide = room.playerSides.get(socketId);
    if (!playerSide) return;

    const winner = getOppositeSide(playerSide);
    this.endGame(roomId, winner, "resignation");
  }

  getValidMoves(roomId: string, socketId: string, from: Square): Square[] | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const playerSide = room.playerSides.get(socketId);

    if (room.mode === "ai") {
      if (playerSide !== room.chess.turn()) return null;
      return room.chess.validMove(from);
    }

    if (playerSide !== room.chess.turn()) return null;
    return room.chess.validMove(from);
  }

  leaveRoom(roomId: string, socketId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    if (room.status === "playing") {
      const playerSide = room.playerSides.get(socketId);
      if (playerSide) {
        const winner = getOppositeSide(playerSide);
        this.endGame(roomId, winner, "resignation");
      }
    }

    room.timer.stop();
    this.rooms.delete(roomId);
  }

  getRoomBySocketId(socketId: string): GameRoom | undefined {
    for (const room of this.rooms.values()) {
      if (room.whitePlayer === socketId || room.blackPlayer === socketId) return room;
    }
    return undefined;
  }
}
