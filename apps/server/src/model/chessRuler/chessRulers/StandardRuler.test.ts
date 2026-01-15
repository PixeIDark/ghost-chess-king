import { Move, PromotionPieceName } from "@ghost-chess-king/shared";
import { ChessBoard } from "@/model/chessBoard";
import { King, Rook, Pawn, Queen, Bishop, Knight } from "@/model/piece";
import { StandardRuler } from "@/model/chessRuler";

describe("StandardRuler", () => {
  let ruler: StandardRuler;

  beforeEach(() => {
    ruler = new StandardRuler();
  });

  describe("createBoard", () => {
    it("8x8 보드를 생성한다", () => {
      const board = ruler.createBoard();

      expect(board.length).toBe(8);
      expect(board[0].length).toBe(8);
    });

    it("0, 1행에 검은색 기물을 배치한다", () => {
      const board = ruler.createBoard();

      expect(board[0][0]?.color).toBe("black");
      expect(board[0][0]?.type).toBe("rook");
      expect(board[1][0]?.color).toBe("black");
      expect(board[1][0]?.type).toBe("pawn");
    });

    it("6, 7행에 흰색 기물을 배치한다", () => {
      const board = ruler.createBoard();

      expect(board[6][0]?.color).toBe("white");
      expect(board[6][0]?.type).toBe("pawn");
      expect(board[7][0]?.color).toBe("white");
      expect(board[7][0]?.type).toBe("rook");
    });

    it("중앙 행들을 비워둔다", () => {
      const board = ruler.createBoard();

      for (let row = 2; row < 6; row++) {
        for (let col = 0; col < 8; col++) {
          expect(board[row][col]).toBeNull();
        }
      }
    });

    it("기물들을 올바른 순서로 배치한다", () => {
      const board = ruler.createBoard();
      const expectedOrder = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];

      expectedOrder.forEach((type, col) => {
        expect(board[0][col]?.type).toBe(type);
        expect(board[7][col]?.type).toBe(type);
      });
    });
  });

  describe("getCastlingMoves", () => {
    it("킹과 룩이 이동하지 않았으면 캐슬링 위치를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 4 });
      const kingsideRook = new Rook(2, "white", { row: 7, col: 7 });
      const queensideRook = new Rook(3, "white", { row: 7, col: 0 });

      emptyBoard[7][4] = king;
      emptyBoard[7][7] = kingsideRook;
      emptyBoard[7][0] = queensideRook;

      const board = new ChessBoard(emptyBoard);
      const moves = ruler.getCastlingMoves(board, king);

      expect(moves).toContainEqual({ row: 7, col: 6 });
      expect(moves).toContainEqual({ row: 7, col: 2 });
    });

    it("킹이 이동했으면 빈 배열을 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 4 });
      king.hasMoved = true;
      const kingsideRook = new Rook(2, "white", { row: 7, col: 7 });

      emptyBoard[7][4] = king;
      emptyBoard[7][7] = kingsideRook;

      const board = new ChessBoard(emptyBoard);
      const moves = ruler.getCastlingMoves(board, king);

      expect(moves).toHaveLength(0);
    });

    it("룩이 이동했으면 해당 방향 캐슬링 위치를 제외한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 4 });
      const kingsideRook = new Rook(2, "white", { row: 7, col: 7 });
      kingsideRook.hasMoved = true;

      emptyBoard[7][4] = king;
      emptyBoard[7][7] = kingsideRook;

      const board = new ChessBoard(emptyBoard);
      const moves = ruler.getCastlingMoves(board, king);

      expect(moves).toHaveLength(0);
    });

    it("킹이 체크 상태이면 빈 배열을 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 4 });
      const kingsideRook = new Rook(2, "white", { row: 7, col: 7 });
      const enemyRook = new Rook(3, "black", { row: 0, col: 4 });

      emptyBoard[7][4] = king;
      emptyBoard[7][7] = kingsideRook;
      emptyBoard[0][4] = enemyRook;

      const board = new ChessBoard(emptyBoard);
      const moves = ruler.getCastlingMoves(board, king);

      expect(moves).toHaveLength(0);
    });

    it("킹과 룩 사이에 기물이 있으면 해당 방향 캐슬링 위치를 제외한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 4 });
      const kingsideRook = new Rook(2, "white", { row: 7, col: 7 });
      const bishop = new Bishop(3, "white", { row: 7, col: 5 });

      emptyBoard[7][4] = king;
      emptyBoard[7][7] = kingsideRook;
      emptyBoard[7][5] = bishop;

      const board = new ChessBoard(emptyBoard);
      const moves = ruler.getCastlingMoves(board, king);

      expect(moves).not.toContainEqual({ row: 7, col: 6 });
    });

    it("킹이 지나는 경로가 공격받으면 해당 방향 캐슬링 위치를 제외한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 4 });
      const kingsideRook = new Rook(2, "white", { row: 7, col: 7 });
      const enemyRook = new Rook(3, "black", { row: 0, col: 5 });

      emptyBoard[7][4] = king;
      emptyBoard[7][7] = kingsideRook;
      emptyBoard[0][5] = enemyRook;

      const board = new ChessBoard(emptyBoard);
      const moves = ruler.getCastlingMoves(board, king);

      expect(moves).not.toContainEqual({ row: 7, col: 6 });
    });

    it("룩 기준으로도 캐슬링 위치를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 4 });
      const kingsideRook = new Rook(2, "white", { row: 7, col: 7 });

      emptyBoard[7][4] = king;
      emptyBoard[7][7] = kingsideRook;

      const board = new ChessBoard(emptyBoard);
      const moves = ruler.getCastlingMoves(board, kingsideRook);

      expect(moves).toContainEqual({ row: 7, col: 5 });
    });
  });

  describe("getEnPassantMoves", () => {
    it("적 폰이 2칸 전진하고 나란히 있으면 앙파상 위치를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const whitePawn = new Pawn(1, "white", { row: 3, col: 4 });
      const blackPawn = new Pawn(2, "black", { row: 3, col: 5 });

      emptyBoard[3][4] = whitePawn;
      emptyBoard[3][5] = blackPawn;

      const board = new ChessBoard(emptyBoard);
      const lastMove: Move = {
        pieceId: 2,
        pieceType: "pawn",
        from: { row: 1, col: 5 },
        to: { row: 3, col: 5 },
        color: "black",
        timestamp: Date.now(),
      };

      const moves = ruler.getEnPassantMoves(board, whitePawn, lastMove);

      expect(moves).toContainEqual({ row: 2, col: 5 });
    });

    it("폰이 아닌 기물은 빈 배열을 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const knight = new Knight(1, "white", { row: 3, col: 4 });
      const blackPawn = new Pawn(2, "black", { row: 3, col: 5 });

      emptyBoard[3][4] = knight;
      emptyBoard[3][5] = blackPawn;

      const board = new ChessBoard(emptyBoard);
      const lastMove: Move = {
        pieceId: 2,
        pieceType: "pawn",
        from: { row: 1, col: 5 },
        to: { row: 3, col: 5 },
        color: "black",
        timestamp: Date.now(),
      };

      const moves = ruler.getEnPassantMoves(board, knight, lastMove);

      expect(moves).toHaveLength(0);
    });

    it("마지막 이동이 없으면 빈 배열을 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const whitePawn = new Pawn(1, "white", { row: 3, col: 4 });

      emptyBoard[3][4] = whitePawn;

      const board = new ChessBoard(emptyBoard);
      const moves = ruler.getEnPassantMoves(board, whitePawn);

      expect(moves).toHaveLength(0);
    });

    it("마지막 이동이 폰의 2칸 전진이 아니면 빈 배열을 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const whitePawn = new Pawn(1, "white", { row: 3, col: 4 });
      const blackPawn = new Pawn(2, "black", { row: 3, col: 5 });

      emptyBoard[3][4] = whitePawn;
      emptyBoard[3][5] = blackPawn;

      const board = new ChessBoard(emptyBoard);
      const lastMove: Move = {
        pieceId: 2,
        pieceType: "pawn",
        from: { row: 2, col: 5 },
        to: { row: 3, col: 5 },
        color: "black",
        timestamp: Date.now(),
      };

      const moves = ruler.getEnPassantMoves(board, whitePawn, lastMove);

      expect(moves).toHaveLength(0);
    });

    it("같은 색 폰끼리는 빈 배열을 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const whitePawn1 = new Pawn(1, "white", { row: 3, col: 4 });
      const whitePawn2 = new Pawn(2, "white", { row: 3, col: 5 });

      emptyBoard[3][4] = whitePawn1;
      emptyBoard[3][5] = whitePawn2;

      const board = new ChessBoard(emptyBoard);
      const lastMove: Move = {
        pieceId: 2,
        pieceType: "pawn",
        from: { row: 1, col: 5 },
        to: { row: 3, col: 5 },
        color: "white",
        timestamp: Date.now(),
      };

      const moves = ruler.getEnPassantMoves(board, whitePawn1, lastMove);

      expect(moves).toHaveLength(0);
    });

    it("나란히 있지 않으면 빈 배열을 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const whitePawn = new Pawn(1, "white", { row: 3, col: 4 });
      const blackPawn = new Pawn(2, "black", { row: 3, col: 6 });

      emptyBoard[3][4] = whitePawn;
      emptyBoard[3][6] = blackPawn;

      const board = new ChessBoard(emptyBoard);
      const lastMove: Move = {
        pieceId: 2,
        pieceType: "pawn",
        from: { row: 1, col: 6 },
        to: { row: 3, col: 6 },
        color: "black",
        timestamp: Date.now(),
      };

      const moves = ruler.getEnPassantMoves(board, whitePawn, lastMove);

      expect(moves).toHaveLength(0);
    });

    it("검은색 폰도 앙파상 위치를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const blackPawn = new Pawn(1, "black", { row: 4, col: 4 });
      const whitePawn = new Pawn(2, "white", { row: 4, col: 5 });

      emptyBoard[4][4] = blackPawn;
      emptyBoard[4][5] = whitePawn;

      const board = new ChessBoard(emptyBoard);
      const lastMove: Move = {
        pieceId: 2,
        pieceType: "pawn",
        from: { row: 6, col: 5 },
        to: { row: 4, col: 5 },
        color: "white",
        timestamp: Date.now(),
      };

      const moves = ruler.getEnPassantMoves(board, blackPawn, lastMove);

      expect(moves).toContainEqual({ row: 5, col: 5 });
    });
  });

  describe("isCheckmate", () => {
    it("체크 상태가 아니면 false를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 4 });

      emptyBoard[7][4] = king;

      const board = new ChessBoard(emptyBoard);
      const result = ruler.isCheckmate(board, "white");

      expect(result).toBe(false);
    });

    it("체크 상태이지만 합법적인 수가 있으면 false를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 4 });
      const enemyRook = new Rook(2, "black", { row: 0, col: 4 });

      emptyBoard[7][4] = king;
      emptyBoard[0][4] = enemyRook;

      const board = new ChessBoard(emptyBoard);
      const result = ruler.isCheckmate(board, "white");

      expect(result).toBe(false);
    });

    it("체크 상태이고 합법적인 수가 없으면 true를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 7 });
      const enemyQueen = new Queen(2, "black", { row: 6, col: 6 });
      const enemyPawn = new Pawn(3, "black", { row: 5, col: 5 });

      emptyBoard[7][7] = king;
      emptyBoard[6][6] = enemyQueen;
      emptyBoard[5][5] = enemyPawn;

      const board = new ChessBoard(emptyBoard);
      const result = ruler.isCheckmate(board, "white");

      expect(result).toBe(true);
    });
  });

  describe("isStalemate", () => {
    it("체크 상태이면 false를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 7 });
      const enemyRook = new Rook(2, "black", { row: 0, col: 7 });

      emptyBoard[7][7] = king;
      emptyBoard[0][7] = enemyRook;

      const board = new ChessBoard(emptyBoard);
      const result = ruler.isStalemate(board, "white");

      expect(result).toBe(false);
    });

    it("체크가 아니지만 합법적인 수가 있으면 false를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 4 });

      emptyBoard[7][4] = king;

      const board = new ChessBoard(emptyBoard);
      const result = ruler.isStalemate(board, "white");

      expect(result).toBe(false);
    });

    it("체크가 아니고 합법적인 수가 없으면 true를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 7 });
      const enemyQueen = new Queen(2, "black", { row: 5, col: 6 });
      const enemyKing = new King(3, "black", { row: 5, col: 5 });

      emptyBoard[7][7] = king;
      emptyBoard[5][6] = enemyQueen;
      emptyBoard[5][5] = enemyKing;

      const board = new ChessBoard(emptyBoard);
      const result = ruler.isStalemate(board, "white");

      expect(result).toBe(true);
    });
  });

  describe("needsPromotion", () => {
    it("흰색 폰이 0행에 도달하면 true를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const whitePawn = new Pawn(1, "white", { row: 0, col: 4 });

      emptyBoard[0][4] = whitePawn;

      const board = new ChessBoard(emptyBoard);
      const result = ruler.needsPromotion(board, { row: 0, col: 4 });

      expect(result).toBe(true);
    });

    it("검은색 폰이 7행에 도달하면 true를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const blackPawn = new Pawn(1, "black", { row: 7, col: 4 });

      emptyBoard[7][4] = blackPawn;

      const board = new ChessBoard(emptyBoard);
      const result = ruler.needsPromotion(board, { row: 7, col: 4 });

      expect(result).toBe(true);
    });

    it("폰이 프로모션 행이 아니면 false를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const whitePawn = new Pawn(1, "white", { row: 5, col: 4 });

      emptyBoard[5][4] = whitePawn;

      const board = new ChessBoard(emptyBoard);
      const result = ruler.needsPromotion(board, { row: 5, col: 4 });

      expect(result).toBe(false);
    });

    it("폰이 아닌 기물은 false를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const knight = new Knight(1, "white", { row: 0, col: 4 });

      emptyBoard[0][4] = knight;

      const board = new ChessBoard(emptyBoard);
      const result = ruler.needsPromotion(board, { row: 0, col: 4 });

      expect(result).toBe(false);
    });

    it("해당 위치에 기물이 없으면 false를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));

      const board = new ChessBoard(emptyBoard);
      const result = ruler.needsPromotion(board, { row: 0, col: 4 });

      expect(result).toBe(false);
    });
  });

  describe("getPromotionOptions", () => {
    it("표준 체스 프로모션 옵션을 반환한다", () => {
      const options = ruler.getPromotionOptions();

      expect(options).toEqual(["queen", "rook", "bishop", "knight"]);
    });

    it("검은색도 같은 옵션을 반환한다", () => {
      const options = ruler.getPromotionOptions();

      expect(options).toEqual(["queen", "rook", "bishop", "knight"]);
    });
  });

  describe("executePromotion", () => {
    it("폰을 퀸으로 프로모션한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const whitePawn = new Pawn(1, "white", { row: 0, col: 4 });

      emptyBoard[0][4] = whitePawn;

      const board = new ChessBoard(emptyBoard);
      const promotedPiece = ruler.executePromotion(board, { row: 0, col: 4 }, "queen");

      expect(promotedPiece.type).toBe("queen");
      expect(promotedPiece.color).toBe("white");
      expect(promotedPiece.id).toBe(1);
      expect(board.getPiece({ row: 0, col: 4 })?.type).toBe("queen");
    });

    it("폰을 룩으로 프로모션한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const blackPawn = new Pawn(2, "black", { row: 7, col: 3 });

      emptyBoard[7][3] = blackPawn;

      const board = new ChessBoard(emptyBoard);
      const promotedPiece = ruler.executePromotion(board, { row: 7, col: 3 }, "rook");

      expect(promotedPiece.type).toBe("rook");
      expect(promotedPiece.color).toBe("black");
      expect(board.getPiece({ row: 7, col: 3 })?.type).toBe("rook");
    });

    it("폰을 비숍으로 프로모션한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const whitePawn = new Pawn(3, "white", { row: 0, col: 2 });

      emptyBoard[0][2] = whitePawn;

      const board = new ChessBoard(emptyBoard);
      const promotedPiece = ruler.executePromotion(board, { row: 0, col: 2 }, "bishop");

      expect(promotedPiece.type).toBe("bishop");
      expect(board.getPiece({ row: 0, col: 2 })?.type).toBe("bishop");
    });

    it("폰을 나이트로 프로모션한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const blackPawn = new Pawn(4, "black", { row: 7, col: 1 });

      emptyBoard[7][1] = blackPawn;

      const board = new ChessBoard(emptyBoard);
      const promotedPiece = ruler.executePromotion(board, { row: 7, col: 1 }, "knight");

      expect(promotedPiece.type).toBe("knight");
      expect(board.getPiece({ row: 7, col: 1 })?.type).toBe("knight");
    });

    it("프로모션된 기물은 hasMoved가 true이다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const whitePawn = new Pawn(5, "white", { row: 0, col: 5 });

      emptyBoard[0][5] = whitePawn;

      const board = new ChessBoard(emptyBoard);
      const promotedPiece = ruler.executePromotion(board, { row: 0, col: 5 }, "queen");

      expect(promotedPiece.hasMoved).toBe(true);
    });

    it("해당 위치에 기물이 없으면 에러를 던진다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));

      const board = new ChessBoard(emptyBoard);

      expect(() => {
        ruler.executePromotion(board, { row: 0, col: 4 }, "queen");
      }).toThrow("No piece at promotion position");
    });

    it("폰이 아닌 기물이면 에러를 던진다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const knight = new Knight(6, "white", { row: 0, col: 4 });

      emptyBoard[0][4] = knight;

      const board = new ChessBoard(emptyBoard);

      expect(() => {
        ruler.executePromotion(board, { row: 0, col: 4 }, "queen");
      }).toThrow("Only pawns can be promoted");
    });

    it("잘못된 프로모션 기물이면 에러를 던진다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const whitePawn = new Pawn(7, "white", { row: 0, col: 4 });

      emptyBoard[0][4] = whitePawn;

      const board = new ChessBoard(emptyBoard);

      expect(() => {
        ruler.executePromotion(board, { row: 0, col: 4 }, "king" as PromotionPieceName);
      }).toThrow("Invalid promotion piece: king");
    });
  });

  describe("canCastling", () => {
    it("킹과 킹사이드 룩이 안 움직였으면 true를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 4 });
      const kingsideRook = new Rook(2, "white", { row: 7, col: 7 });

      emptyBoard[7][4] = king;
      emptyBoard[7][7] = kingsideRook;

      const board = new ChessBoard(emptyBoard);
      const result = ruler.canCastling(board, "white", "kingside");

      expect(result).toBe(true);
    });

    it("킹과 퀸사이드 룩이 안 움직였으면 true를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 4 });
      const queensideRook = new Rook(2, "white", { row: 7, col: 0 });

      emptyBoard[7][4] = king;
      emptyBoard[7][0] = queensideRook;

      const board = new ChessBoard(emptyBoard);
      const result = ruler.canCastling(board, "white", "queenside");

      expect(result).toBe(true);
    });

    it("킹이 없으면 false를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));

      const board = new ChessBoard(emptyBoard);
      const result = ruler.canCastling(board, "white", "kingside");

      expect(result).toBe(false);
    });

    it("킹이 움직였으면 false를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 4 });
      king.hasMoved = true;
      const kingsideRook = new Rook(2, "white", { row: 7, col: 7 });

      emptyBoard[7][4] = king;
      emptyBoard[7][7] = kingsideRook;

      const board = new ChessBoard(emptyBoard);
      const result = ruler.canCastling(board, "white", "kingside");

      expect(result).toBe(false);
    });

    it("룩이 없으면 false를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 4 });

      emptyBoard[7][4] = king;

      const board = new ChessBoard(emptyBoard);
      const result = ruler.canCastling(board, "white", "kingside");

      expect(result).toBe(false);
    });

    it("룩이 움직였으면 false를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 4 });
      const kingsideRook = new Rook(2, "white", { row: 7, col: 7 });
      kingsideRook.hasMoved = true;

      emptyBoard[7][4] = king;
      emptyBoard[7][7] = kingsideRook;

      const board = new ChessBoard(emptyBoard);
      const result = ruler.canCastling(board, "white", "kingside");

      expect(result).toBe(false);
    });

    it("룩 위치에 다른 기물이 있으면 false를 반환한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "white", { row: 7, col: 4 });
      const bishop = new Bishop(2, "white", { row: 7, col: 7 });

      emptyBoard[7][4] = king;
      emptyBoard[7][7] = bishop;

      const board = new ChessBoard(emptyBoard);
      const result = ruler.canCastling(board, "white", "kingside");

      expect(result).toBe(false);
    });

    it("검은색도 캐슬링 권한을 확인한다", () => {
      const emptyBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      const king = new King(1, "black", { row: 0, col: 4 });
      const kingsideRook = new Rook(2, "black", { row: 0, col: 7 });

      emptyBoard[0][4] = king;
      emptyBoard[0][7] = kingsideRook;

      const board = new ChessBoard(emptyBoard);
      const result = ruler.canCastling(board, "black", "kingside");

      expect(result).toBe(true);
    });
  });

  describe("getEnPassantTarget", () => {
    it("흰색 폰이 2칸 전진하면 타겟 위치를 반환한다", () => {
      const lastMove: Move = {
        pieceId: 1,
        pieceType: "pawn",
        from: { row: 6, col: 4 },
        to: { row: 4, col: 4 },
        color: "white",
        timestamp: Date.now(),
      };

      const target = ruler.getEnPassantTarget(lastMove);

      expect(target).toEqual({ row: 5, col: 4 });
    });

    it("검은색 폰이 2칸 전진하면 타겟 위치를 반환한다", () => {
      const lastMove: Move = {
        pieceId: 2,
        pieceType: "pawn",
        from: { row: 1, col: 3 },
        to: { row: 3, col: 3 },
        color: "black",
        timestamp: Date.now(),
      };

      const target = ruler.getEnPassantTarget(lastMove);

      expect(target).toEqual({ row: 2, col: 3 });
    });

    it("마지막 이동이 없으면 null을 반환한다", () => {
      const target = ruler.getEnPassantTarget();

      expect(target).toBeNull();
    });

    it("폰이 아닌 기물이 이동하면 null을 반환한다", () => {
      const lastMove: Move = {
        pieceId: 3,
        pieceType: "knight",
        from: { row: 7, col: 1 },
        to: { row: 5, col: 2 },
        color: "white",
        timestamp: Date.now(),
      };

      const target = ruler.getEnPassantTarget(lastMove);

      expect(target).toBeNull();
    });

    it("폰이 1칸만 전진하면 null을 반환한다", () => {
      const lastMove: Move = {
        pieceId: 4,
        pieceType: "pawn",
        from: { row: 5, col: 4 },
        to: { row: 4, col: 4 },
        color: "white",
        timestamp: Date.now(),
      };

      const target = ruler.getEnPassantTarget(lastMove);

      expect(target).toBeNull();
    });

    it("폰이 대각선으로 이동하면 null을 반환한다", () => {
      const lastMove: Move = {
        pieceId: 5,
        pieceType: "pawn",
        from: { row: 4, col: 4 },
        to: { row: 3, col: 5 },
        color: "white",
        timestamp: Date.now(),
      };

      const target = ruler.getEnPassantTarget(lastMove);

      expect(target).toBeNull();
    });
  });
});
