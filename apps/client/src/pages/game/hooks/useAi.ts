import { useEffect } from "react";
import { useStockfish } from "@/hooks/useStockfish";
import { delay } from "@/utils/helper";
import { squareToIndices } from "@ghost-chess-king/shared";
import type { Position } from "@ghost-chess-king/shared";

interface UseAiParams {
  fen: string;
  currentTurn: "white" | "black";
  aiSide: "white" | "black";
  depth: number;
  onAiMove: (from: Position, to: Position) => void;
}

export const useAi = ({ fen, currentTurn, aiSide, depth = 15, onAiMove }: UseAiParams) => {
  const { isReady, getBestMove } = useStockfish();

  useEffect(() => {
    if (!isReady || currentTurn !== aiSide || !fen) return;

    let cancelled = false;

    (async () => {
      try {
        await delay(1000);
        const bestMove = await getBestMove(fen, depth);
        const from = squareToIndices(bestMove.slice(0, 2));
        const to = squareToIndices(bestMove.slice(2, 4));

        if (!cancelled) onAiMove(from, to);
      } catch (err) {
        console.error("AI move error:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [getBestMove, onAiMove, fen, currentTurn, aiSide, isReady, depth]);
};
