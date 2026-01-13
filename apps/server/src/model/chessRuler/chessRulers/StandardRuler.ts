import { ChessRuler } from "@/model/chessRuler";
import { BoardEntity, getOppositeSide, IChessBoard, IPiece, Move, Position, Side } from "@ghost-chess-king/shared";
import { Bishop, King, Knight, Pawn, Queen, Rook } from "@/model/piece";

export class StandardRuler extends ChessRuler {
  public createBoard(): BoardEntity {
    const pieces = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];

    return [
      pieces.map((P, i) => new P(200 + i, "black", { row: 0, col: i })),
      [...Array(8)].map((_, i) => new Pawn(208 + i, "black", { row: 1, col: i })),
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),
      [...Array(8)].map((_, i) => new Pawn(208 + i, "white", { row: 1, col: i })),
      pieces.map((P, i) => new P(108 + i, "white", { row: 7, col: i })),
    ];
  }

  public getCastlingMoves(board: IChessBoard, piece: IPiece): Position[] {
    const result: Position[] = [];

    if (!piece || piece.hasMoved) return result;

    const kingPos = board.findKing(piece.color);
    if (!kingPos) return result;

    const king = board.getPiece(kingPos);
    if (!king || king.hasMoved) return result;

    const enemyColor: Side = getOppositeSide(piece.color);

    if (board.isPositionUnderAttack(kingPos, enemyColor)) return result;

    const row = kingPos.row;

    if (piece.type === "king" || (piece.type === "rook" && piece.position.col === 7)) {
      const kingsideRook = board.getPiece({ row, col: 7 });
      if (
        kingsideRook?.type === "rook" &&
        kingsideRook.color === piece.color &&
        !kingsideRook.hasMoved &&
        this.isCastlingPathClear(board, king, { row, col: 7 }, enemyColor)
      ) {
        if (piece.type === "king") result.push({ row, col: kingPos.col + 2 });
        else result.push({ row, col: kingPos.col + 1 });
      }
    }

    if (piece.type === "king" || (piece.type === "rook" && piece.position.col === 0)) {
      const queensideRook = board.getPiece({ row, col: 0 });
      if (
        queensideRook?.type === "rook" &&
        queensideRook.color === piece.color &&
        !queensideRook.hasMoved &&
        this.isCastlingPathClear(board, king, { row, col: 0 }, enemyColor)
      ) {
        if (piece.type === "king") result.push({ row, col: kingPos.col - 2 });
        else result.push({ row, col: kingPos.col - 1 });
      }
    }

    return result;
  }

  private isCastlingPathClear(board: IChessBoard, king: IPiece, rookPos: Position, enemyColor: Side): boolean {
    const kingPos = king.position;
    const row = kingPos.row;
    const direction = rookPos.col > kingPos.col ? 1 : -1;

    let col = kingPos.col + direction;
    const endCol = rookPos.col;

    while (col !== endCol) {
      if (board.getPiece({ row, col }) !== null) return false;

      if (Math.abs(col - kingPos.col) <= 2) {
        if (board.isPositionUnderAttack({ row, col }, enemyColor)) return false;
      }

      col += direction;
    }

    return true;
  }

  public getEnPassantMoves(board: IChessBoard, pawn: IPiece, lastMove?: Move): Position[] {
    const result: Position[] = [];

    if (pawn.type !== "pawn" || !lastMove) return result;

    const movedPiece = board.getPiece(lastMove.to);

    if (
      !movedPiece ||
      movedPiece.type !== "pawn" ||
      movedPiece.color === pawn.color ||
      Math.abs(lastMove.from.row - lastMove.to.row) !== 2
    ) {
      return result;
    }

    if (pawn.position.row === lastMove.to.row && Math.abs(pawn.position.col - lastMove.to.col) === 1) {
      const direction = pawn.color === "white" ? -1 : 1;
      result.push({
        row: pawn.position.row + direction,
        col: lastMove.to.col,
      });
    }

    return result;
  }

  public isCheckmate(board: IChessBoard, color: Side): boolean {
    if (!this.isInCheck(board, color)) return false;
    return !this.hasAnyLegalMove(board, color);
  }

  public isStalemate(board: IChessBoard, color: Side): boolean {
    if (this.isInCheck(board, color)) return false;
    return !this.hasAnyLegalMove(board, color);
  }
}
