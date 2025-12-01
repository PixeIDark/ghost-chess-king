import { Side, Square } from "./chess.ts";
import { GameMode, GameState } from "./game.ts";
import { UserInfo } from "./lobby.ts";

export interface ServerToClientEvents {
  nicknameReceived: (nickname: string) => void;
  userConnected: (data: { nickname: string; totalUsers: number }) => void;
  userDisconnected: (data: { totalUsers: number }) => void;
  userList: (users: UserInfo[]) => void;
  lobbyMessage: (data: { nickname: string; message: string; timestamp: number; socketId: string }) => void;

  "game-start": (data: GameStartData) => void;
  "game-state": (state: GameState) => void;
  "valid-moves": (data: ValidMovesData) => void;
  "invalid-move": (data: InvalidMoveData) => void;
  "time-update": (data: TimeUpdateData) => void;
  "game-over": (data: GameOverData) => void;
  "game-not-found": () => void; // ✅ 추가

  error: (data: ErrorData) => void;
}

export interface ClientToServerEvents {
  lobbyMessage: (message: string) => void;

  "challenge-player": (targetSocketId: string) => void;
  "start-ai-game": () => void;
  "rejoin-game": (data: RejoinGameData) => void;

  "get-valid-moves": (data: GetValidMovesData) => void;
  move: (data: MoveData) => void;
  resign: (data: ResignData) => void;
  "leave-game": (data: LeaveGameData) => void;
}

export interface GameStartData {
  roomId: string;
  mode: GameMode;
  whitePlayer?: string;
  blackPlayer?: string;
  yourSide: Side;
}

export interface ValidMovesData {
  from: Square;
  moves: Square[] | null;
}

export interface InvalidMoveData {
  from: Square;
  to: Square;
}

export interface TimeUpdateData {
  whiteTime: number;
  blackTime: number;
}

export interface GameOverData {
  winner: Side | "draw";
  reason: string;
}

export interface ErrorData {
  message: string;
}

export interface GetValidMovesData {
  roomId: string;
  from: Square;
}

export interface MoveData {
  roomId: string;
  from: Square;
  to: Square;
}

export interface ResignData {
  roomId: string;
}

export interface LeaveGameData {
  roomId: string;
}

export interface RejoinGameData {
  roomId: string;
}
