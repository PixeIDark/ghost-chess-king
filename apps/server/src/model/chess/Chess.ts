import {
  EventManager,
  GameResult,
  GameState,
  getOppositeSide,
  IChess,
  IChessBoard,
  IChessRuler,
  IChessTimer,
  isSamePosition,
  MatchResultType,
  Move,
  MoveResult,
  Position,
  PromotionPieceName,
  Side,
  TimerEventMap,
} from "@ghost-chess-king/shared";

export type ChessEventMap = {
  timeUpdate: TimerEventMap["timeUpdate"];
  timeout: TimerEventMap["timeout"];
  gameOver: GameResult;
  check: { position: Position };
  moveExecuted: { move: Move; state: GameState };
};

export class Chess extends EventManager<ChessEventMap> implements IChess {
  public readonly ruler: IChessRuler;
  public readonly timer: IChessTimer;
  public board: IChessBoard;
  public currentTurn: Side;
  public moveHistory: Move[];
  public matchResult: MatchResultType;
  private boardHistory: IChessBoard[];
  private handleTimeUpdate: (data: TimerEventMap["timeUpdate"]) => void;
  private handleTimeout: (data: TimerEventMap["timeout"]) => void;

  constructor(ruler: IChessRuler, timer: IChessTimer, board: IChessBoard) {
    super();
    this.ruler = ruler;
    this.timer = timer;
    this.board = board;
    this.currentTurn = "white";
    this.moveHistory = [];
    this.matchResult = "PLAYING";
    this.boardHistory = [];

    this.handleTimeUpdate = (data) => {
      this.emit("timeUpdate", data);
    };

    this.handleTimeout = (data) => {
      const result = this.timeout(data.loser);
      this.emit("gameOver", result);
    };

    this.setupTimerEvents();
  }

  private setupTimerEvents(): void {
    this.timer.on("timeUpdate", this.handleTimeUpdate);
    this.timer.on("timeout", this.handleTimeout);
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

    if (specialRule) this.board.applySpecialRule(specialRule, from, to);
    else this.board.movePiece(from, to);

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

    this.updateMatchResult();
    this.timer.switchTurn(getOppositeSide(this.currentTurn));
    this.currentTurn = getOppositeSide(this.currentTurn);

    this.emit("moveExecuted", { move, state: this.getGameState() });

    if (this.matchResult === "CHECK") {
      const checkPos = this.board.findKing(this.currentTurn);
      if (checkPos) this.emit("check", { position: checkPos });
    }

    if (this.isGameOver()) {
      const gameResult = this.getGameResult();
      if (gameResult) this.emit("gameOver", gameResult);
    }

    return { success: true, specialRule, needsPromotion: false, move };
  }

  private updateMatchResult(): void {
    const opponent = getOppositeSide(this.currentTurn);

    if (this.ruler.isCheckmate(this.board, opponent, this.moveHistory)) {
      this.matchResult = "CHECKMATE";
      this.timer.stop();
    } else if (this.ruler.isStalemate(this.board, opponent, this.moveHistory)) {
      this.matchResult = "STALEMATE";
      this.timer.stop();
    } else if (this.ruler.isInCheck(this.board, opponent)) {
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
    const result: GameResult = { status: "RESIGNATION", winner: getOppositeSide(color) };
    this.emit("gameOver", result);
    return result;
  }

  public acceptDraw(): GameResult {
    this.matchResult = "DRAW_AGREEMENT";
    this.timer.stop();
    const result: GameResult = { status: "DRAW_AGREEMENT", winner: "DRAW" };
    this.emit("gameOver", result);
    return result;
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
      checkPosition: this.ruler.isInCheck(this.board, this.currentTurn) ? this.board.findKing(this.currentTurn) : null,
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

  public executePromotion(position: Position, piece: PromotionPieceName): void {
    this.board.promotePiece(position, piece);
    this.updateMatchResult();

    this.timer.switchTurn(getOppositeSide(this.currentTurn));
    this.currentTurn = getOppositeSide(this.currentTurn);

    this.emit("moveExecuted", { move: this.moveHistory[this.moveHistory.length - 1], state: this.getGameState() });

    if (this.isGameOver()) {
      const gameResult = this.getGameResult();
      if (gameResult) this.emit("gameOver", gameResult);
    }
  }

  public destroy(): void {
    this.timer.off("timeUpdate", this.handleTimeUpdate);
    this.timer.off("timeout", this.handleTimeout);
    this.timer.stop();
    this.clear();
  }

  public getFen(): string {
    const boardPart = this.board.toBoardString();
    const turn = this.currentTurn === "white" ? "w" : "b";
    const castling = this.getCastlingRights();
    const enPassant = this.getEnPassantTarget();

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

  private getEnPassantTarget(): string {
    if (this.moveHistory.length === 0) return "-";

    const lastMove = this.moveHistory[this.moveHistory.length - 1];

    if (lastMove.pieceType !== "pawn") return "-";

    const rowDiff = Math.abs(lastMove.to.row - lastMove.from.row);
    if (rowDiff !== 2) return "-";

    const targetRow = (lastMove.from.row + lastMove.to.row) / 2;
    const targetCol = lastMove.to.col;

    const file = String.fromCharCode(97 + targetCol);
    const rank = 8 - targetRow;

    return `${file}${rank}`;
  }

  private getCastlingRights(): string {
    let rights = "";

    if (this.canCastle("white", "kingside")) rights += "K";
    if (this.canCastle("white", "queenside")) rights += "Q";
    if (this.canCastle("black", "kingside")) rights += "k";
    if (this.canCastle("black", "queenside")) rights += "q";

    return rights || "-";
  }

  private canCastle(color: Side, side: "kingside" | "queenside"): boolean {
    const row = color === "white" ? 7 : 0;
    const kingCol = 4;
    const rookCol = side === "kingside" ? 7 : 0;

    const king = this.board.getPiece({ row, col: kingCol });
    if (!king || king.type !== "king" || king.color !== color || king.hasMoved) return false;

    const rook = this.board.getPiece({ row, col: rookCol });

    return !(!rook || rook.type !== "rook" || rook.color !== color || rook.hasMoved);
  }
}
