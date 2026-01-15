import { GameState, MatchResultType } from "../game";
import { Move, PieceName, Position, Side } from "../chess";
import { IChessBoard } from "./ChessBoard.inteface";
import { IChessRuler } from "./ChessRuler.interface";
import { IChessTimer } from "./ChessTimer.interface";

export type ChessEventMap = {
  gameStarted: { initialState: GameState };
  turnChanged: { currentTurn: Side; gameState: GameState };
  moveExecuted: { move: Move; gameState: GameState };
  check: { color: Side; gameState: GameState };
  gameOver: {
    result: MatchResultType;
    winner?: Side;
    gameState: GameState;
  };
  promotionRequired: {
    position: Position;
    color: Side;
    options: PieceName[];
  };
  timeUpdate: { whiteTime: number; blackTime: number };
  timeout: { loser: Side };
};

export type ChessEventKey = keyof ChessEventMap;

export interface IChess {
  readonly board: IChessBoard;
  readonly ruler: IChessRuler;
  readonly timer: IChessTimer;
  readonly currentTurn: Side;
  readonly moveHistory: readonly Move[];
  readonly matchResult: MatchResultType;
  startGame(): void;
  resetGame(): void;
  executeMove(from: Position, to: Position, promoteTo?: PieceName): boolean;
  undoMove(): boolean;
  resign(color: Side): void;
  acceptDraw(): void;
  getGameState(): GameState;
  getValidMoves(position: Position): Position[];
  isGameOver(): boolean;
  getFen(): string;
  on<K extends ChessEventKey>(event: K, listener: (data: ChessEventMap[K]) => void): void;
  off<K extends ChessEventKey>(event: K, listener: (data: ChessEventMap[K]) => void): void;
}
