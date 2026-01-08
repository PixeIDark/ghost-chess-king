export const pipe = (value: unknown, ...fns: Array<(a: unknown) => unknown>) => {
  return fns.reduce((acc, fn) => fn(acc), value);
};
