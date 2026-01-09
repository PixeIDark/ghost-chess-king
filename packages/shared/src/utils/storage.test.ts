/**
 * @jest-environment jsdom
 */
import { saveLocalStorage, loadLocalStorage } from "./storage";

describe("saveLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("값을 저장해야 하는지", () => {
    saveLocalStorage("key", { name: "test" });

    expect(localStorage.getItem("key")).toBe('{"name":"test"}');
  });

  test("에러 발생 시 콘솔 에러를 출력하는지", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    jest.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
      throw new Error("Storage full");
    });

    saveLocalStorage("key", "value");

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe("loadLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("저장된 값을 불러오는지", () => {
    localStorage.setItem("key", '{"name":"test"}');

    expect(loadLocalStorage("key")).toEqual({ name: "test" });
  });

  test("값이 없으면 null을 반환하는지", () => {
    expect(loadLocalStorage("nonexistent")).toBeNull();
  });

  test("에러 발생 시 null을 반환하는지", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    jest.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => {
      throw new Error("Read error");
    });

    expect(loadLocalStorage("key")).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
