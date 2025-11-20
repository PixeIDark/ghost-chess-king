import { useEffect, useRef, useState } from "react";

export const useStockfish = () => {
  const engineRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const promiseRef = useRef<{
    resolve?: (move: string) => void;
  }>({});

  useEffect(() => {
    const engine = new Worker("/stockfish/stockfish-17.1-single-a496a04.js");
    engineRef.current = engine;

    engine.onmessage = (event: MessageEvent) => {
      const message = event.data;
      const messageStr = typeof message === "string" ? message : message.toString?.() || "";

      if (messageStr.includes("uciok")) {
        setIsReady(true);
      }

      if (messageStr.includes("bestmove")) {
        const parts = messageStr.split(" ");
        const move = parts[1];

        if (promiseRef.current.resolve) {
          promiseRef.current.resolve(move);
          promiseRef.current.resolve = undefined;
        }
      }
    };

    engine.onerror = (error) => {
      console.error("Engine error:", error);
    };

    engine.postMessage("uci");

    return () => {
      if (engineRef.current) {
        engineRef.current.postMessage("quit");
        engineRef.current.terminate();
      }
    };
  }, []);

  const getBestMove = (fen: string, depth: number = 15): Promise<string> => {
    return new Promise((resolve) => {
      if (!engineRef.current || !isReady) {
        resolve("");
        return;
      }

      promiseRef.current.resolve = resolve;

      engineRef.current.postMessage("ucinewgame");
      engineRef.current.postMessage(`position fen ${fen}`);
      engineRef.current.postMessage(`go depth ${depth}`);
    });
  };

  return { isReady, getBestMove };
};
