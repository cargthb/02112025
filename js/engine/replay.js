// @ts-check

import { createRng } from "./math.js";

/**
 * @typedef {{frame:number, actions:Record<string,boolean>}} ReplayFrame
 */

export class ReplayRecorder {
  constructor() {
    /** @type {ReplayFrame[]} */
    this.frames = [];
    this.seed = 123456789;
  }

  /**
   * @param {number} seed
   */
  reset(seed) {
    this.frames.length = 0;
    this.seed = seed;
  }

  /**
   * @param {number} frame
   * @param {Record<string, boolean>} actions
   */
  record(frame, actions) {
    this.frames.push({ frame, actions: { ...actions } });
  }
}

export class ReplayPlayer {
  constructor() {
    /** @type {ReplayFrame[]} */
    this.frames = [];
    this.pointer = 0;
    this.seed = 0;
    this.rng = createRng(0);
  }

  /**
   * @param {ReplayRecorder} recorder
   */
  load(recorder) {
    this.frames = recorder.frames.slice();
    this.pointer = 0;
    this.seed = recorder.seed;
    this.rng = createRng(this.seed);
  }

  /**
   * @param {number} frame
   */
  frameActions(frame) {
    while (this.pointer < this.frames.length && this.frames[this.pointer].frame < frame) {
      this.pointer++;
    }
    if (this.pointer >= this.frames.length) return {};
    const data = this.frames[this.pointer];
    if (data.frame === frame) return data.actions;
    return {};
  }
}
