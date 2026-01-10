import { Bishop } from "./Bishop";

describe("Bishop", () => {
  let bishop: Bishop;

  beforeEach(() => {
    bishop = new Bishop(1, "black", { row: 4, col: 4 });
  });

  describe("getPotentialPaths()", () => {
    it("4개 대각선 방향의 독립된 경로 배열을 반환해야 한다", () => {
      const paths = bishop.getPotentialPaths();
      expect(paths).toHaveLength(4);
    });

    it("구석(0,0)에 있을 때 유효한 대각선 경로는 1개여야 한다", () => {
      const cornerBishop = new Bishop(2, "black", { row: 0, col: 0 });
      const validPaths = cornerBishop.getPotentialPaths().filter((p) => p.length > 0);
      expect(validPaths).toHaveLength(1);
    });
  });

  describe("clone()", () => {
    it("정확히 복제되어야 하며 원본 객체와 독립적이어야 한다", () => {
      const cloned = bishop.clone();
      expect(cloned).not.toBe(bishop);
      expect(cloned.type).toBe("bishop");
    });
  });
});
