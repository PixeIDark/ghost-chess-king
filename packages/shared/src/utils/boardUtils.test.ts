import { isValidPosition, isSamePosition, getDistance, includesPosition } from "./boardUtils";
import { Position } from "../types";

describe("isValidPosition", () => {
  test("유효한 위치인지 확인", () => {
    expect(isValidPosition({ row: 0, col: 0 }, 8, 8)).toBe(true);
    expect(isValidPosition({ row: 7, col: 7 }, 8, 8)).toBe(true);
    expect(isValidPosition({ row: 3, col: 5 }, 8, 8)).toBe(true);
  });

  test("범위를 벗어난 위치는 false 반환", () => {
    expect(isValidPosition({ row: -1, col: 0 }, 8, 8)).toBe(false);
    expect(isValidPosition({ row: 0, col: -1 }, 8, 8)).toBe(false);
    expect(isValidPosition({ row: 8, col: 0 }, 8, 8)).toBe(false);
    expect(isValidPosition({ row: 0, col: 8 }, 8, 8)).toBe(false);
  });
});

describe("isSamePosition", () => {
  test("같은 위치인지 확인", () => {
    expect(isSamePosition({ row: 0, col: 0 }, { row: 0, col: 0 })).toBe(true);
    expect(isSamePosition({ row: 5, col: 3 }, { row: 5, col: 3 })).toBe(true);
  });

  test("다른 위치는 false 반환", () => {
    expect(isSamePosition({ row: 0, col: 0 }, { row: 0, col: 1 })).toBe(false);
    expect(isSamePosition({ row: 0, col: 0 }, { row: 1, col: 0 })).toBe(false);
    expect(isSamePosition({ row: 3, col: 4 }, { row: 4, col: 3 })).toBe(false);
  });
});

describe("getDistance", () => {
  test("두 위치 사이의 체비셰프 거리 계산", () => {
    expect(getDistance({ row: 0, col: 0 }, { row: 0, col: 0 })).toBe(0);
    expect(getDistance({ row: 0, col: 0 }, { row: 3, col: 4 })).toBe(4);
    expect(getDistance({ row: 2, col: 3 }, { row: 5, col: 1 })).toBe(3);
    expect(getDistance({ row: 1, col: 1 }, { row: 4, col: 4 })).toBe(3);
  });
});

describe("includesPosition", () => {
  const positions: Position[] = [
    { row: 0, col: 0 },
    { row: 3, col: 5 },
    { row: 7, col: 7 },
  ];

  test("배열에 포함된 위치는 true 반환", () => {
    expect(includesPosition(positions, { row: 0, col: 0 })).toBe(true);
    expect(includesPosition(positions, { row: 3, col: 5 })).toBe(true);
    expect(includesPosition(positions, { row: 7, col: 7 })).toBe(true);
  });

  test("배열에 없는 위치는 false 반환", () => {
    expect(includesPosition(positions, { row: 1, col: 1 })).toBe(false);
    expect(includesPosition(positions, { row: 0, col: 1 })).toBe(false);
    expect(includesPosition(positions, { row: 5, col: 5 })).toBe(false);
  });

  test("빈 배열은 항상 false 반환", () => {
    expect(includesPosition([], { row: 0, col: 0 })).toBe(false);
  });
});
