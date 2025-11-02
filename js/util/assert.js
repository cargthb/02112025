// @ts-check

/** @type {boolean} */
export const DEBUG = true;

/**
 * @param {boolean} condition
 * @param {string=} message
 */
export function assert(condition, message = "Assertion failed") {
  if (!DEBUG) return;
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * @param {never} value
 * @returns {never}
 */
export function assertUnreachable(value) {
  throw new Error(`Unreachable value: ${String(value)}`);
}
