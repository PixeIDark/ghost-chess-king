import { IPiece, Position, Side, IChessBoard, BoardEntity, Move } from "../";

export interface IChessRuler {
  createBoard(): BoardEntity;
  getCastlingMoves(board: IChessBoard, king: IPiece): Position[];
  getEnPassantMoves(board: IChessBoard, pawn: IPiece, lastMove?: Move): Position[];
  isCheckmate(board: IChessBoard, color: Side): boolean;
  isStalemate(board: IChessBoard, color: Side): boolean;
  getValidMoves(board: IChessBoard, piece: IPiece): Position[];
  wouldExposeKing(board: IChessBoard, from: Position, to: Position): boolean;
  isInCheck(board: IChessBoard, color: Side): boolean;
}
