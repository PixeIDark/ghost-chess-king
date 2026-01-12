import { IPiece, Position, Side, Move, MatchResultType, BoardEntity } from "../";

export interface IChessRuler {
  isSquareAttacked(pos: Position, board: BoardEntity, attackerColor: Side): boolean;
  getAllAttackedSquares(board: BoardEntity, attackerColor: Side): Position[];
  filterObstacles(piece: IPiece, board: BoardEntity): Position[];
  findKing(board: BoardEntity, color: Side): Position | undefined;
  canEnPassant(piece: IPiece, targetPos: Position, board: BoardEntity, lastMove: Move | null): boolean;
  canCastle(board: BoardEntity, color: Side, side: "KING" | "QUEEN"): boolean;
  isValidMove(piece: IPiece, targetPos: Position, board: BoardEntity, lastMove: Move | null): boolean;
  isCheck(board: BoardEntity, color: Side): boolean;
  isCheckmate(board: BoardEntity, color: Side, lastMove: Move | null): boolean;
  isStalemate(board: BoardEntity, color: Side, lastMove: Move | null): boolean;
  getGameStatus(board: BoardEntity, turn: Side, lastMove: Move | null): MatchResultType;
}
