// @ts-check

/**
 * Fixed timestep accumulator for deterministic updates.
 */
export class FixedStepTimer {
  /**
   * @param {number} step
   * @param {number} maxCatchUp
   */
  constructor(step = 1 / 60, maxCatchUp = 5) {
    this.step = step;
    this.maxCatchUp = maxCatchUp;
    this.accumulator = 0;
    this.lastTime = 0;
    this.frameDt = 0;
  }

  /**
   * @param {number} now
   */
  beginFrame(now) {
    if (!this.lastTime) {
      this.lastTime = now;
      return 0;
    }
    this.frameDt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    this.accumulator = Math.min(this.accumulator + this.frameDt, this.step * this.maxCatchUp);
    let steps = 0;
    while (this.accumulator >= this.step) {
      this.accumulator -= this.step;
      steps++;
    }
    return steps;
  }

  get alpha() {
    return this.accumulator / this.step;
  }

  get dt() {
    return this.step;
  }

  get frameDelta() {
    return this.frameDt;
  }
}
