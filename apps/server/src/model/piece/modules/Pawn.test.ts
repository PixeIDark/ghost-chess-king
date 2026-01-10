import { Pawn } from "./Pawn";

describe("Pawn", () => {
  describe("getPotentialPaths()", () => {
    it("첫 이동 시 전진 경로(1~2칸)와 대각선 공격 경로를 모두 포함해야 한다", () => {
      const pawn = new Pawn(1, "white", { row: 6, col: 4 }, false);
      const paths = pawn.getPotentialPaths();

      expect(paths.length).toBeGreaterThanOrEqual(3);
      expect(paths.find((p) => p.length === 2)).toBeDefined();
    });

    it("이미 이동한 폰은 2칸 전진 경로를 포함하지 않아야 한다", () => {
      const pawn = new Pawn(2, "white", { row: 5, col: 4 }, true);
      const paths = pawn.getPotentialPaths();
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
