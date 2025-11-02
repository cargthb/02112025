// @ts-check

import { clamp } from "./math.js";

/**
 * Physics constants.
 */
export const PhysicsConfig = {
  gravity: 900,
  maxFall: 480,
  runSpeed: 90,
  jumpSpeed: 240,
  airControl: 0.6,
  friction: 12,
  drag: 0.92,
  coyoteTimeMs: 100,
  jumpBufferMs: 100
};

/**
 * @typedef {{x:number,y:number,w:number,h:number,solid:boolean,oneWay?:boolean}} Tile
 */

/**
 * @typedef {{tiles:Tile[], width:number, height:number, tileSize:number}} CollisionGrid
 */

export class Body {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.bounds = { x: 0, y: 0, w: 14, h: 30 };
    this.grounded = false;
    this.coyoteTimer = 0;
    this.jumpBuffer = 0;
    this.onWall = 0;
  }
}

/**
 * @param {Body} body
 * @param {CollisionGrid} grid
 * @param {number} dt
 */
export function integrate(body, grid, dt) {
  body.onWall = 0;
  body.velocity.y = clamp(body.velocity.y + PhysicsConfig.gravity * dt, -PhysicsConfig.jumpSpeed, PhysicsConfig.maxFall);
  body.position.x += body.velocity.x * dt;
  resolveAxis(body, grid, "x");
  body.position.y += body.velocity.y * dt;
  resolveAxis(body, grid, "y");
}

/**
 * @param {Body} body
 * @param {CollisionGrid} grid
 * @param {"x"|"y"} axis
 */
function resolveAxis(body, grid, axis) {
  const tiles = grid.tiles;
  const sign = Math.sign(body.velocity[axis]);
  for (const tile of tiles) {
    if (!tile.solid) continue;
    if (axis === "y" && tile.oneWay && body.velocity.y < 0) continue;
    const intersects = intersectsTile(body, tile);
    if (!intersects) continue;
    if (axis === "x") {
      if (sign > 0) {
        body.position.x = tile.x - body.bounds.w;
      } else if (sign < 0) {
        body.position.x = tile.x + tile.w;
      }
      body.velocity.x = 0;
      body.onWall = sign;
    } else {
      if (body.velocity.y > 0) {
        if (tile.oneWay && body.position.y + body.bounds.h - tile.y < 0) continue;
        body.position.y = tile.y - body.bounds.h;
        body.velocity.y = 0;
        body.grounded = true;
        body.coyoteTimer = PhysicsConfig.coyoteTimeMs;
      } else {
        body.position.y = tile.y + tile.h;
        body.velocity.y = 0;
      }
    }
  }
}

/**
 * @param {Body} body
 * @param {Tile} tile
 */
function intersectsTile(body, tile) {
  const ax1 = body.position.x + body.bounds.x;
  const ay1 = body.position.y + body.bounds.y;
  const ax2 = ax1 + body.bounds.w;
  const ay2 = ay1 + body.bounds.h;
  const bx1 = tile.x;
  const by1 = tile.y;
  const bx2 = bx1 + tile.w;
  const by2 = by1 + tile.h;
  return ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1;
}

/**
 * @param {CollisionGrid} grid
 * @param {number} px
 * @param {number} py
 */
export function getTileAt(grid, px, py) {
  for (const tile of grid.tiles) {
    if (!tile.solid) continue;
    if (px >= tile.x && px < tile.x + tile.w && py >= tile.y && py < tile.y + tile.h) {
      return tile;
    }
  }
  return null;
}
