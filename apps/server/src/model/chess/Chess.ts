import {
  BoardEntity,
  ChessEventKey,
  ChessEventMap,
  GameState,
  getOppositeSide,
  IChess,
  IChessBoard,
  IChessRuler,
  IChessTimer,
  isSamePosition,
  MatchResultType,
  Move,
  Position,
  PromotionPieceName,
  Side,
} from "@ghost-chess-king/shared";
import { ChessBoard } from "@/model/chessBoard";

export class Chess implements IChess {
  public readonly board: IChessBoard;
  public readonly ruler: IChessRuler;
  public readonly timer: IChessTimer;
  public currentTurn: Side;
  public moveHistory: Move[];
  public matchResult: MatchResultType;
  private boardHistory: BoardEntity[];
  private listeners: Map<ChessEventKey, Set<(data: ChessEventMap[ChessEventKey]) => void>>;

  constructor(ruler: IChessRuler, timer: IChessTimer) {
    this.ruler = ruler;
    this.timer = timer;
    this.board = new ChessBoard(ruler.createBoard());
    this.currentTurn = "white";
    this.moveHistory = [];
    this.matchResult = "PLAYING";
    this.boardHistory = [];
    this.listeners = new Map();
    this.timer.on("timeUpdate", (data) => this.emit("timeUpdate", data));
    this.timer.on("timeout", (data) => {
      this.matchResult = "TIMEOUT";
      this.emit("gameOver", { result: "TIMEOUT", winner: getOppositeSide(data.loser), gameState: this.getGameState() });
    });
  }

  public startGame(): void {
    this.timer.start("white");
    this.emit("gameStarted", { initialState: this.getGameState() });
  }

  public resetGame(): void {
    const newBoard = new ChessBoard(this.ruler.createBoard());
    Object.defineProperty(this, "board", { value: newBoard, writable: false });
    this.currentTurn = "white";
    this.moveHistory = [];
    this.matchResult = "PLAYING";
    this.boardHistory = [];
    this.timer.stop();
  }

  public executeMove(from: Position, to: Position, promoteTo?: PromotionPieceName): boolean {
    if (this.isGameOver()) return false;
    const piece = this.board.getPiece(from);
    if (!piece || piece.color !== this.currentTurn) return false;
    const validMoves = this.ruler.getValidMoves(this.board, piece);
    if (!validMoves.some((pos) => isSamePosition(pos, to))) return false;

    const willNeedPromotion = piece.type === "pawn" && this.ruler.needsPromotion(this.board, to);
    if (willNeedPromotion && !promoteTo) {
      this.emit("promotionRequired", {
        position: to,
        color: piece.color,
        options: this.ruler.getPromotionOptions(),
      });
      return false;
    }

    this.boardHistory.push(this.board.clone().boardEntity);
    const capturedPiece = this.board.getPiece(to);
    const isCastle = this.ruler.getCastlingMoves(this.board, piece).some((pos) => isSamePosition(pos, to));
    const isEnPassant = this.ruler
      .getEnPassantMoves(this.board, piece, this.moveHistory.at(-1))
      .some((pos) => isSamePosition(pos, to));

    this.board.movePiece(from, to);

    if (isCastle) {
      const row = from.row;
      const isKingside = to.col > from.col;
      if (isKingside) this.board.movePiece({ row, col: this.board.cols - 1 }, { row, col: to.col - 1 });
      else this.board.movePiece({ row, col: 0 }, { row, col: to.col + 1 });
    }

    if (isEnPassant) this.board.removePiece({ row: piece.color === "white" ? to.row + 1 : to.row - 1, col: to.col });
    if (willNeedPromotion && promoteTo) this.ruler.executePromotion(this.board, to, promoteTo);

    this.moveHistory.push({
      pieceId: piece.id,
      pieceType: piece.type,
      from,
      to,
      color: piece.color,
      capturedPieceId: capturedPiece?.id.toString(),
      promotion: promoteTo,
      isEnPassant,
      isCastle,
      timestamp: Date.now(),
    });

    this.timer.switchTurn(getOppositeSide(this.currentTurn));
    this.currentTurn = getOppositeSide(this.currentTurn);
    this.emit("turnChanged", { currentTurn: this.currentTurn, gameState: this.getGameState() });
    this.emit("moveExecuted", { move: this.moveHistory[this.moveHistory.length - 1], gameState: this.getGameState() });

    const opponent = getOppositeSide(this.currentTurn);
    if (this.ruler.isCheckmate(this.board, opponent)) {
      this.matchResult = "CHECKMATE";
      this.timer.stop();
      this.emit("gameOver", { result: "CHECKMATE", winner: this.currentTurn, gameState: this.getGameState() });
    } else if (this.ruler.isStalemate(this.board, opponent)) {
      this.matchResult = "STALEMATE";
      this.timer.stop();
      this.emit("gameOver", { result: "STALEMATE", gameState: this.getGameState() });
    } else if (this.ruler.isInCheck(this.board, opponent)) {
      this.matchResult = "CHECK";
      this.emit("check", { color: opponent, gameState: this.getGameState() });
    } else {
      this.matchResult = "PLAYING";
    }
    return true;
  }

  public undoMove(): boolean {
    const previousBoard = this.boardHistory.pop();
    if (!previousBoard) return false;
    const newBoard = new ChessBoard(previousBoard);
    Object.defineProperty(this, "board", { value: newBoard, writable: false });
    this.moveHistory.pop();
    this.currentTurn = getOppositeSide(this.currentTurn);
    this.matchResult = "PLAYING";
    return true;
  }

  public resign(color: Side): void {
    this.matchResult = "RESIGNATION";
    this.timer.stop();
    this.emit("gameOver", { result: "RESIGNATION", winner: getOppositeSide(color), gameState: this.getGameState() });
  }

  public acceptDraw(): void {
    this.matchResult = "DRAW_AGREEMENT";
    this.timer.stop();
    this.emit("gameOver", { result: "DRAW_AGREEMENT", gameState: this.getGameState() });
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
    return this.ruler.getValidMoves(this.board, piece);
  }

  public isGameOver(): boolean {
    return this.matchResult !== "PLAYING" && this.matchResult !== "CHECK";
  }

  public getFen(): string {
    const boardPart = this.board.toBoardString();
    const turn = this.currentTurn === "white" ? "w" : "b";
    let castling = "";
    if (this.ruler.canCastling(this.board, "white", "kingside")) castling += "K";
    if (this.ruler.canCastling(this.board, "white", "queenside")) castling += "Q";
    if (this.ruler.canCastling(this.board, "black", "kingside")) castling += "k";
    if (this.ruler.canCastling(this.board, "black", "queenside")) castling += "q";
    const target = this.ruler.getEnPassantTarget(this.moveHistory.at(-1));
    const enPassant = target ? `${String.fromCharCode(97 + target.col)}${8 - target.row}` : "-";
    let halfMove = this.moveHistory.length;
    for (let i = this.moveHistory.length - 1; i >= 0; i--) {
      if (this.moveHistory[i].pieceType === "pawn" || this.moveHistory[i].capturedPieceId) {
        halfMove = this.moveHistory.length - 1 - i;
        break;
      }
    }
    const fullMove = Math.floor(this.moveHistory.length / 2) + 1;
    return `${boardPart} ${turn} ${castling || "-"} ${enPassant} ${halfMove} ${fullMove}`;
  }

  public on<K extends ChessEventKey>(event: K, listener: (data: ChessEventMap[K]) => void): void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(listener as (data: ChessEventMap[ChessEventKey]) => void);
  }

  public off<K extends ChessEventKey>(event: K, listener: (data: ChessEventMap[K]) => void): void {
    this.listeners.get(event)?.delete(listener as (data: ChessEventMap[ChessEventKey]) => void);
  }

  private emit<K extends ChessEventKey>(event: K, data: ChessEventMap[K]): void {
    this.listeners.get(event)?.forEach((listener) => listener(data));
  }
}
