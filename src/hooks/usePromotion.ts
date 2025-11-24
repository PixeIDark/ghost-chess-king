import { useState } from "react";
import { getPromotablePawn } from "../utils/legalityChecker.ts";
import type { Board, PieceType } from "../types/chess.ts";

export const usePromotion = () => {
  const [promotionSquare, setPromotionSquare] = useState<[number, number] | null>(null);

  const checkAndSetPromotion = (newBoard: Board, currentTurn: "white" | "black"): boolean => {
    const promotablePawn = getPromotablePawn(newBoard, currentTurn);

    if (promotablePawn) {
      setPromotionSquare(promotablePawn);
      return true;
    }

    return false;
  };

  const completePromotion = (promotionType: PieceType, board: Board): Board => {
    if (!promotionSquare) return board;

    const [row, col] = promotionSquare;
    const promotedBoard = structuredClone(board);

    if (promotedBoard[row][col]) promotedBoard[row][col]!.type = promotionType;

    setPromotionSquare(null);
    return promotedBoard;
  };

  const clearPromotion = (): void => {
    setPromotionSquare(null);
  };

  return {
    promotionSquare,
    checkAndSetPromotion,
    completePromotion,
    clearPromotion,
  };
};
