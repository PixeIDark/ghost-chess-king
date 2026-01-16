import {
  BoardDTO,
  BoardEntity,
  IChessBoard,
  IPiece,
  isSamePosition,
  PieceName,
  Position,
  PromotionPieceName,
  Side,
} from "@ghost-chess-king/shared";
import { PieceFactory } from "@/model/piece";

export abstract class ChessBoard implements IChessBoard {
  public abstract readonly rows: number;
  public abstract readonly cols: number;
  public abstract readonly boardEntity: BoardEntity;

  public abstract applySpecialRule(type: string, from: Position, to: Position): void;
  public abstract clone(): IChessBoard;

  public getPiece(position: Position): IPiece | null {
    return this.boardEntity[position.row][position.col];
  }

  public setPiece(position: Position, piece: IPiece | null) {
    this.boardEntity[position.row][position.col] = piece;
  }

  public movePiece(from: Position, to: Position) {
    const fromPiece = this.boardEntity[from.row][from.col]!;
    this.boardEntity[to.row][to.col] = fromPiece;
    this.boardEntity[from.row][from.col] = null;
    fromPiece.moveTo(to.row, to.col);
  }

  public removePiece(position: Position): IPiece | null {
    const piece = this.boardEntity[position.row][position.col];
    this.boardEntity[position.row][position.col] = null;
    return piece;
  }

  public findKing(color: Side): Position | undefined {
    const king = this.boardEntity.flat().find((piece) => piece?.color === color && piece.type === "king");
    return king?.position;
  }

  public getAllPieces(color: Side): IPiece[] {
    return this.boardEntity.flat().filter((piece): piece is IPiece => piece?.color === color);
  }

  public getAttackedPositions(color: Side): Position[] {
    const pieces = this.getAllPieces(color);
    const attacked: Position[] = [];

    pieces.forEach((piece) => {
      const attackPaths = piece.getAttackPaths(this.rows, this.cols);
      attackPaths.forEach((path) => {
        for (const pos of path) {
          attacked.push(pos);
          if (this.getPiece(pos)) break;
        }
      });
    });

    return attacked;
  }

  public isPositionUnderAttack(position: Position, byColor: Side): boolean {
    const attackedPositions = this.getAttackedPositions(byColor);
    return attackedPositions.some((pos) => isSamePosition(pos, position));
  }

  public toDto(): BoardDTO {
    return this.boardEntity.map((row) => row.map((piece) => (piece ? piece.toDto() : null)));
  }

  public clear() {
    this.boardEntity.forEach((row) => row.fill(null));
  }

  public toBoardString(): string {
    const rows: string[] = [];

    for (let row = 0; row < this.rows; row++) {
      let rowString = "";
      let emptyCount = 0;

      for (let col = 0; col < this.cols; col++) {
        const piece = this.boardEntity[row][col];

        if (piece === null) {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            rowString += emptyCount;
            emptyCount = 0;
          }
          rowString += this.pieceToFenChar(piece);
        }
      }

      if (emptyCount > 0) {
        rowString += emptyCount;
      }

      rows.push(rowString);
    }

    return rows.join("/");
  }

  public promotePiece(position: Position, pieceType: PromotionPieceName): void {
    const pawn = this.getPiece(position);
    if (!pawn || pawn.type !== "pawn") return;

    const promoted = PieceFactory.createPromotion(pawn, pieceType);
    this.setPiece(position, promoted);
  }

  private pieceToFenChar(piece: IPiece): string {
    const charMap: Record<PieceName, string> = {
      king: "k",
      queen: "q",
      rook: "r",
      bishop: "b",
      knight: "n",
      pawn: "p",
    };

    const char = charMap[piece.type];
    return piece.color === "white" ? char.toUpperCase() : char;
  }
}
