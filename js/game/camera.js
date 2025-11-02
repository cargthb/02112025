// @ts-check

import { clamp, lerp } from "../engine/math.js";

export class Camera {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.lookAhead = 0;
    this.shake = 0;
  }

  /**
   * @param {{x:number,y:number}} target
   * @param {{w:number,h:number}} bounds
   * @param {number} dt
   */
  update(target, bounds, dt) {
    const desiredX = clamp(target.x - 160 + this.lookAhead, 0, Math.max(0, bounds.w - 320));
    const desiredY = clamp(target.y - 90, 0, Math.max(0, bounds.h - 180));
    this.position.x = lerp(this.position.x, desiredX, dt * 5);
    this.position.y = lerp(this.position.y, desiredY, dt * 5);
  }
}
