import { UserInfo } from "./lobby";
import { GameMode, GameState, MatchResultType } from "./game";
import { Side, Position, PromotionPieceName } from "./chess";

export interface ServerToClientEvents {
  registered: (data: RegisteredData) => void;
  nicknameReceived: (nickname: string) => void;
  userConnected: (data: { nickname: string; totalUsers: number }) => void;
  userDisconnected: (data: { totalUsers: number }) => void;
  userList: (users: UserInfo[]) => void;
  lobbyMessage: (data: { nickname: string; message: string; timestamp: number; odId: string }) => void;

  "game-start": (data: GameStartData) => void;
  "game-state": (state: GameState) => void;
  "game-restored": (data: GameRestoredData) => void;
  "valid-moves": (data: ValidMovesData) => void;
  "invalid-move": (data: InvalidMoveData) => void;
  "time-update": (data: TimeUpdateData) => void;
  "game-over": (data: GameOverData) => void;
  "game-not-found": () => void;
  "promotion-required": (data: PromotionRequiredData) => void;

  error: (data: GameErrorData) => void;
}

export interface ClientToServerEvents {
  register: (data: RegisterData) => void;
  lobbyMessage: (message: string) => void;

  "challenge-player": (targetOdId: string) => void;
  "start-ai-game": () => void;
  "rejoin-game": (data: RejoinGameData) => void;
  "reconnect-game": () => void;

  "get-valid-moves": (data: GetValidMovesData) => void;
  "select-promotion": (data: SelectPromotionData) => void;
  move: (data: MoveData) => void;
  resign: (data: ResignData) => void;
  "leave-game": (data: LeaveGameData) => void;
}

export interface RegisterData {
  odId: string;
}

export interface RegisteredData {
  odId: string;
  nickname: string;
  currentRoomId: string | null;
}

export interface GameStartData {
  roomId: string;
  mode: GameMode;
  whitePlayer?: string;
  blackPlayer?: string;
  yourSide: Side;
}

export interface GameRestoredData {
  roomId: string;
  yourSide: Side;
  gameState: GameState;
}

export interface ValidMovesData {
  from: Position;
  moves: Position[] | null;
}

export interface InvalidMoveData {
  from: Position;
  to: Position;
}

export interface TimeUpdateData {
  whiteTime: number;
  blackTime: number;
}

export interface GameOverData {
  winner: Side | "draw";
  reason: MatchResultType;
}

export interface PromotionRequiredData {
  position: Position;
  color: Side;
  options: PromotionPieceName[];
}

export interface GameErrorData {
  message: string;
  roomId?: string;
}

export interface GetValidMovesData {
  roomId: string;
  from: Position;
}

export interface SelectPromotionData {
  roomId: string;
  position: Position;
  piece: PromotionPieceName;
}

export interface MoveData {
  roomId: string;
  from: Position;
  to: Position;
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
