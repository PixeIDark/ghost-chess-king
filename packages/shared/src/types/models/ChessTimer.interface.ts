import { Side } from "../chess";

export type TimerEventMap = {
  timeUpdate: { whiteTime: number; blackTime: number };
  timeout: { loser: Side };
};

export type TimerEventKey = keyof TimerEventMap;

export interface IChessTimer {
  on<K extends TimerEventKey>(event: K, listener: (data: TimerEventMap[K]) => void): void;
  off<K extends TimerEventKey>(event: K, listener: (data: TimerEventMap[K]) => void): void;
  start(startTurn: Side): void;
  stop(): void;
  switchTurn(nextTurn: Side): void;
  getTime(): { whiteTime: number; blackTime: number };
}
