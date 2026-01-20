import { IChessBoard, IChessRuler, IPiece, Move, Position, PromotionPieceName, Side } from "@ghost-chess-king/shared";

export abstract class ChessRuler implements IChessRuler {
  public abstract getValidMoves(board: IChessBoard, piece: IPiece, moveHistory: Move[]): Position[];
  public abstract getSpecialRule(board: IChessBoard, from: Position, to: Position, moveHistory: Move[]): string | null;

  public isCheckmate(board: IChessBoard, color: Side, moveHistory: Move[]): boolean {
    if (!this.isInCheck(board, color)) return false;
    return !this.hasAnyLegalMove(board, color, moveHistory);
  }

  public isStalemate(board: IChessBoard, color: Side, moveHistory: Move[]): boolean {
    if (this.isInCheck(board, color)) return false;
    return !this.hasAnyLegalMove(board, color, moveHistory);
  }

  public needsPromotion(board: IChessBoard, position: Position): boolean {
    const piece = board.getPiece(position);
    if (!piece || piece.type !== "pawn") return false;

    const promotionRow = piece.color === "white" ? 0 : board.rows - 1;
    return position.row === promotionRow;
  }

  public getPromotionOptions(): PromotionPieceName[] {
    return ["queen", "rook", "bishop", "knight"];
  }

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

  protected hasAnyLegalMove(board: IChessBoard, color: Side, moveHistory: Move[]): boolean {
    const pieces = board.getAllPieces(color);

    for (const piece of pieces) {
      const validMoves = this.getValidMoves(board, piece, moveHistory);
      if (validMoves.length > 0) return true;
    }

    return false;
  }
}
