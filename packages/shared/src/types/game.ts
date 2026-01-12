import { Side, Square } from "./chess";
import { IChess } from "./models";

export type GameMode = "ai" | "pvp";
export type RoomStatus = "WAITING" | "PLAYING" | "FINISHED";

export type MatchResultType =
  | "PLAYING"
  | "CHECK"
  | "CHECKMATE"
  | "STALEMATE"
  | "INSUFFICIENT_MATERIAL"
  | "THREEFOLD_REPETITION"
  | "RESIGNATION"
  | "TIMEOUT"
  | "DRAW_AGREEMENT";

export interface GameResult {
  status: MatchResultType;
  winner: Side | "DRAW" | null;
  reason?: string;
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
