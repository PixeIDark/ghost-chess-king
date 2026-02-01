import { ChessTimer } from "./ChessTimer";

describe("ChessTimer 테스트", () => {
  let timer: ChessTimer;
  const initialTime = 60000;
  const incrementTime = 5000;

  beforeEach(() => {
    jest.useFakeTimers();
    timer = new ChessTimer(initialTime, incrementTime);
  });

  afterEach(() => {
    timer.stop();
    jest.clearAllTimers();
  });

  test("초기 시간이 올바르게 설정되어야 한다", () => {
    const time = timer.getTime();
    expect(time.whiteTime).toBe(initialTime);
    expect(time.blackTime).toBe(initialTime);
  });

  test("start 후 시간이 감소해야 한다", () => {
    timer.start("white");
    jest.advanceTimersByTime(1000);

    const time = timer.getTime();
    expect(time.whiteTime).toBeLessThan(initialTime);
    expect(time.blackTime).toBe(initialTime);
  });

  test("switchTurn 시 현재 턴 유저에게 incrementTime이 추가되어야 한다", () => {
    timer.start("white");
    timer.switchTurn("black");

    const time = timer.getTime();
    expect(time.whiteTime).toBe(initialTime + incrementTime);
    expect(time.blackTime).toBe(initialTime);
  });

  test("시간이 0이 되면 timeout 이벤트가 발생해야 한다", () => {
    const timeoutSpy = jest.fn();
    timer.on("timeout", timeoutSpy);
    timer.start("white");
    jest.advanceTimersByTime(initialTime + 100);

    expect(timeoutSpy).toHaveBeenCalledWith({ loser: "white" });
  });

  test("timeUpdate 이벤트가 주기적으로 발생해야 한다", () => {
    const updateSpy = jest.fn();
    timer.on("timeUpdate", updateSpy);
    timer.start("white");
    jest.advanceTimersByTime(100);

    expect(updateSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        whiteTime: expect.any(Number),
        blackTime: initialTime,
      })
    );
  });

  test("stop 호출 시 타이머가 멈춰야 한다", () => {
    timer.start("white");
    timer.stop();

    const timeBefore = timer.getTime();
    jest.advanceTimersByTime(1000);
    const timeAfter = timer.getTime();

    expect(timeBefore.whiteTime).toBe(timeAfter.whiteTime);
  });
});
