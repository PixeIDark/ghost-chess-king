import { Chess } from "../model/chess";
import { ChessTimer } from "../model/chessTimer";
import { Side, Square } from "./chess.ts";

export type GameMode = "ai" | "pvp";
export type GameStatus = "waiting" | "playing" | "finished";

export interface GameRoom {
  roomId: string;
  mode: GameMode;
  chess: Chess;
  timer: ChessTimer;
  whitePlayer: string;
  blackPlayer: string | "AI";
  playerSides: Map<string, Side>;
  status: GameStatus;
  winner?: Side | "draw";
  winReason?: "checkmate" | "timeout" | "stalemate" | "resignation";
}

export interface TimeState {
  whiteTime: number;
  blackTime: number;
}

export interface GameState {
  board: ReturnType<Chess["board"]>;
  turn: Side;
  timeState: TimeState;
  status: ReturnType<Chess["status"]>;
  lastMove?: { from: Square; to: Square };
}
