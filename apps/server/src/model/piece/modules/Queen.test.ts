import { Queen } from "./Queen";

describe("Queen", () => {
  let queen: Queen;

  beforeEach(() => {
    queen = new Queen(1, "white", { row: 4, col: 4 });
  });

  describe("getPotentialPaths()", () => {
    it("직선 4방향과 대각선 4방향을 합쳐 총 8개 방향의 경로를 반환해야 한다", () => {
      const paths = queen.getPotentialPaths();
      expect(paths).toHaveLength(8);
    });

    it("중앙(4,4)에서 퀸이 갈 수 있는 모든 칸의 총합은 27칸이어야 한다", () => {
      const total = queen.getPotentialPaths().reduce((acc, p) => acc + p.length, 0);
      expect(total).toBe(27);
    });
  });

  describe("clone()", () => {
    it("데이터가 동일한 새로운 Queen 객체를 생성해야 한다", () => {
      const cloned = queen.clone();
      expect(cloned instanceof Queen).toBe(true);
      expect(cloned.position).toEqual(queen.position);
    });
  });
});
