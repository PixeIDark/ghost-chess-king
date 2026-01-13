import { Knight } from "./Knight";

describe("Knight", () => {
  let knight: Knight;
  const maxRow = 8;
  const maxCol = 8;

  beforeEach(() => {
    knight = new Knight(1, "white", { row: 4, col: 4 });
  });

  describe("getAttackPaths()", () => {
    it("최대 8개의 L자 형태 공격 경로를 반환해야 한다", () => {
      const paths = knight.getAttackPaths(maxRow, maxCol);
      expect(paths.length).toBeLessThanOrEqual(8);
      paths.forEach((path) => {
        expect(path).toHaveLength(1);
      });
    });

    it("getPotentialPaths()와 동일한 경로를 반환해야 한다", () => {
      const attackPaths = knight.getAttackPaths(maxRow, maxCol);
      const potentialPaths = knight.getPotentialPaths(maxRow, maxCol);
      expect(attackPaths).toEqual(potentialPaths);
    });
  });

  describe("getPotentialPaths()", () => {
    it("8개의 L자 점프 좌표를 각각 별도의 배열(길이 1)로 반환해야 한다", () => {
      const paths = knight.getPotentialPaths(maxRow, maxCol);
      expect(paths).toHaveLength(8);
      paths.forEach((p) => expect(p).toHaveLength(1));
    });
  });

  describe("clone()", () => {
    it("속성이 복제된 새로운 Knight 인스턴스를 반환해야 한다", () => {
      const cloned = knight.clone();
      expect(cloned).not.toBe(knight);
      expect(cloned.id).toBe(1);
    });
  });
});
