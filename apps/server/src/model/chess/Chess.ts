import { INITIAL_FEN } from "@/model/chess/Chess.constants";
import { getOppositeSide, Side, Square } from "@ghost-chess-king/shared";
import { executeMove } from "@/model/chess/utils/executeMove";
import { fenToBoard } from "@/model/chess/utils/fenToBoard";
import { getTurn } from "@/model/chess/utils/fenUtils";
import { getValidMoves } from "@/model/chess/utils/moveValidation";
import { isCheck, isCheckmate, isStalemate } from "@/model/chess/utils/gameState";
import { IChess } from "@/model/chess/Chess.interface";

export class Chess implements IChess {
  private readonly fen: string;
  private readonly history: string[];

  constructor(fen?: string, history?: string[]) {
    this.fen = fen || INITIAL_FEN;
    this.history = history || [this.fen];
  }

  move(from: Square, to: Square): Chess {
    const { newFen, newHistory } = executeMove(this.fen, this.history, from, to);
    return new Chess(newFen, newHistory);
  }

  getFen() {
    return this.fen;
  }

  board() {
    return fenToBoard(this.fen);
  }

  turn() {
    return getTurn(this.fen);
  }

  validMove(from: Square) {
    return getValidMoves(this.board(), this.fen, from);
  }

  status() {
    const board = this.board();
    const turn = this.turn();

    if (isCheckmate(board, this.fen, turn)) {
      return {
        state: "checkmate",
        target: turn,
        winner: getOppositeSide(turn),
      } as const;
    }

    if (isStalemate(board, this.fen, turn)) {
      return {
        state: "stalemate",
        target: turn,
        winner: "draw",
      } as const;
    }

    if (isCheck(board, turn)) {
      return {
        state: "check",
        target: turn,
        winner: null,
      } as const;
    }

    return {
      state: "normal",
      target: null,
      winner: null,
    } as const;
  }
}
