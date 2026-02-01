import { BoardDTO, Move, Position, Side } from "./chess";
import { IPieceData } from "./models";

export type GameMode = "ai" | "pvp";

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

export interface GameState {
  readonly currentTurn: Side;
  readonly matchResult: MatchResultType;
  readonly checkPosition: Position | null;
  readonly board: BoardDTO;
  readonly moveHistory: readonly Move[];
  readonly capturedPieces: { white: IPieceData[]; black: IPieceData[] };
  readonly fen: string;
  readonly timeRemaining: { whiteTime: number; blackTime: number };
}

export interface GameResult {
  status: MatchResultType;
  winner: Side | "DRAW" | null;
  reason?: string;
}

export interface TimeState {
  whiteTime: number;
  blackTime: number;
}
