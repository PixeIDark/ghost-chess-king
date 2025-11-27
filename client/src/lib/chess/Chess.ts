import type { Square } from "../../types/chess.ts";
import { getRanks } from "./utils/fenUtils.ts";
import { pieceMove } from "./utils/pieceMove.ts";
import { fenToBoard } from "./utils/fenToBoard.ts";

export class Chess {
  private readonly fen: string;
  private readonly history: string[];

  constructor(fen?: string, history?: string[]) {
    this.fen = fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    this.history = history || [this.fen];
  }

  move(from: Square, to: Square): Chess {
    const { newFen, newHistory } = pieceMove(this.fen, this.history, from, to);
    return new Chess(newFen, newHistory);
  }

  board() {
    return fenToBoard(this.fen);
  }

  private pieceAt(square: Square): string | null {
    const ranks = getRanks(this.fen);
    const rank = 8 - Number(square[1]);
    const file = square.charCodeAt(0) - "a".charCodeAt(0);
    let fileIndex = 0;

    for (const char of ranks[rank]) {
      if (fileIndex === file) return char;
      if (char >= "1" && char <= "8") fileIndex += Number(char);
      else fileIndex++;
    }

    return null;
  }
}
