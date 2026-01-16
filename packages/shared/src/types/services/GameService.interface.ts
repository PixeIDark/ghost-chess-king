import { GameRoom } from "../room";
import { Position, PromotionPieceName, Side } from "../chess";
import { GameMode, GameState } from "../game";

export interface IGameService {
  updateSocketId(odId: string, socketId: string): void;
  removeSocketId(odId: string): void;
  createRoom(roomId: string, whitePlayerOdId: string, blackPlayerOdId: string, mode: GameMode): GameRoom;
  makeMove(roomId: string, odId: string, from: Position, to: Position): boolean;
  resign(roomId: string, odId: string): void;
  getValidMoves(roomId: string, odId: string, from: Position): Position[] | null;
  leaveRoom(roomId: string, odId: string): void;
  getRoomByOdId(odId: string): GameRoom | undefined;
  getRoomByRoomId(roomId: string): GameRoom | undefined;
  sendGameState(roomId: string, socketId: string): void;
  getGameStateForRestore(roomId: string, odId: string): { yourSide: Side; gameState: GameState } | null;
  executePromotion(roomId: string, odId: string, position: Position, piece: PromotionPieceName): void;
}
