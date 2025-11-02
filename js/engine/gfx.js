// @ts-check

import { clamp, lerp } from "./math.js";

const INTERNAL_WIDTH = 320;
const INTERNAL_HEIGHT = 180;

export class RenderContext {
  constructor(canvas) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    this.ctx = ctx;
    this.offscreen = null;
    this.pixelRatio = 1;
    this.camera = {
      x: 0,
      y: 0,
      shake: 0,
      lookAhead: 0,
      deadZone: { x: 80, y: 40 }
    };
    this.scale = 1;
    this.layers = [];
    this.drawCalls = 0;
  }

  resize(width, height) {
    const ratio = Math.min(Math.floor(width / INTERNAL_WIDTH), Math.floor(height / INTERNAL_HEIGHT));
    this.scale = Math.max(1, ratio);
    this.canvas.width = INTERNAL_WIDTH * this.scale;
    this.canvas.height = INTERNAL_HEIGHT * this.scale;
    this.ctx.imageSmoothingEnabled = false;
    if (this.offscreen && this.offscreen.width !== INTERNAL_WIDTH) this.offscreen = null;
    if (!this.offscreen) {
      this.offscreen = document.createElement("canvas");
      this.offscreen.width = INTERNAL_WIDTH;
      this.offscreen.height = INTERNAL_HEIGHT;
    }
  }

  beginFrame() {
    if (!this.offscreen) return;
    const ctx = this.offscreen.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
    this.drawCalls = 0;
    this.layers.length = 0;
  }

  addLayer(drawFn, depth = 0) {
    this.layers.push({ drawFn, depth });
  }

  flush() {
    if (!this.offscreen) return;
    const ctx = this.offscreen.getContext("2d");
    if (!ctx) return;
    this.layers.sort((a, b) => a.depth - b.depth);
    for (const layer of this.layers) {
      layer.drawFn(ctx);
    }
    this.drawCalls += this.layers.length + 1;
    this.ctx.save();
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.drawImage(this.offscreen, 0, 0, INTERNAL_WIDTH * this.scale, INTERNAL_HEIGHT * this.scale);
    this.ctx.restore();
  }

  worldToScreen(x, y) {
    return [Math.round(x - this.camera.x), Math.round(y - this.camera.y)];
  }

  setCamera(target, levelBounds, dt) {
    const dz = this.camera.deadZone;
    const targetX = lerp(this.camera.x, clamp(target.x - INTERNAL_WIDTH / 2 + this.camera.lookAhead, 0, levelBounds.w - INTERNAL_WIDTH), dt * 10);
    const targetY = lerp(this.camera.y, clamp(target.y - INTERNAL_HEIGHT / 2, 0, levelBounds.h - INTERNAL_HEIGHT), dt * 10);
    this.camera.x = clamp(targetX, 0, Math.max(0, levelBounds.w - INTERNAL_WIDTH));
    this.camera.y = clamp(targetY, 0, Math.max(0, levelBounds.h - INTERNAL_HEIGHT));
  }
}

export const SCREEN = { width: INTERNAL_WIDTH, height: INTERNAL_HEIGHT };
