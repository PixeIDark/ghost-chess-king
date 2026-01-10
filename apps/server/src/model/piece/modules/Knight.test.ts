import { Knight } from "./Knight";

describe("Knight", () => {
  let knight: Knight;

  beforeEach(() => {
    knight = new Knight(1, "white", { row: 4, col: 4 });
  });

  describe("getPotentialPaths()", () => {
    it("8개의 L자 점프 좌표를 각각 별도의 배열(길이 1)로 반환해야 한다", () => {
      const paths = knight.getPotentialPaths();
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
