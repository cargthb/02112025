// @ts-check

export class Hazard {
  constructor(type, x, y, extra = {}) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.extra = extra;
    this.timer = 0;
  }

  update(dt) {
    this.timer += dt;
    if (this.type === "moving" && this.extra?.path) {
      const path = this.extra.path;
      const speed = this.extra.speed || 40;
      if (typeof this.extra.index !== "number") this.extra.index = 0;
      const start = path[this.extra.index];
      const end = path[(this.extra.index + 1) % path.length];
      if (!start || !end) return;
      const dx = end[0] - start[0];
      const dy = end[1] - start[1];
      const dist = Math.hypot(dx, dy) || 1;
      const step = speed * dt;
      const progress = (this.extra.progress || 0) + step / dist;
      if (progress >= 1) {
        this.extra.index = (this.extra.index + 1) % path.length;
        this.extra.progress = 0;
        this.x = end[0];
        this.y = end[1];
      } else {
        this.extra.progress = progress;
        this.x = start[0] + dx * progress;
        this.y = start[1] + dy * progress;
      }
    }
  }
}

export function checkHazards(player, hazards) {
  const body = player.body;
  for (const hazard of hazards) {
    const dx = Math.abs(body.position.x - hazard.x);
    const dy = Math.abs(body.position.y - hazard.y);
    if (dx < 14 && dy < 14) {
      player.hearts = Math.max(0, player.hearts - 1);
    }
  }
}
