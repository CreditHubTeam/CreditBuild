// src/core/logger.ts
export const log = (...args: unknown[]): void => {
  // eslint-disable-next-line no-console
  console.log("[app]", ...args);
};
