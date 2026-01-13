import { Pawn } from "./Pawn";

describe("Pawn", () => {
  let pawn: Pawn;
  const maxRow = 8;
  const maxCol = 8;

  beforeEach(() => {
    pawn = new Pawn(1, "white", { row: 4, col: 4 });
  });

  describe("getAttackPaths()", () => {
    it("전방 대각선 2개 방향의 공격 경로를 반환해야 한다", () => {
      const paths = pawn.getAttackPaths(maxRow, maxCol);
      expect(paths.length).toBeLessThanOrEqual(2);
      paths.forEach((path) => {
        expect(path).toHaveLength(1);
      });
    });

    it("getPotentialPaths()와 다른 경로를 반환해야 한다 (폰은 공격과 이동이 다름)", () => {
      const attackPaths = pawn.getAttackPaths(maxRow, maxCol);
      const potentialPaths = pawn.getPotentialPaths(maxRow, maxCol);
      expect(attackPaths).not.toEqual(potentialPaths);
    });

    it("보드 범위를 벗어나는 공격 경로는 포함하지 않아야 한다", () => {
      const paths = pawn.getAttackPaths(maxRow, maxCol);
      paths.forEach((path) => {
        path.forEach((pos) => {
          expect(pos.row).toBeGreaterThanOrEqual(0);
          expect(pos.row).toBeLessThan(maxRow);
          expect(pos.col).toBeGreaterThanOrEqual(0);
          expect(pos.col).toBeLessThan(maxCol);
        });
      });
    });
  });

  describe("getPotentialPaths()", () => {
    it("첫 이동 시 전진 경로(1~2칸)와 대각선 공격 경로를 모두 포함해야 한다", () => {
      const pawn = new Pawn(1, "white", { row: 6, col: 4 }, false);
      const paths = pawn.getPotentialPaths(maxRow, maxCol);

      expect(paths.length).toBeGreaterThanOrEqual(3);
      expect(paths.find((p) => p.length === 2)).toBeDefined();
    });

    it("이미 이동한 폰은 2칸 전진 경로를 포함하지 않아야 한다", () => {
      const pawn = new Pawn(2, "white", { row: 5, col: 4 }, true);
      const paths = pawn.getPotentialPaths(maxRow, maxCol);
      expect(paths.find((p) => p.length === 2)).toBeUndefined();
    });
  });

  describe("clone()", () => {
    it("hasMoved 상태를 포함하여 정확히 복제해야 한다", () => {
      const pawn = new Pawn(3, "black", { row: 1, col: 4 }, true);
      const cloned = pawn.clone();
      expect(cloned.hasMoved).toBe(true);
      expect(cloned.position).toEqual({ row: 1, col: 4 });
    });
  });
});
