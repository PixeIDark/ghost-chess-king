import { useEffect } from "react";
import { useStockfish } from "@/hooks/useStockfish";
import { PromotionPieceName, squareToIndices } from "@ghost-chess-king/shared";
import type { Position } from "@ghost-chess-king/shared";

interface UseAiParams {
  fen: string;
  currentTurn: "white" | "black";
  aiSide: "white" | "black";
  depth: number;
  onAiMove: (from: Position, to: Position, promotionType?: PromotionPieceName | null) => void;
}

const promotionTypes = {
  q: "queen",
  r: "rook",
  b: "bishop",
  k: "knight",
} as const satisfies Record<string, PromotionPieceName>;

export const useAi = ({ fen, currentTurn, aiSide, depth = 15, onAiMove }: UseAiParams) => {
  const { isReady, getBestMove } = useStockfish();

  useEffect(() => {
    if (!isReady || currentTurn !== aiSide || !fen) return;

    let cancelled = false;

    (async () => {
      try {
        const bestMove = await getBestMove(fen, depth);
        console.log("bestMove", bestMove);
        if (bestMove === "(none)") return;

        const from = squareToIndices(bestMove.slice(0, 2));
        const to = squareToIndices(bestMove.slice(2, 4));
        const promotionChar = bestMove[4];
        let promotionType = null;

        if (promotionChar in promotionTypes) promotionType = promotionChar;

        if (!cancelled) onAiMove(from, to, promotionType);
      } catch (err) {
        console.error("AI move error:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fen, currentTurn, aiSide, isReady, depth]);
};
