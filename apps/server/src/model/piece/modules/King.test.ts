import { King } from "./King";

describe("King", () => {
  let king: King;

  beforeEach(() => {
    king = new King(1, "black", { row: 4, col: 4 });
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
