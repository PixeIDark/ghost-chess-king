import { useEffect, useRef, useState } from "react";

export const useStockfish = () => {
  const engineRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const promiseRef = useRef<{
    resolve?: (move: string) => void;
    reject?: (error: Error) => void;
    timeout?: NodeJS.Timeout;
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

        if (promiseRef.current.timeout) clearTimeout(promiseRef.current.timeout);

        if (promiseRef.current.resolve) promiseRef.current.resolve(move);

        promiseRef.current = {};
      }
    };

    engine.onerror = (error) => {
      console.error("Engine error:", error);

      if (promiseRef.current.reject) promiseRef.current.reject(new Error("Engine error"));

      if (promiseRef.current.timeout) clearTimeout(promiseRef.current.timeout);

      promiseRef.current = {};
    };

    engine.postMessage("uci");

    return () => {
      if (promiseRef.current.timeout) {
        clearTimeout(promiseRef.current.timeout);
      }
      if (engineRef.current) {
        engineRef.current.postMessage("quit");
        engineRef.current.terminate();
      }
    };
  }, []);

  const getBestMove = (fen: string, depth: number = 15): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!engineRef.current || !isReady) {
        reject(new Error("Engine not ready"));
        return;
      }

      if (promiseRef.current.resolve) {
        if (promiseRef.current.timeout) clearTimeout(promiseRef.current.timeout);
        promiseRef.current.reject?.(new Error("Request cancelled"));
      }

      promiseRef.current.resolve = resolve;
      promiseRef.current.reject = reject;
      promiseRef.current.timeout = setTimeout(() => {
        promiseRef.current = {};
        reject(new Error("Stockfish timeout"));
      }, 30000);

      engineRef.current?.postMessage("ucinewgame");
      engineRef.current?.postMessage(`position fen ${fen}`);
      engineRef.current?.postMessage(`go depth ${depth}`);
    });
  };

  return { isReady, getBestMove };
};
