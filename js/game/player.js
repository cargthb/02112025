// @ts-check

import { Body, PhysicsConfig, integrate } from "../engine/physics.js";

export class Player {
  constructor() {
    this.body = new Body();
    this.state = "idle";
    this.facing = 1;
    this.jumpGrace = 0;
    this.jumpBuffer = 0;
    this.airTime = 0;
    this.hearts = 3;
    this.coins = 0;
    this.stars = 0;
    this.goalReached = false;
  }

  /**
   * @param {import("../engine/input.js").InputManager} input
   * @param {ReturnType<import("../engine/tilemap.js").buildCollisionGrid>} grid
   * @param {number} dt
   */
  update(input, grid, dt) {
    const body = this.body;
    const move = (input.isDown("right") ? 1 : 0) - (input.isDown("left") ? 1 : 0);
    if (move) this.facing = move;
    body.velocity.x = move * PhysicsConfig.runSpeed;
    if (body.grounded) {
      body.velocity.y = Math.max(0, body.velocity.y);
      this.airTime = 0;
    } else {
      this.airTime += dt;
    }
    if (body.coyoteTimer > 0) body.coyoteTimer -= dt * 1000;
    if (this.jumpBuffer > 0) this.jumpBuffer -= dt * 1000;

    if (input.isPressed("jump")) {
      this.jumpBuffer = PhysicsConfig.jumpBufferMs;
    }

    const canJump = body.grounded || body.coyoteTimer > 0;
    if (this.jumpBuffer > 0 && canJump) {
      body.velocity.y = -PhysicsConfig.jumpSpeed;
      body.grounded = false;
      body.coyoteTimer = 0;
      this.jumpBuffer = 0;
      this.state = "jump";
    }

    if (!input.isDown("jump") && body.velocity.y < 0) {
      body.velocity.y *= 0.6;
    }

    body.grounded = false;
    integrate(body, grid, dt);
    if (!body.grounded) this.state = body.velocity.y < 0 ? "jump" : "fall";
    else this.state = move === 0 ? "idle" : "run";
  }
}
