import { BoardDTO, BoardEntity, Position, PromotionPieceName, Side } from "../chess";
import { IPiece } from "./Piece.interface";

export interface IChessBoard {
  readonly boardEntity: BoardEntity;
  readonly rows: number;
  readonly cols: number;
  getPiece(position: Position): IPiece | null;
  setPiece(position: Position, piece: IPiece | null): void;
  movePiece(from: Position, to: Position): void;
  removePiece(position: Position): IPiece | null;
  applySpecialRule(type: string, from: Position, to: Position): void;
  promotePiece(position: Position, pieceType: PromotionPieceName): void;
  clone(): IChessBoard;
  findKing(color: Side): Position | undefined;
  getAllPieces(color: Side): IPiece[];
  getAttackedPositions(color: Side): Position[];
  isPositionUnderAttack(position: Position, byColor: Side): boolean;
  toDto(): BoardDTO;
  clear(): void;
  toBoardString(): string;
}
