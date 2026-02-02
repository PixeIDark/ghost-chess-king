import { NICKNAME_PREFIXES, NICKNAME_PROVINCES, NICKNAME_TITLES } from "./nickName";

describe("닉네임 상수 중복 검사", () => {
  test("NICKNAME_PROVINCES 중복 없음", () => {
    expect(new Set(NICKNAME_PROVINCES).size).toBe(NICKNAME_PROVINCES.length);
  });

  test("NICKNAME_PREFIXES 중복 없음", () => {
    expect(new Set(NICKNAME_PREFIXES).size).toBe(NICKNAME_PREFIXES.length);
  });

  test("NICKNAME_TITLES 중복 없음", () => {
    expect(new Set(NICKNAME_TITLES).size).toBe(NICKNAME_TITLES.length);
  });
});
