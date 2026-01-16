import { EventManager } from "./EventManager";

type TestEvents = {
  userLogin: { userId: string; timestamp: number };
  dataUpdate: { value: number };
  message: string;
};

describe("EventManager", () => {
  let eventManager: EventManager<TestEvents>;

  beforeEach(() => {
    eventManager = new EventManager<TestEvents>();
  });

  describe("on", () => {
    test("이벤트 리스너 등록", () => {
      const listener = jest.fn();

      eventManager.on("message", listener);
      eventManager.emit("message", "test");

      expect(listener).toHaveBeenCalledWith("test");
      expect(listener).toHaveBeenCalledTimes(1);
    });

    test("동일 이벤트에 여러 리스너 등록", () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      eventManager.on("message", listener1);
      eventManager.on("message", listener2);
      eventManager.emit("message", "test");

      expect(listener1).toHaveBeenCalledWith("test");
      expect(listener2).toHaveBeenCalledWith("test");
    });

    test("다른 이벤트 타입에 각각 리스너 등록", () => {
      const loginListener = jest.fn();
      const dataListener = jest.fn();

      eventManager.on("userLogin", loginListener);
      eventManager.on("dataUpdate", dataListener);
      eventManager.emit("userLogin", { userId: "user1", timestamp: 123 });

      expect(loginListener).toHaveBeenCalledWith({ userId: "user1", timestamp: 123 });
      expect(dataListener).not.toHaveBeenCalled();
    });
  });

  describe("off", () => {
    test("등록된 리스너 제거", () => {
      const listener = jest.fn();

      eventManager.on("message", listener);
      eventManager.off("message", listener);
      eventManager.emit("message", "test");

      expect(listener).not.toHaveBeenCalled();
    });

    test("특정 리스너만 제거하고 나머지는 유지", () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      eventManager.on("message", listener1);
      eventManager.on("message", listener2);
      eventManager.off("message", listener1);
      eventManager.emit("message", "test");

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledWith("test");
    });

    test("등록되지 않은 리스너 제거 시도해도 오류 없음", () => {
      const listener = jest.fn();

      expect(() => {
        eventManager.off("message", listener);
      }).not.toThrow();
    });

    test("존재하지 않는 이벤트에서 리스너 제거 시도해도 오류 없음", () => {
      const listener = jest.fn();

      expect(() => {
        eventManager.off("message", listener);
      }).not.toThrow();
    });
  });

  describe("emit", () => {
    test("등록된 모든 리스너 호출", () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      const listener3 = jest.fn();

      eventManager.on("dataUpdate", listener1);
      eventManager.on("dataUpdate", listener2);
      eventManager.on("dataUpdate", listener3);
      eventManager.emit("dataUpdate", { value: 42 });

      expect(listener1).toHaveBeenCalledWith({ value: 42 });
      expect(listener2).toHaveBeenCalledWith({ value: 42 });
      expect(listener3).toHaveBeenCalledWith({ value: 42 });
    });

    test("리스너가 없는 이벤트 emit 시 오류 없음", () => {
      expect(() => {
        eventManager.emit("message", "test");
      }).not.toThrow();
    });

    test("복잡한 객체 데이터 전달", () => {
      const listener = jest.fn();
      const loginData = { userId: "user123", timestamp: 1234567890 };

      eventManager.on("userLogin", listener);
      eventManager.emit("userLogin", loginData);

      expect(listener).toHaveBeenCalledWith(loginData);
    });
  });

  describe("clear", () => {
    test("모든 이벤트 리스너 제거", () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      const listener3 = jest.fn();

      eventManager.on("message", listener1);
      eventManager.on("dataUpdate", listener2);
      eventManager.on("userLogin", listener3);

      eventManager.clear();

      eventManager.emit("message", "test");
      eventManager.emit("dataUpdate", { value: 1 });
      eventManager.emit("userLogin", { userId: "user1", timestamp: 123 });

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
      expect(listener3).not.toHaveBeenCalled();
    });

    test("clear 후 새로운 리스너 등록 가능", () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      eventManager.on("message", listener1);
      eventManager.clear();
      eventManager.on("message", listener2);
      eventManager.emit("message", "test");

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledWith("test");
    });

    test("빈 EventManager에서 clear 호출해도 오류 없음", () => {
      expect(() => {
        eventManager.clear();
      }).not.toThrow();
    });
  });
});
