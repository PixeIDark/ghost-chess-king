import type { Board, ChessStatus, Side, Square } from "./chess.ts";

export type GameMode = "ai" | "pvp";
export type GameStatus = "waiting" | "playing" | "finished";

export interface GameRoom {
  roomId: string;
  mode: GameMode;
  chess: object;
  timer: object;
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
  board: Board;
  fen: string;
  turn: Side;
  timeState: TimeState;
  status: ChessStatus;
  lastMove?: { from: Square; to: Square };
}
