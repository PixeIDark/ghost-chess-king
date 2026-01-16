import { ChessRuler } from "@/model/chessRuler";
import { getOppositeSide, IChessBoard, IPiece, Move, Position, Side } from "@ghost-chess-king/shared";

export class StandardRuler extends ChessRuler {
  public getValidMoves(board: IChessBoard, piece: IPiece, moveHistory: Move[]): Position[] {
    const potentialPaths = piece.getPotentialPaths(board.rows, board.cols);
    const validPositions: Position[] = [];

    potentialPaths.forEach((path) => {
      for (let i = 0; i < path.length; i++) {
        const pos = path[i];
        const targetPiece = board.getPiece(pos);

        if (targetPiece?.color === piece.color) break;

        if (piece.type === "pawn") {
          const isForward = pos.col === piece.position.col;
          const isDiagonal = pos.col !== piece.position.col;

          if (isForward && targetPiece !== null) break;
          if (isDiagonal && targetPiece === null) break;
        }

        if (!this.wouldExposeKing(board, piece.position, pos)) validPositions.push(pos);

        if (targetPiece) break;
      }
    });

    validPositions.push(...this.getCastlingMoves(board, piece));
    validPositions.push(...this.getEnPassantMoves(board, piece, moveHistory));

    return validPositions;
  }

  public getSpecialRule(board: IChessBoard, from: Position, to: Position, moveHistory: Move[]): string | null {
    const piece = board.getPiece(from);
    if (!piece) return null;

    if (piece.type === "king" || piece.type === "rook") {
      const castlingMoves = this.getCastlingMoves(board, piece);
      if (castlingMoves.some((m) => m.row === to.row && m.col === to.col)) {
        const isKingside = piece.type === "king" ? to.col > from.col : from.col === board.cols - 1;
        return isKingside ? "castling-kingside" : "castling-queenside";
      }
    }

    if (piece.type === "pawn") {
      const enPassantMoves = this.getEnPassantMoves(board, piece, moveHistory);
      if (enPassantMoves.some((m) => m.row === to.row && m.col === to.col)) return "en-passant";
    }

    return null;
  }

  private getCastlingMoves(board: IChessBoard, piece: IPiece): Position[] {
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
        if (piece.type === "king") result.push({ row, col: board.cols - 1 });
        else result.push({ row, col: kingPos.col });
      }
    }

    if (piece.type === "king" || (piece.type === "rook" && piece.position.col === 0)) {
      if (
        this.canCastling(board, piece.color, "queenside") &&
        this.isCastlingPathClear(board, king, { row, col: 0 }, enemyColor)
      ) {
        if (piece.type === "king") result.push({ row, col: 0 });
        else result.push({ row, col: kingPos.col });
      }
    }

    return result;
  }

  private canCastling(board: IChessBoard, color: Side, side: "kingside" | "queenside"): boolean {
    const kingPos = board.findKing(color);
    if (!kingPos) return false;

    const king = board.getPiece(kingPos);
    if (!king || king.hasMoved) return false;

    const row = kingPos.row;
    const rookCol = side === "kingside" ? board.cols - 1 : 0;
    const rook = board.getPiece({ row, col: rookCol });

    return rook !== null && rook.type === "rook" && rook.color === color && !rook.hasMoved;
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

  private getEnPassantMoves(board: IChessBoard, pawn: IPiece, moveHistory: Move[]): Position[] {
    const result: Position[] = [];
    if (pawn.type !== "pawn" || moveHistory.length === 0) return result;

    const lastMove = moveHistory.at(-1);
    if (!lastMove) return result;

    const target = this.getEnPassantTarget(lastMove);
    if (!target) return result;

    const movedPiece = board.getPiece(lastMove.to);
    if (!movedPiece || movedPiece.color === pawn.color) return result;

    if (pawn.position.row === lastMove.to.row && Math.abs(pawn.position.col - lastMove.to.col) === 1) {
      result.push(target);
    }

    return result;
  }

  private getEnPassantTarget(lastMove: Move): Position | null {
    if (lastMove.pieceType !== "pawn") return null;

    const rowDiff = Math.abs(lastMove.from.row - lastMove.to.row);
    if (rowDiff !== 2) return null;

    return {
      row: (lastMove.from.row + lastMove.to.row) / 2,
      col: lastMove.to.col,
    };
  }
}
