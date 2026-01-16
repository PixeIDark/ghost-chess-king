import { GameState, MatchResultType, GameResult } from "../game";
import { Move, Position, PromotionPieceName, Side } from "../chess";
import { IChessBoard } from "./ChessBoard.inteface";
import { IChessRuler } from "./ChessRuler.interface";
import { IChessTimer } from "./ChessTimer.interface";

export interface MoveResult {
  success: boolean;
  specialRule: string | null;
  needsPromotion: boolean;
  promotionOptions?: PromotionPieceName[];
  position?: Position;
  move?: Move;
}

export interface IChess {
  readonly board: IChessBoard;
  readonly ruler: IChessRuler;
  readonly timer: IChessTimer;
  readonly currentTurn: Side;
  readonly moveHistory: readonly Move[];
  readonly matchResult: MatchResultType;
  startGame(): void;
  resetGame(): void;
  executeMove(from: Position, to: Position, promoteTo?: PromotionPieceName): MoveResult;
  undoMove(): boolean;
  resign(color: Side): GameResult;
  acceptDraw(): GameResult;
  timeout(loser: Side): GameResult;
  getGameState(): GameState;
  getGameResult(): GameResult | null;
  getValidMoves(position: Position): Position[];
  isGameOver(): boolean;
  getFen(): string;
  executePromotion(position: Position, piece: PromotionPieceName): void;
}
