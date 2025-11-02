// @ts-check

/**
 * Deterministic pseudo random number generator using mulberry32.
 * @param {number} seed
 */
export function createRng(seed) {
  let s = seed >>> 0;
  return {
    /**
     * @returns {number}
     */
    next() {
      s += 0x6d2b79f5;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    /**
     * @param {number} min
     * @param {number} max
     */
    range(min, max) {
      return min + (max - min) * this.next();
    },
    /**
     * @returns {number}
     */
    seed() {
      return s;
    }
  };
}

export class Vec2 {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * @param {Vec2} other
   */
  copy(other) {
    this.x = other.x;
    this.y = other.y;
    return this;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  add(x, y) {
    this.x += x;
    this.y += y;
    return this;
  }

  /**
   * @param {number} s
   */
  scale(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  length() {
    return Math.hypot(this.x, this.y);
  }

  normalize() {
    const len = this.length();
    if (len > 1e-5) {
      this.scale(1 / len);
    }
    return this;
  }
}

export class Rect {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   */
  constructor(x = 0, y = 0, w = 0, h = 0) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  /**
   * @param {Rect} other
   */
  copy(other) {
    this.x = other.x;
    this.y = other.y;
    this.w = other.w;
    this.h = other.h;
    return this;
  }

  /**
   * @param {number} px
   * @param {number} py
   */
  contains(px, py) {
    return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h;
  }
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * @param {number} a
 * @param {number} b
 * @param {number} t
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}
