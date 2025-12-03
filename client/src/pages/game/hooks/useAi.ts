import { useEffect } from "react";
import { useStockfish } from "../../../hooks/useStockfish.ts";
import { delay } from "../../../utils/helper.ts";
import type { Square as SquareType } from "../../../types/chess.ts";

interface UseAiOptions {
  enabled?: boolean; // ✅ 추가
  fen: string;
  currentTurn: "white" | "black";
  aiSide: "white" | "black";
  depth?: number;
  onAiMove: (from: SquareType, to: SquareType) => void;
}

export const useAi = ({ enabled = true, fen, currentTurn, aiSide, depth, onAiMove }: UseAiOptions) => {
  const { isReady, getBestMove } = useStockfish();

  useEffect(() => {
    if (!enabled) return;
    if (!isReady || currentTurn !== aiSide || !fen) return;

    let cancelled = false;

    (async () => {
      try {
        await delay(1000);
        const bestMove = await getBestMove(fen, depth);
        const from = bestMove.slice(0, 2) as SquareType;
        const to = bestMove.slice(2, 4) as SquareType;

        if (!cancelled) onAiMove(from, to);
      } catch (err) {
        console.error("AI move error:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, getBestMove, onAiMove, fen, currentTurn, aiSide, isReady, depth]); // ✅ enabled 추가
};
