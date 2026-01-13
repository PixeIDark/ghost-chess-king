import { ChessTimer } from "@/model/chessTimer/ChessTimer";

describe("ChessTimer", () => {
  let timer: ChessTimer;
  const incrementTime = 3000;
  const initialTime = 10000;

  beforeEach(() => {
    timer = new ChessTimer(incrementTime, initialTime);
    jest.useFakeTimers();
  });

  afterEach(() => {
    timer.stop();
    jest.useRealTimers();
  });

  describe("constructor", () => {
    it("초기 시간과 증분 시간으로 타이머를 생성한다", () => {
      const time = timer.getTime();

      expect(time.whiteTime).toBe(initialTime);
      expect(time.blackTime).toBe(initialTime);
    });
  });

  describe("start()", () => {
    it("지정된 색으로 타이머를 시작한다", () => {
      const listener = jest.fn();
      timer.on("timeUpdate", listener);

      timer.start("white");
      jest.advanceTimersByTime(100);

      expect(listener).toHaveBeenCalled();
    });

    it("시작 후 지정된 색의 시간이 감소한다", () => {
      timer.start("white");
      jest.advanceTimersByTime(1000);

      const time = timer.getTime();
      expect(time.whiteTime).toBeLessThan(initialTime);
      expect(time.blackTime).toBe(initialTime);
    });
  });

  describe("stop()", () => {
    it("타이머를 중지한다", () => {
      const listener = jest.fn();
      timer.on("timeUpdate", listener);

      timer.start("white");
      jest.advanceTimersByTime(100);
      const callCountBefore = listener.mock.calls.length;

      timer.stop();
      jest.advanceTimersByTime(1000);

      expect(listener.mock.calls.length).toBe(callCountBefore);
    });
  });

  describe("switchTurn()", () => {
    it("턴을 전환하고 이전 플레이어에게 증분 시간을 추가한다", () => {
      timer.start("white");
      jest.advanceTimersByTime(1000);

      const timeBefore = timer.getTime();
      timer.switchTurn("black");
      const timeAfter = timer.getTime();

      expect(timeAfter.whiteTime).toBeGreaterThan(timeBefore.whiteTime);
      expect(timeAfter.whiteTime).toBeLessThanOrEqual(timeBefore.whiteTime + incrementTime);
    });

    it("턴 전환 후 새로운 플레이어의 시간이 감소한다", () => {
      timer.start("white");
      jest.advanceTimersByTime(500);

      timer.switchTurn("black");
      const timeBefore = timer.getTime();
      jest.advanceTimersByTime(1000);
      const timeAfter = timer.getTime();

      expect(timeAfter.blackTime).toBeLessThan(timeBefore.blackTime);
      expect(timeAfter.whiteTime).toBe(timeBefore.whiteTime);
    });
  });

  describe("getTime()", () => {
    it("현재 양측의 남은 시간을 반환한다", () => {
      const time = timer.getTime();

      expect(time).toEqual({
        whiteTime: initialTime,
        blackTime: initialTime,
      });
    });

    it("시간이 음수일 때 0을 반환한다", () => {
      timer.start("white");
      jest.advanceTimersByTime(initialTime + 1000);

      const time = timer.getTime();
      expect(time.whiteTime).toBe(0);
    });
  });

  describe("on() / emit()", () => {
    it("timeUpdate 이벤트를 발생시킨다", () => {
      const listener = jest.fn();
      timer.on("timeUpdate", listener);

      timer.start("white");
      jest.advanceTimersByTime(100);

      expect(listener).toHaveBeenCalled();
      expect(listener.mock.calls[0][0]).toHaveProperty("whiteTime");
      expect(listener.mock.calls[0][0]).toHaveProperty("blackTime");
    });

    it("timeout 이벤트를 발생시킨다", () => {
      const listener = jest.fn();
      timer.on("timeout", listener);

      timer.start("white");
      jest.advanceTimersByTime(initialTime + 1000);

      expect(listener).toHaveBeenCalledWith({ loser: "white" });
    });

    it("여러 리스너를 등록할 수 있다", () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      timer.on("timeUpdate", listener1);
      timer.on("timeUpdate", listener2);

      timer.start("white");
      jest.advanceTimersByTime(100);

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });
  });

  describe("off()", () => {
    it("등록된 리스너를 제거한다", () => {
      const listener = jest.fn();
      timer.on("timeUpdate", listener);

      timer.off("timeUpdate", listener);

      timer.start("white");
      jest.advanceTimersByTime(100);

      expect(listener).not.toHaveBeenCalled();
    });

    it("다른 리스너는 영향받지 않는다", () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      timer.on("timeUpdate", listener1);
      timer.on("timeUpdate", listener2);

      timer.off("timeUpdate", listener1);

      timer.start("white");
      jest.advanceTimersByTime(100);

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });
  });

  describe("timeout 처리", () => {
    it("흰색 시간이 0 이하가 되면 타이머를 중지하고 timeout 이벤트를 발생시킨다", () => {
      const timeoutListener = jest.fn();
      const updateListener = jest.fn();

      timer.on("timeout", timeoutListener);
      timer.on("timeUpdate", updateListener);

      timer.start("white");
      jest.advanceTimersByTime(initialTime + 1000);

      expect(timeoutListener).toHaveBeenCalledWith({ loser: "white" });

      const callCountBefore = updateListener.mock.calls.length;
      jest.advanceTimersByTime(1000);
      expect(updateListener.mock.calls.length).toBe(callCountBefore);
    });

    it("검은색 시간이 0 이하가 되면 타이머를 중지하고 timeout 이벤트를 발생시킨다", () => {
      const timeoutListener = jest.fn();

      timer.on("timeout", timeoutListener);

      timer.start("black");
      jest.advanceTimersByTime(initialTime + 1000);

      expect(timeoutListener).toHaveBeenCalledWith({ loser: "black" });
    });
  });

  describe("증분 시간 추가", () => {
    it("턴 전환 시 현재 플레이어에게 증분 시간을 추가한다", () => {
      timer.start("white");
      jest.advanceTimersByTime(5000);

      const timeBefore = timer.getTime();
      const expectedTime = timeBefore.whiteTime + incrementTime;

      timer.switchTurn("black");
      const timeAfter = timer.getTime();

      expect(timeAfter.whiteTime).toBeGreaterThanOrEqual(expectedTime - 100);
      expect(timeAfter.whiteTime).toBeLessThanOrEqual(expectedTime + 100);
    });

    it("검은색 턴에서도 증분 시간을 추가한다", () => {
      timer.start("black");
      jest.advanceTimersByTime(5000);

      const timeBefore = timer.getTime();
      const expectedTime = timeBefore.blackTime + incrementTime;

      timer.switchTurn("white");
      const timeAfter = timer.getTime();

      expect(timeAfter.blackTime).toBeGreaterThanOrEqual(expectedTime - 100);
      expect(timeAfter.blackTime).toBeLessThanOrEqual(expectedTime + 100);
    });
  });

  describe("시간 정확도", () => {
    it("100ms 간격으로 시간을 업데이트한다", () => {
      const listener = jest.fn();
      timer.on("timeUpdate", listener);

      timer.start("white");
      jest.advanceTimersByTime(500);

      expect(listener.mock.calls.length).toBeGreaterThanOrEqual(4);
      expect(listener.mock.calls.length).toBeLessThanOrEqual(6);
    });
  });
});
