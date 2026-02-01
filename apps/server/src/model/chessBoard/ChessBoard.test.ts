import { ChessBoard } from "./ChessBoard";
import { BoardEntity, IChessBoard, IPiece, Position, Side, PromotionPieceName } from "@ghost-chess-king/shared";
import { PieceFactory } from "@/model/piece";

class TestBoard extends ChessBoard {
  public readonly rows = 8;
  public readonly cols = 8;
  public readonly boardEntity: BoardEntity;

  constructor() {
    super();
    this.boardEntity = Array.from({ length: 8 }, () => Array(8).fill(null));
  }

  public applySpecialRule(): void {}
  public clone(): IChessBoard {
    return new TestBoard();
  }
}

jest.mock("@/model/piece", () => ({
  PieceFactory: {
    createPromotion: jest.fn(),
  },
}));

describe("ChessBoard 테스트", () => {
  let board: TestBoard;

  const createMockPiece = (type: string, color: Side, row: number, col: number): IPiece =>
    ({
      type,
      color,
      position: { row, col },
      hasMoved: false,
      moveTo: jest.fn(),
      getAttackPaths: jest.fn().mockReturnValue([]),
      getPotentialPaths: jest.fn().mockReturnValue([]),
      toDto: jest.fn().mockReturnValue({ type, color, position: { row, col } }),
    }) as unknown as IPiece;

  beforeEach(() => {
    board = new TestBoard();
    jest.clearAllMocks();
  });

  test("setPiece 및 getPiece가 정상 작동해야 한다", () => {
    const pos: Position = { row: 0, col: 0 };
    const piece = createMockPiece("pawn", "white", 0, 0);

    board.setPiece(pos, piece);
    expect(board.getPiece(pos)).toBe(piece);
  });

  test("movePiece 시 기물 위치가 이동하고 moveTo가 호출되어야 한다", () => {
    const from: Position = { row: 6, col: 4 };
    const to: Position = { row: 4, col: 4 };
    const piece = createMockPiece("pawn", "white", 6, 4);

    board.setPiece(from, piece);
    board.movePiece(from, to);

    expect(board.getPiece(from)).toBeNull();
    expect(board.getPiece(to)).toBe(piece);
    expect(piece.moveTo).toHaveBeenCalledWith(to.row, to.col);
  });

  test("findKing이 해당 색상의 왕 위치를 올바르게 찾아야 한다", () => {
    const kingPos: Position = { row: 7, col: 4 };
    const king = createMockPiece("king", "white", 7, 4);

    board.setPiece(kingPos, king);
    const found = board.findKing("white");

    expect(found).toEqual(kingPos);
  });

  test("isPositionUnderAttack이 적의 공격 범위 내에 있으면 true를 반환해야 한다", () => {
    const targetPos: Position = { row: 4, col: 4 };
    const enemyPos: Position = { row: 3, col: 3 };
    const enemyPiece = createMockPiece("bishop", "black", 3, 3);

    (enemyPiece.getAttackPaths as jest.Mock).mockReturnValue([[targetPos]]);
    board.setPiece(enemyPos, enemyPiece);

    const isUnderAttack = board.isPositionUnderAttack(targetPos, "black");
    expect(isUnderAttack).toBe(true);
  });

  test("promotePiece가 폰을 지정된 기물로 교체해야 한다", () => {
    const pos: Position = { row: 0, col: 0 };
    const pawn = createMockPiece("pawn", "white", 0, 0);
    const queen = createMockPiece("queen", "white", 0, 0);

    board.setPiece(pos, pawn);
    (PieceFactory.createPromotion as jest.Mock).mockReturnValue(queen);

    board.promotePiece(pos, "queen" as PromotionPieceName);

    expect(board.getPiece(pos)?.type).toBe("queen");
    expect(PieceFactory.createPromotion).toHaveBeenCalledWith(pawn, "queen");
  });

  test("toBoardString(FEN 형식)이 올바른 문자열을 생성해야 한다", () => {
    board.setPiece({ row: 0, col: 0 }, createMockPiece("rook", "black", 0, 0));
    board.setPiece({ row: 0, col: 7 }, createMockPiece("king", "black", 0, 7));

    const fen = board.toBoardString();

    expect(fen.startsWith("r6k")).toBe(true);
    expect(fen.split("/").length).toBe(8);
  });

  test("clear 호출 시 모든 칸이 비워져야 한다", () => {
    board.setPiece({ row: 0, col: 0 }, createMockPiece("pawn", "white", 0, 0));
    board.clear();

    const allNull = board.boardEntity.flat().every((cell) => cell === null);
    expect(allNull).toBe(true);
  });
});
