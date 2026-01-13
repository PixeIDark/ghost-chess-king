import { BoardDTO, BoardEntity, Position, Side } from "../chess";
import { IPiece } from "./Piece.interface";

export interface IChessBoard {
  readonly boardEntity: BoardEntity;
  readonly rows: number;
  readonly cols: number;
  getPiece(position: Position): IPiece | null;
  setPiece(position: Position, piece: IPiece | null): void;
  movePiece(from: Position, to: Position): void;
  removePiece(position: Position): IPiece | null;
  clone(): IChessBoard;
  findKing(color: Side): Position | undefined;
  getAllPieces(color: Side): IPiece[];
  toDto(): BoardDTO;
  clear(): void;
}
