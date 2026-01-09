import { squareToIndices, indicesToSquare, getOppositeSide } from "./squareUtils";

describe("squareToIndices", () => {
  test("체스 좌표를 인덱스로 변환하는지", () => {
    expect(squareToIndices("a8")).toEqual({ row: 0, col: 0 });
    expect(squareToIndices("h1")).toEqual({ row: 7, col: 7 });
    expect(squareToIndices("e4")).toEqual({ row: 4, col: 4 });
  });
});

describe("indicesToSquare", () => {
  test("인덱스를 체스 좌표로 변환하는지", () => {
    expect(indicesToSquare(0, 0)).toBe("a8");
    expect(indicesToSquare(7, 7)).toBe("h1");
    expect(indicesToSquare(4, 4)).toBe("e4");
  });
});

describe("getOppositeSide", () => {
  test("반대편 색상을 반환하는지", () => {
    expect(getOppositeSide("white")).toBe("black");
    expect(getOppositeSide("black")).toBe("white");
  });
});
