import { IChessTimer, Side, TimerEventKey, TimerEventMap } from "@ghost-chess-king/shared";

export class ChessTimer implements IChessTimer {
  private whiteTime: number;
  private blackTime: number;
  private currentTurn: Side;
  private lastUpdateTime: number;
  private timerInterval?: NodeJS.Timeout;
  private listeners: Map<TimerEventKey, Set<unknown>>;

  constructor(
    private readonly incrementTime: number,
    initialTime: number
  ) {
    this.whiteTime = initialTime;
    this.blackTime = initialTime;
    this.currentTurn = "white";
    this.lastUpdateTime = Date.now();
    this.listeners = new Map();
  }

  on<K extends TimerEventKey>(event: K, listener: (data: TimerEventMap[K]) => void): void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(listener);
  }

  off<K extends TimerEventKey>(event: K, listener: (data: TimerEventMap[K]) => void): void {
    this.listeners.get(event)?.delete(listener);
  }

  private emit<K extends TimerEventKey>(event: K, data: TimerEventMap[K]): void {
    this.listeners.get(event)?.forEach((listener) => (listener as (data: TimerEventMap[K]) => void)(data));
  }

  start(startTurn: Side): void {
    this.currentTurn = startTurn;
    this.lastUpdateTime = Date.now();
    this.timerInterval = setInterval(() => this.tick(), 100);
  }

  private tick(): void {
    const now = Date.now();
    const elapsed = now - this.lastUpdateTime;

    if (this.currentTurn === "white") this.whiteTime -= elapsed;
    else this.blackTime -= elapsed;

    this.lastUpdateTime = now;

    if (this.whiteTime <= 0) {
      this.stop();
      this.emit("timeout", { loser: "white" });
      return;
    }

    if (this.blackTime <= 0) {
      this.stop();
      this.emit("timeout", { loser: "black" });
      return;
    }

    this.emit("timeUpdate", {
      whiteTime: Math.max(0, this.whiteTime),
      blackTime: Math.max(0, this.blackTime),
    });
  }

  private addIncrementTime(): void {
    if (this.currentTurn === "white") this.whiteTime += this.incrementTime;
    else this.blackTime += this.incrementTime;
  }

  switchTurn(nextTurn: Side): void {
    this.addIncrementTime();
    this.currentTurn = nextTurn;
    this.lastUpdateTime = Date.now();
  }

  stop(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = undefined;
    }
  }

  getTime(): { whiteTime: number; blackTime: number } {
    return {
      whiteTime: Math.max(0, this.whiteTime),
      blackTime: Math.max(0, this.blackTime),
    };
  }
}
