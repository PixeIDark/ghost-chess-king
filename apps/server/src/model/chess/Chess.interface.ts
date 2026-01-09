import { Board, GameEndReason, Side, Square } from "@ghost-chess-king/shared";

export type GamePhase = GameEndReason | "check" | "normal";

export interface MatchStatus {
  state: GamePhase;
  target: Side | null;
  winner: Side | "draw" | null;
}

export interface IChess {
  move(from: Square, to: Square): IChess;
  getFen(): string;
  board(): Board;
  turn(): Side;
  validMove(from: Square): Square[];
  status(): MatchStatus;
}
