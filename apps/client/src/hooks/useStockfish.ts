import { useEffect, useRef, useState } from "react";

export const useStockfish = () => {
  const engineRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const processingRef = useRef(false);
  const promiseRef = useRef<{
    resolve?: (move: string) => void;
    reject?: (error: Error) => void;
    timeout?: ReturnType<typeof setTimeout>;
  }>({});

  useEffect(() => {
    const engine = new Worker("/stockfish/stockfish-17.1-single-a496a04.js");
    engineRef.current = engine;

    engine.onmessage = (event: MessageEvent) => {
      const message = event.data;
      const messageStr = typeof message === "string" ? message : message.toString?.() || "";

      if (messageStr.includes("uciok")) setIsReady(true);
      if (messageStr.includes("bestmove")) {
        const parts = messageStr.split(" ");
        const move = parts[1];

        if (promiseRef.current.timeout) clearTimeout(promiseRef.current.timeout);
        if (promiseRef.current.resolve) promiseRef.current.resolve(move);

        promiseRef.current = {};
        processingRef.current = false;
      }
    };

    engine.onerror = (error) => {
      console.error("Engine error:", error);

      if (promiseRef.current.reject) promiseRef.current.reject(new Error("Engine error"));
      if (promiseRef.current.timeout) clearTimeout(promiseRef.current.timeout);

      promiseRef.current = {};
      processingRef.current = false;
    };

    engine.postMessage("uci");

    return () => {
      if (promiseRef.current.timeout) clearTimeout(promiseRef.current.timeout);
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

      if (processingRef.current) {
        if (promiseRef.current.timeout) clearTimeout(promiseRef.current.timeout);
        if (promiseRef.current.reject) promiseRef.current.reject(new Error("Request cancelled"));
      }

      processingRef.current = true;
      promiseRef.current.resolve = resolve;
      promiseRef.current.reject = reject;

      promiseRef.current.timeout = setTimeout(() => {
        processingRef.current = false;
        promiseRef.current = {};
        reject(new Error("Stockfish timeout"));
      }, 10000);

      try {
        engineRef.current.postMessage("ucinewgame");
        engineRef.current.postMessage(`position fen ${fen}`);
        engineRef.current.postMessage(`go depth ${depth}`);
      } catch (error) {
        processingRef.current = false;
        if (promiseRef.current.timeout) clearTimeout(promiseRef.current.timeout);
        promiseRef.current = {};
        reject(error);
      }
    });
  };

  return { isReady, getBestMove };
};
