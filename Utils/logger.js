export const logInfo = (message) => {
  console.log(`\x1b[32m[INFO]\x1b[0m ${message}`);
};
export const logWarn = (message) => {
  console.warn(`\x1b[33m[WARN]\x1b[0m ${message}`);
};
export const logError = (message) => {
  console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`);
};
