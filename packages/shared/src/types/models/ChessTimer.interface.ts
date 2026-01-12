import { Side } from "../chess";

export interface IChessTimer {
  start(startTurn: Side): void;
  switchTurn(nextTurn: Side): void;
  stop(): void;
  getTime(): { whiteTime: number; blackTime: number };
}
