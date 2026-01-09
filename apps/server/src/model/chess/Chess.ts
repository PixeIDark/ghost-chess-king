import { INITIAL_FEN } from "@/model/chess/chess.constants";
import { getOppositeSide, IChess, MatchStatus, Side, Square } from "@ghost-chess/shared";
import { executeMove } from "@/model/chess/utils/executeMove";
import { fenToBoard } from "@/model/chess/utils/fenToBoard";
import { getTurn } from "@/model/chess/utils/fenUtils";
import { getValidMoves } from "@/model/chess/utils/moveValidation";
import { isCheck, isCheckmate, isStalemate } from "@/model/chess/utils/gameState";

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

  turn(): Side {
    return getTurn(this.fen);
  }

  validMove(from: Square) {
    return getValidMoves(this.board(), this.fen, from);
  }

  status(): MatchStatus {
    const board = this.board();
    const turn = this.turn();

    if (isCheckmate(board, this.fen, turn)) {
      return {
        state: "checkmate", // "checkmate" as GamePhase 라고 써도 됩니다.
        target: turn,
        winner: getOppositeSide(turn),
      } as const; // as const를 붙여 리터럴 타입으로 고정
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
