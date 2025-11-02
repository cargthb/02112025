// @ts-check

import { Body, integrate } from "../engine/physics.js";

export class Enemy {
  constructor(type, x, y) {
    this.type = type;
    this.body = new Body();
    this.body.position.x = x;
    this.body.position.y = y;
    this.timer = 0;
    this.direction = 1;
    this.active = true;
  }

  /**
   * @param {ReturnType<import("../engine/tilemap.js").buildCollisionGrid>} grid
   * @param {number} dt
   */
  update(grid, dt) {
    this.timer += dt;
    switch (this.type) {
      case "patroller":
        this.body.velocity.x = 40 * this.direction;
        integrate(this.body, grid, dt);
        if (!this.body.grounded) {
          this.direction *= -1;
        }
        break;
      case "flyer":
        this.body.velocity.x = 50 * this.direction;
        this.body.position.y += Math.sin(this.timer * 2) * 10 * dt * 60;
        integrate(this.body, grid, dt);
        if (this.timer > 3) {
          this.direction *= -1;
          this.timer = 0;
        }
        break;
      case "jumper":
        if (this.body.grounded && this.timer > 2) {
          this.body.velocity.y = -200;
          this.body.grounded = false;
          this.timer = 0;
        }
        integrate(this.body, grid, dt);
        break;
      default:
        break;
    }
    this.body.grounded = false;
  }
}
