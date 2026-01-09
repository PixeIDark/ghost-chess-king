import { delay } from "./helper";

test("delay 함수가 1000ms 동안 대기하는지", async () => {
  const start = Date.now();
  const waitTime = 1000;

  await delay(waitTime);

  const end = Date.now();
  const diff = end - start;

  expect(diff).toBeGreaterThanOrEqual(waitTime);
});
