import { Side } from "../../types/chess.ts";
import { INCREMENT_TIME, INITIAL_TIME } from "./chessTimer.constants.ts";

export class ChessTimer {
  private whiteTime: number;
  private blackTime: number;
  private lastUpdateTime: number;
  private timerInterval?: NodeJS.Timeout;
  private onTimeUpdate: (whiteTime: number, blackTime: number) => void;
  private onTimeout: (loser: Side) => void;

  constructor(onTimeUpdate: (whiteTime: number, blackTime: number) => void, onTimeout: (loser: Side) => void) {
    this.whiteTime = INITIAL_TIME;
    this.blackTime = INITIAL_TIME;
    this.lastUpdateTime = Date.now();
    this.onTimeUpdate = onTimeUpdate;
    this.onTimeout = onTimeout;
  }

  start(currentTurn: Side) {
    this.lastUpdateTime = Date.now();
    this.timerInterval = setInterval(() => {
      this.tick(currentTurn);
    }, 100);
  }

  private tick(currentTurn: Side) {
    const now = Date.now();
    const elapsed = now - this.lastUpdateTime;

    if (currentTurn === "white") this.whiteTime -= elapsed;
    else this.blackTime -= elapsed;

    this.lastUpdateTime = now;

    if (this.whiteTime <= 0) {
      this.stop();
      this.onTimeout("white");
      return;
    }
    if (this.blackTime <= 0) {
      this.stop();
      this.onTimeout("black");
      return;
    }

    this.onTimeUpdate(Math.max(0, this.whiteTime), Math.max(0, this.blackTime));
  }

  switchTurn(currentTurn: Side) {
    if (currentTurn === "white") this.blackTime += INCREMENT_TIME;
    else this.whiteTime += INCREMENT_TIME;

    this.lastUpdateTime = Date.now();
  }

  stop() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
  }

  getTime() {
    return {
      whiteTime: Math.max(0, this.whiteTime),
      blackTime: Math.max(0, this.blackTime),
    };
  }
}
