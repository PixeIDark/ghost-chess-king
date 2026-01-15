import { ChessRuler } from "@/model/chessRuler";
import {
  BoardEntity,
  getOppositeSide,
  IChessBoard,
  IPiece,
  Move,
  Position,
  PromotionPieceName,
  Side,
} from "@ghost-chess-king/shared";
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
      [...Array(8)].map((_, i) => new Pawn(108 + i, "white", { row: 6, col: i })),
      pieces.map((P, i) => new P(100 + i, "white", { row: 7, col: i })),
    ];
  }

  public canCastling(board: IChessBoard, color: Side, side: "kingside" | "queenside"): boolean {
    const kingPos = board.findKing(color);
    if (!kingPos) return false;

    const king = board.getPiece(kingPos);
    if (!king || king.hasMoved) return false;

    const row = kingPos.row;
    const rookCol = side === "kingside" ? board.cols - 1 : 0;
    const rook = board.getPiece({ row, col: rookCol });

    return rook !== null && rook.type === "rook" && rook.color === color && !rook.hasMoved;
  }

  public getEnPassantTarget(lastMove?: Move): Position | null {
    if (!lastMove) return null;

    if (lastMove.pieceType !== "pawn") return null;

    const rowDiff = Math.abs(lastMove.from.row - lastMove.to.row);
    if (rowDiff !== 2) return null;

    return {
      row: (lastMove.from.row + lastMove.to.row) / 2,
      col: lastMove.to.col,
    };
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

    if (piece.type === "king" || (piece.type === "rook" && piece.position.col === board.cols - 1)) {
      if (
        this.canCastling(board, piece.color, "kingside") &&
        this.isCastlingPathClear(board, king, { row, col: board.cols - 1 }, enemyColor)
      ) {
        if (piece.type === "king") result.push({ row, col: kingPos.col + 2 });
        else result.push({ row, col: kingPos.col + 1 });
      }
    }

    if (piece.type === "king" || (piece.type === "rook" && piece.position.col === 0)) {
      if (
        this.canCastling(board, piece.color, "queenside") &&
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

    const target = this.getEnPassantTarget(lastMove);
    if (!target) return result;

    const movedPiece = board.getPiece(lastMove.to);
    if (!movedPiece || movedPiece.color === pawn.color) return result;

    if (pawn.position.row === lastMove.to.row && Math.abs(pawn.position.col - lastMove.to.col) === 1) {
      result.push(target);
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

  public needsPromotion(board: IChessBoard, position: Position): boolean {
    const piece = board.getPiece(position);
    if (!piece || piece.type !== "pawn") return false;

    const promotionRow = piece.color === "white" ? 0 : board.rows - 1;
    return position.row === promotionRow;
  }

  public getPromotionOptions(): PromotionPieceName[] {
    return ["queen", "rook", "bishop", "knight"];
  }

  public executePromotion(board: IChessBoard, position: Position, promoteTo: PromotionPieceName): IPiece {
    const pawn = board.getPiece(position);
    if (!pawn) throw new Error("No piece at promotion position");

    if (pawn.type !== "pawn") throw new Error("Only pawns can be promoted");

    const pieceClassMap = {
      queen: Queen,
      rook: Rook,
      bishop: Bishop,
      knight: Knight,
    };

    const PieceClass = pieceClassMap[promoteTo];
    if (!PieceClass) throw new Error(`Invalid promotion piece: ${promoteTo}`);

    const promotedPiece = new PieceClass(pawn.id, pawn.color, { ...position }, true);
    board.setPiece(position, promotedPiece);

    return promotedPiece;
  }
}
