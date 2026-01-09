import { pipe } from "./pipe";

describe("pipe", () => {
  test("함수를 순차적으로 적용하는지", () => {
    const double = (x: unknown) => (x as number) * 2;
    const addTen = (x: unknown) => (x as number) + 10;

    expect(pipe(5, double, addTen)).toBe(20);
  });

  test("함수가 없으면 초기값을 반환하는지", () => {
    expect(pipe(42)).toBe(42);
  });

  test("여러 타입을 처리할 수 있는지", () => {
    const toUpper = (s: unknown) => (s as string).toUpperCase();
    const addMark = (s: unknown) => (s as string) + "!";

    expect(pipe("hello", toUpper, addMark)).toBe("HELLO!");
  });
});
