// @ts-check

import { assert } from "../util/assert.js";

/**
 * @param {any} data
 */
export function validateLevel(data) {
  const errors = [];
  const check = (condition, path) => {
    if (!condition) errors.push(path);
  };
  check(typeof data.name === "string", "name");
  check(typeof data.width === "number", "width");
  check(typeof data.height === "number", "height");
  check(typeof data.tileSize === "number", "tileSize");
  check(data.tiles && typeof data.tiles === "object", "tiles");
  if (data.tiles) {
    ["bg", "solid", "oneWay", "hazard"].forEach((key) => {
      check(Array.isArray(data.tiles[key]), `tiles.${key}`);
    });
  }
  check(data.entities && typeof data.entities === "object", "entities");
  check(data.goal && typeof data.goal === "object", "goal");
  return errors;
}

/**
 * @param {any} data
 */
export function buildCollisionGrid(data) {
  const tiles = [];
  const size = data.tileSize;
  const solids = data.tiles.solid || [];
  const oneWay = new Set(data.tiles.oneWay || []);
  for (let i = 0; i < solids.length; i++) {
    const idx = solids[i];
    if (typeof idx !== "number" || idx < 0) continue;
    const x = (idx % data.width) * size;
    const y = Math.floor(idx / data.width) * size;
    tiles.push({ x, y, w: size, h: size, solid: true, oneWay: oneWay.has(idx) });
  }
  return { tiles, width: data.width, height: data.height, tileSize: size };
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {any} level
 */
export function drawTileLayer(ctx, level) {
  const size = level.tileSize;
  const width = level.width;
  ctx.fillStyle = "#1c2b3a";
  ctx.fillRect(0, 0, level.width * size, level.height * size);
  ctx.fillStyle = "#3b4252";
  for (const idx of level.tiles.solid) {
    const x = (idx % width) * size;
    const y = Math.floor(idx / width) * size;
    ctx.fillRect(x, y, size, size);
  }
  ctx.fillStyle = "#ffd166";
  for (const idx of level.tiles.hazard) {
    const x = (idx % width) * size;
    const y = Math.floor(idx / width) * size;
    ctx.fillRect(x, y, size, size);
  }
}
