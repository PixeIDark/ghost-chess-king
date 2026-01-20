import { IPiece, Position, Side, IChessBoard, PromotionPieceName, Move } from "../";

export interface IChessRuler {
  getSpecialRule(board: IChessBoard, from: Position, to: Position, moveHistory: Move[]): string | null;
  getValidMoves(board: IChessBoard, piece: IPiece, moveHistory: Move[]): Position[];
  needsPromotion(board: IChessBoard, position: Position): boolean;
  getPromotionOptions(): PromotionPieceName[];
  isCheckmate(board: IChessBoard, color: Side, moveHistory: Move[]): boolean;
  isStalemate(board: IChessBoard, color: Side, moveHistory: Move[]): boolean;
  wouldExposeKing(board: IChessBoard, from: Position, to: Position): boolean;
  isInCheck(board: IChessBoard, color: Side): boolean;
}
