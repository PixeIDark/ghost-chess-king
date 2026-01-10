import { Rook } from "./Rook";

describe("Rook", () => {
  let rook: Rook;

  beforeEach(() => {
    rook = new Rook(1, "white", { row: 4, col: 4 });
  });

  describe("getPotentialPaths()", () => {
    it("상, 하, 좌, 우 4개 방향의 독립된 경로 배열을 반환해야 한다", () => {
      const paths = rook.getPotentialPaths();
      expect(paths).toHaveLength(4);
      paths.forEach((path) => {
        expect(path.length).toBeGreaterThan(0);
      });
    });

    it("보드 끝(0,0)에 위치할 때 유효한 직선 경로는 2개(우, 하)여야 한다", () => {
      const cornerRook = new Rook(2, "white", { row: 0, col: 0 });
      const validPaths = cornerRook.getPotentialPaths().filter((p) => p.length > 0);
      expect(validPaths).toHaveLength(2);
    });
  });

  describe("clone()", () => {
    it("동일한 속성을 갖지만 참조가 다른 깊은 복사본을 생성해야 한다", () => {
      const cloned = rook.clone();
      expect(cloned).not.toBe(rook); // 참조 비교
      expect(cloned.id).toBe(rook.id);
      expect(cloned.position).toEqual(rook.position);
      expect(cloned.hasMoved).toBe(rook.hasMoved);
      expect(cloned instanceof Rook).toBe(true);
    });
  });
});
