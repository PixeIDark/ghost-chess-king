import { formatKoreanTime } from "./formatter";

describe("formatKoreanTime", () => {
  test("타임스탬프를 한국어 시간 형식으로 변환해야 한다", () => {
    const timestamp = new Date("2024-01-15T14:30:00").getTime();
    const result = formatKoreanTime(timestamp);

    expect(result).toMatch(/오후 0?2:30/);
  });

  test("오전 시간을 올바르게 표시해야 한다", () => {
    const timestamp = new Date("2024-01-15T09:05:00").getTime();
    const result = formatKoreanTime(timestamp);

    expect(result).toMatch(/오전 0?9:05/);
  });

  test("자정을 올바르게 표시해야 한다", () => {
    const timestamp = new Date("2024-01-15T00:00:00").getTime();
    const result = formatKoreanTime(timestamp);

    expect(result).toMatch(/오전 12:00/);
  });

  test("정오를 올바르게 표시해야 한다", () => {
    const timestamp = new Date("2024-01-15T12:00:00").getTime();
    const result = formatKoreanTime(timestamp);

    expect(result).toMatch(/오후 12:00/);
  });
});
