import { IPiece, PieceName, Position, Side, PromotionPieceName } from "@ghost-chess-king/shared";
import { King, Queen, Rook, Bishop, Knight, Pawn } from "@/model/piece";

export class PieceFactory {
  private static nextId = 1;

  static create(type: PieceName, color: Side, position: Position, hasMoved = false): IPiece {
    const id = this.nextId++;

    const PieceClass = {
      king: King,
      queen: Queen,
      rook: Rook,
      bishop: Bishop,
      knight: Knight,
      pawn: Pawn,
    }[type];

    return new PieceClass(id, color, position, hasMoved);
  }

  static createPromotion(pawn: IPiece, type: PromotionPieceName): IPiece {
    const PieceClass = {
      queen: Queen,
      rook: Rook,
      bishop: Bishop,
      knight: Knight,
    }[type];

    return new PieceClass(pawn.id, pawn.color, pawn.position, true);
  }
}
