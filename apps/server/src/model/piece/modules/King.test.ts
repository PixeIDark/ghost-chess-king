import { King } from "./King";

describe("King", () => {
  let king: King;

  beforeEach(() => {
    king = new King(1, "black", { row: 4, col: 4 });
  });

  describe("getAttackPaths()", () => {
    it("8개 방향으로 1칸씩 공격 경로를 반환해야 한다", () => {
      const paths = king.getAttackPaths();
      expect(paths.length).toBeLessThanOrEqual(8);
      paths.forEach((path) => {
        expect(path).toHaveLength(1);
      });
    });

    it("getPotentialPaths()와 동일한 경로를 반환해야 한다", () => {
      const attackPaths = king.getAttackPaths();
      const potentialPaths = king.getPotentialPaths();
      expect(attackPaths).toEqual(potentialPaths);
    });
  });

  describe("getPotentialPaths()", () => {
    it("주변 8방향으로 각각 1칸씩의 경로를 반환해야 한다", () => {
      const paths = king.getPotentialPaths();
      expect(paths).toHaveLength(8);
      paths.forEach((p) => expect(p).toHaveLength(1));
    });
  });

  describe("clone()", () => {
    it("독립된 새로운 King 객체를 생성해야 한다", () => {
      const cloned = king.clone();
      expect(cloned).not.toBe(king);
      expect(cloned.type).toBe("king");
    });
  });
});
