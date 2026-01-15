import { IPiece, Position, Side, IChessBoard, BoardEntity, Move, PromotionPieceName } from "../";

export interface IChessRuler {
  createBoard(): BoardEntity;
  canCastling(board: IChessBoard, color: Side, side: "kingside" | "queenside"): boolean;
  getEnPassantTarget(lastMove?: Move): Position | null;
  getCastlingMoves(board: IChessBoard, king: IPiece): Position[];
  getEnPassantMoves(board: IChessBoard, pawn: IPiece, lastMove?: Move): Position[];
  needsPromotion(board: IChessBoard, position: Position): boolean;
  getPromotionOptions(): PromotionPieceName[];
  executePromotion(board: IChessBoard, position: Position, promoteTo: PromotionPieceName): IPiece;
  isCheckmate(board: IChessBoard, color: Side): boolean;
  isStalemate(board: IChessBoard, color: Side): boolean;
  getValidMoves(board: IChessBoard, piece: IPiece, lastMove?: Move): Position[];
  wouldExposeKing(board: IChessBoard, from: Position, to: Position): boolean;
  isInCheck(board: IChessBoard, color: Side): boolean;
}
