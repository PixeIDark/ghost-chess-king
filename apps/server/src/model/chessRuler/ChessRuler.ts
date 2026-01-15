import {
  BoardEntity,
  IChessBoard,
  IChessRuler,
  IPiece,
  Move,
  Position,
  PromotionPieceName,
  Side,
} from "@ghost-chess-king/shared";

export abstract class ChessRuler implements IChessRuler {
  public abstract createBoard(): BoardEntity;
  public abstract getValidMoves(board: IChessBoard, piece: IPiece, lastMove?: Move): Position[];
  public abstract canCastling(board: IChessBoard, color: Side, side: "kingside" | "queenside"): boolean;
  public abstract getEnPassantTarget(lastMove?: Move): Position | null;
  public abstract getCastlingMoves(board: IChessBoard, king: IPiece): Position[];
  public abstract getEnPassantMoves(board: IChessBoard, pawn: IPiece, lastMove?: Move): Position[];
  public abstract isCheckmate(board: IChessBoard, color: Side): boolean;
  public abstract isStalemate(board: IChessBoard, color: Side): boolean;
  public abstract needsPromotion(board: IChessBoard, position: Position): boolean;
  public abstract getPromotionOptions(): PromotionPieceName[];
  public abstract executePromotion(board: IChessBoard, position: Position, promoteTo: PromotionPieceName): IPiece;

  public wouldExposeKing(board: IChessBoard, from: Position, to: Position): boolean {
    const piece = board.getPiece(from);
    if (!piece) return false;

    const clonedBoard = board.clone();
    clonedBoard.movePiece(from, to);
    return this.isInCheck(clonedBoard, piece.color);
  }

  public isInCheck(board: IChessBoard, color: Side): boolean {
    const kingPosition = board.findKing(color);
    if (!kingPosition) return false;

    const opponentColor: Side = color === "white" ? "black" : "white";
    return board.isPositionUnderAttack(kingPosition, opponentColor);
  }

  protected isPinned(board: IChessBoard, piece: IPiece): boolean {
    const clonedBoard = board.clone();
    const originalPosition = piece.position;
    clonedBoard.removePiece(originalPosition);
    return this.isInCheck(clonedBoard, piece.color);
  }

  protected hasAnyLegalMove(board: IChessBoard, color: Side): boolean {
    const pieces = board.getAllPieces(color);

    for (const piece of pieces) {
      const validMoves = this.getValidMoves(board, piece);
      if (validMoves.length > 0) return true;
    }

    return false;
  }
}
