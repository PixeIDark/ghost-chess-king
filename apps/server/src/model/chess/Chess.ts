import {
  GameState,
  getOppositeSide,
  IChessBoard,
  IChessRuler,
  IChessTimer,
  isSamePosition,
  MatchResultType,
  Move,
  Position,
  PromotionPieceName,
  Side,
  GameResult,
  IChess,
  MoveResult,
} from "@ghost-chess-king/shared";

export class Chess implements IChess {
  public readonly ruler: IChessRuler;
  public readonly timer: IChessTimer;
  public board: IChessBoard;
  public currentTurn: Side;
  public moveHistory: Move[];
  public matchResult: MatchResultType;
  private boardHistory: IChessBoard[];

  constructor(ruler: IChessRuler, timer: IChessTimer, board: IChessBoard) {
    this.ruler = ruler;
    this.timer = timer;
    this.board = board;
    this.currentTurn = "white";
    this.moveHistory = [];
    this.matchResult = "PLAYING";
    this.boardHistory = [];
  }

  public startGame(): void {
    this.timer.start("white");
  }

  public resetGame(): void {
    this.board = this.board.clone();
    this.board.clear();
    this.currentTurn = "white";
    this.moveHistory = [];
    this.matchResult = "PLAYING";
    this.boardHistory = [];
    this.timer.stop();
  }

  public executeMove(from: Position, to: Position, promoteTo?: PromotionPieceName): MoveResult {
    if (this.isGameOver()) {
      return { success: false, specialRule: null, needsPromotion: false };
    }

    const piece = this.board.getPiece(from);
    if (!piece || piece.color !== this.currentTurn) {
      return { success: false, specialRule: null, needsPromotion: false };
    }

    const validMoves = this.ruler.getValidMoves(this.board, piece, this.moveHistory);
    if (!validMoves.some((pos) => isSamePosition(pos, to))) {
      return { success: false, specialRule: null, needsPromotion: false };
    }

    this.boardHistory.push(this.board.clone());

    const capturedPiece = this.board.getPiece(to);
    const specialRule = this.ruler.getSpecialRule(this.board, from, to, this.moveHistory);

    if (specialRule) {
      this.board.applySpecialRule(specialRule, from, to);
    } else {
      this.board.movePiece(from, to);
    }
    const move: Move = {
      pieceId: piece.id,
      pieceType: piece.type,
      from,
      to,
      color: piece.color,
      capturedPieceId: capturedPiece?.id.toString(),
      promotion: promoteTo,
      isEnPassant: specialRule === "en-passant",
      isCastle: specialRule === "castling-kingside" || specialRule === "castling-queenside",
      timestamp: Date.now(),
    };

    this.moveHistory.push(move);
    this.updateMatchResult();

    const willNeedPromotion = this.ruler.needsPromotion(this.board, to);
    if (willNeedPromotion && !promoteTo) {
      return {
        success: false,
        specialRule: null,
        needsPromotion: true,
        promotionOptions: this.ruler.getPromotionOptions(),
        position: to,
      };
    }

    this.timer.switchTurn(getOppositeSide(this.currentTurn));
    this.currentTurn = getOppositeSide(this.currentTurn);

    return { success: true, specialRule, needsPromotion: false, move };
  }

  private updateMatchResult(): void {
    const currentPlayer = this.currentTurn;

    if (this.ruler.isCheckmate(this.board, currentPlayer)) {
      this.matchResult = "CHECKMATE";
      this.timer.stop();
    } else if (this.ruler.isStalemate(this.board, currentPlayer)) {
      this.matchResult = "STALEMATE";
      this.timer.stop();
    } else if (this.ruler.isInCheck(this.board, currentPlayer)) {
      this.matchResult = "CHECK";
    } else {
      this.matchResult = "PLAYING";
    }
  }

  public getGameResult(): GameResult | null {
    switch (this.matchResult) {
      case "CHECKMATE":
        return { status: this.matchResult, winner: getOppositeSide(this.currentTurn) };
      case "STALEMATE":
        return { status: this.matchResult, winner: "DRAW" };
      case "TIMEOUT":
        return { status: this.matchResult, winner: getOppositeSide(this.currentTurn) };
      case "RESIGNATION":
        return { status: this.matchResult, winner: getOppositeSide(this.currentTurn) };
      case "DRAW_AGREEMENT":
        return { status: this.matchResult, winner: "DRAW" };
      default:
        return null;
    }
  }

  public undoMove(): boolean {
    const previousBoard = this.boardHistory.pop();
    if (!previousBoard) return false;

    this.board = previousBoard;
    this.moveHistory.pop();
    this.currentTurn = getOppositeSide(this.currentTurn);
    this.matchResult = "PLAYING";
    return true;
  }

  public resign(color: Side): GameResult {
    this.matchResult = "RESIGNATION";
    this.timer.stop();
    return { status: "RESIGNATION", winner: getOppositeSide(color) };
  }

  public acceptDraw(): GameResult {
    this.matchResult = "DRAW_AGREEMENT";
    this.timer.stop();
    return { status: "DRAW_AGREEMENT", winner: "DRAW" };
  }

  public timeout(loser: Side): GameResult {
    this.matchResult = "TIMEOUT";
    this.timer.stop();
    return { status: "TIMEOUT", winner: getOppositeSide(loser) };
  }

  public getGameState(): GameState {
    return {
      currentTurn: this.currentTurn,
      matchResult: this.matchResult,
      isCheck: this.ruler.isInCheck(this.board, this.currentTurn),
      board: this.board.toDto(),
      moveHistory: [...this.moveHistory],
      capturedPieces: { white: [], black: [] },
      fen: this.getFen(),
      timeRemaining: this.timer.getTime(),
    };
  }

  public getValidMoves(position: Position): Position[] {
    const piece = this.board.getPiece(position);
    if (!piece || piece.color !== this.currentTurn) return [];
    return this.ruler.getValidMoves(this.board, piece, this.moveHistory);
  }

  public isGameOver(): boolean {
    return this.matchResult !== "PLAYING" && this.matchResult !== "CHECK";
  }

  public getFen(): string {
    const boardPart = this.board.toBoardString();
    const turn = this.currentTurn === "white" ? "w" : "b";
    const castling = "-";
    const enPassant = "-";

    let halfMove = this.moveHistory.length;
    for (let i = this.moveHistory.length - 1; i >= 0; i--) {
      if (this.moveHistory[i].pieceType === "pawn" || this.moveHistory[i].capturedPieceId) {
        halfMove = this.moveHistory.length - 1 - i;
        break;
      }
    }
    const fullMove = Math.floor(this.moveHistory.length / 2) + 1;

    return `${boardPart} ${turn} ${castling} ${enPassant} ${halfMove} ${fullMove}`;
  }

  public executePromotion(position: Position, piece: PromotionPieceName): void {
    this.board.promotePiece(position, piece);

    this.timer.switchTurn(getOppositeSide(this.currentTurn));
    this.currentTurn = getOppositeSide(this.currentTurn);

    this.updateMatchResult();
  }
}
