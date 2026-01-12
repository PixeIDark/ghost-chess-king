import { Queen } from "./Queen";

describe("Queen", () => {
  let queen: Queen;

  beforeEach(() => {
    queen = new Queen(1, "white", { row: 4, col: 4 });
  });

  describe("getAttackPaths()", () => {
    it("8개 방향(직선 4개 + 대각선 4개)의 공격 경로 배열을 반환해야 한다", () => {
      const paths = queen.getAttackPaths();
      expect(paths).toHaveLength(8);
      paths.forEach((path) => {
        expect(path.length).toBeGreaterThan(0);
      });
    });

    it("getPotentialPaths()와 동일한 경로를 반환해야 한다", () => {
      const attackPaths = queen.getAttackPaths();
      const potentialPaths = queen.getPotentialPaths();
      expect(attackPaths).toEqual(potentialPaths);
    });
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
