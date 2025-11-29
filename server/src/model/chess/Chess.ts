import type { Side, Square } from "../../types/chess.ts";
import { getTurn } from "./utils/fenUtils.ts";
import { executeMove } from "./utils/executeMove.ts";
import { fenToBoard } from "./utils/fenToBoard.ts";
import { getValidMoves } from "./utils/moveValidation.ts";
import { isCheck, isCheckmate, isStalemate } from "./utils/gameState.ts";
import { getOppositeSide } from "../../utils/squareUtils.ts";
import { INITIAL_FEN } from "./chess.constants.ts";

export class Chess {
  private readonly fen: string;
  private readonly history: string[];

  constructor(fen?: string, history?: string[]) {
    this.fen = fen || INITIAL_FEN;
    this.history = history || [this.fen];
  }

  move(from: Square, to: Square): Chess {
    const { newFen, newHistory } = executeMove(
      this.fen,
      this.history,
      from,
      to,
    );
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

  status() {
    const board = this.board();
    const turn = this.turn();

    if (isCheckmate(board, this.fen, turn))
      return {
        state: "checkmate",
        target: turn,
        winner: getOppositeSide(turn),
      };
    if (isStalemate(board, this.fen, turn))
      return { state: "stalemate", target: turn, winner: "draw" };
    if (isCheck(board, turn))
      return { state: "check", target: turn, winner: null };

    return { state: "normal", target: null, winner: null };
  }
}
