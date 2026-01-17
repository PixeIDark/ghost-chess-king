import { ChessTimer } from "@/model/chessTimer";
import { AppServer } from "@/types/socket";
import { GameMode, GameRoom, Side, Position, GameResult, PromotionPieceName } from "@ghost-chess-king/shared";
import { StandardRuler } from "@/model/chessRuler";
import { StandardBoard } from "@/model/chessBoard";
import { Chess } from "@/model/chess";
import { IGameService } from "@ghost-chess-king/shared/src/types/services/GameService.interface";

const STANDARD_INITIAL_TIME = 60 * 1000;
const STANDARD_INCREMENT_TIME = 1000;

export class GameService implements IGameService {
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
    const timer = new ChessTimer(STANDARD_INITIAL_TIME, STANDARD_INCREMENT_TIME);
    const board = new StandardBoard();
    const chess = new Chess(ruler, timer, board);

    timer.on("timeUpdate", (data) => {
      this.io.to(roomId).emit("time-update", data);
    });

    timer.on("timeout", (data) => {
      const room = this.rooms.get(roomId);
      if (!room) return;

      const result = chess.timeout(data.loser);
      this.handleGameOver(roomId, room, result);
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
    this.io.to(roomId).emit("game-state", chess.getGameState());

    return room;
  }

  makeMove(roomId: string, odId: string, from: Position, to: Position): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    const playerSide = this.getPlayerSide(room, odId);
    if (room.mode === "pvp" && playerSide !== room.chess.currentTurn) return false;

    const movingSide = room.chess.currentTurn;
    const result = room.chess.executeMove(from, to);

    if (result.needsPromotion && result.position && result.promotionOptions) {
      const promotingOdId = movingSide === "white" ? room.whitePlayer : room.blackPlayer;
      const socketId = this.odIdToSocketId.get(promotingOdId);

      if (socketId) {
        this.io.to(roomId).emit("game-state", room.chess.getGameState());
        this.io.to(socketId).emit("promotion-required", {
          position: result.position,
          color: movingSide,
          options: result.promotionOptions,
        });
      }
      return false;
    }

    if (!result.success) return false;

    this.io.to(roomId).emit("game-state", room.chess.getGameState());

    const gameResult = room.chess.getGameResult();
    if (gameResult) this.handleGameOver(roomId, room, gameResult);

    return true;
  }

  private handleGameOver(roomId: string, room: GameRoom, result: GameResult): void {
    room.status = "FINISHED";
    room.winner = result.winner === "DRAW" ? "draw" : (result.winner ?? "draw");
    room.winReason = result.status;

    this.io.to(roomId).emit("game-over", {
      winner: room.winner,
      reason: room.winReason,
    });

    this.rooms.delete(roomId);
  }

  resign(roomId: string, odId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const playerSide = this.getPlayerSide(room, odId);
    if (!playerSide) return;

    const result = room.chess.resign(playerSide);
    this.handleGameOver(roomId, room, result);
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
      if (playerSide) {
        const result = room.chess.resign(playerSide);
        this.handleGameOver(roomId, room, result);
      }
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

  executePromotion(roomId: string, odId: string, position: Position, piece: PromotionPieceName): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const playerSide = this.getPlayerSide(room, odId);
    if (!playerSide) return;

    room.chess.executePromotion(position, piece);
    this.io.to(roomId).emit("game-state", room.chess.getGameState());

    const gameResult = room.chess.getGameResult();
    if (gameResult) this.handleGameOver(roomId, room, gameResult);
  }
}
