const base = require("../../jest.config.base.cjs");

module.exports = {
  ...base,
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@ghost-chess-king/shared$": "<rootDir>/../../packages/shared/src/index.ts",
  },
};
