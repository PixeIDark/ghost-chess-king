import { Piece } from "./Piece";
import { Position } from "@ghost-chess-king/shared";
import { PieceName } from "@ghost-chess-king/shared";

class TestPiece extends Piece {
  public readonly type: PieceName = "rook";

  public clone() {
    return new TestPiece(this.id, this.color, { ...this.position }, this.hasMoved);
  }

  public getAttackPaths(): Position[][] {
    return [];
  }

  public getPotentialPaths(): Position[][] {
    return [];
  }

  public testGenerateLinePath(dRow: number, dCol: number, maxRow: number, maxCol: number): Position[] {
    return this.generateLinePath(dRow, dCol, maxRow, maxCol);
  }
}

describe("Piece (Abstract Class) 공통 메서드 테스트", () => {
  let piece: TestPiece;
  const maxRow = 8;
  const maxCol = 8;

  beforeEach(() => {
    piece = new TestPiece(1, "white", { row: 4, col: 4 });
  });

  describe("moveTo()", () => {
    it("위치를 변경하고 hasMoved 상태를 true로 업데이트해야 한다", () => {
      piece.moveTo(5, 5);

      expect(piece.position).toEqual({ row: 5, col: 5 });
      expect(piece.hasMoved).toBe(true);
    });
  });

  describe("setPosition()", () => {
    it("위치만 변경하고 hasMoved 상태는 유지해야 한다", () => {
      expect(piece.hasMoved).toBe(false);

      piece.setPosition(2, 2);

      expect(piece.position).toEqual({ row: 2, col: 2 });
      expect(piece.hasMoved).toBe(false);
    });
  });

  describe("toDto()", () => {
    it("기물의 현재 상태를 담은 순수 객체(IPieceData)를 반환해야 한다", () => {
      const dto = piece.toDto();

      expect(dto).toEqual({
        id: 1,
        type: "rook",
        color: "white",
        position: { row: 4, col: 4 },
        hasMoved: false,
      });
      expect(dto.position).not.toBe(piece.position);
    });
  });

  describe("generateLinePath() - protected", () => {
    it("주어진 방향으로 보드 끝까지의 경로 좌표를 생성해야 한다", () => {
      const path = piece.testGenerateLinePath(0, 1, maxRow, maxCol);

      expect(path).toHaveLength(3);
      expect(path[0]).toEqual({ row: 4, col: 5 });
      expect(path[2]).toEqual({ row: 4, col: 7 });
    });

    it("보드 경계를 벗어나는 좌표는 포함하지 않아야 한다", () => {
      const edgePiece = new TestPiece(2, "black", { row: 0, col: 0 });
      const path = edgePiece.testGenerateLinePath(-1, 0, maxRow, maxCol);

      expect(path).toHaveLength(0);
    });
  });
});
