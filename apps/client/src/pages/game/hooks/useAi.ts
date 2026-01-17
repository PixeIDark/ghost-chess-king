import { Position, PromotionPieceName, squareToIndices } from "@ghost-chess-king/shared";
import { useStockfish } from "@/hooks/useStockfish.ts";
import { useEffect } from "react";

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

const isCastlingMove = (from: Position, to: Position): boolean => {
  const isKingRow = from.row === 0 || from.row === 7;
  const isKingStartCol = from.col === 4;
  const horizontalDiff = Math.abs(to.col - from.col);

  return isKingRow && isKingStartCol && horizontalDiff === 2;
};

const convertCastlingMove = (from: Position, to: Position, cols: number): Position => {
  if (to.col > from.col) return { row: to.row, col: cols - 1 };
  else return { row: to.row, col: 0 };
};

export const useAi = ({ fen, currentTurn, aiSide, depth = 15, onAiMove }: UseAiParams) => {
  const { isReady, getBestMove } = useStockfish();

  useEffect(() => {
    if (!isReady || currentTurn !== aiSide || !fen) return;

    let cancelled = false;

    (async () => {
      try {
        const bestMove = await getBestMove(fen, depth);
        if (bestMove === "(none)") return;

        const from = squareToIndices(bestMove.slice(0, 2));
        let to = squareToIndices(bestMove.slice(2, 4));
        const promotionChar = bestMove[4];
        let promotionType = null;

        if (isCastlingMove(from, to)) to = convertCastlingMove(from, to, 8);

        if (promotionChar && promotionChar in promotionTypes) {
          promotionType = promotionTypes[promotionChar as keyof typeof promotionTypes];
        }

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
