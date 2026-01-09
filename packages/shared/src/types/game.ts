import { Side, Square } from "./chess";
import { IChess, IChessTimer } from "./interface";

export type GameMode = "ai" | "pvp";
export type GameStatus = "waiting" | "playing" | "finished";

export interface GameRoom {
  roomId: string;
  mode: GameMode;
  chess: IChess;
  timer: IChessTimer;
  whitePlayer: string;
  blackPlayer: string;
  status: GameStatus;
  winner?: Side | "draw";
  winReason?: "checkmate" | "timeout" | "stalemate" | "resignation";
}

export interface TimeState {
  whiteTime: number;
  blackTime: number;
}

export interface GameState {
  board: ReturnType<IChess["board"]>;
  fen: string;
  turn: Side;
  timeState: TimeState;
  status: ReturnType<IChess["status"]>;
  lastMove?: { from: Square; to: Square };
}
