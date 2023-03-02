module.exports = {
  roots: ["src"],
  testMatch: ["**/__tests__/**/*.+(spec.ts)"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
