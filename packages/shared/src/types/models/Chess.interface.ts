import { BoardDTO, Side, Square } from "../chess";
import { MatchResultType } from "../game";

export type GamePhase = MatchResultType | "check" | "normal";

export interface MatchStatus {
  state: GamePhase;
  target: Side | null;
  winner: Side | "draw" | null;
}

export interface IChess {
  move(from: Square, to: Square): IChess;
  getFen(): string;
  board(): BoardDTO;
  turn(): Side;
  validMove(from: Square): Square[];
  status(): MatchStatus;
}
