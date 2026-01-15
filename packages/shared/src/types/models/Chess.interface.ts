import { GameState, MatchResultType } from "../game";
import { Move, PieceName, Position, PromotionPieceName, Side } from "../chess";
import { IChessBoard } from "./ChessBoard.inteface";
import { IChessRuler } from "./ChessRuler.interface";
import { IChessTimer } from "./ChessTimer.interface";
import { EventManager } from "../../utils/EventManager";

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
    options: PromotionPieceName[];
  };
  timeUpdate: { whiteTime: number; blackTime: number };
  timeout: { loser: Side };
};

export interface IChess {
  readonly eventManager: EventManager<ChessEventMap>;
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
}
