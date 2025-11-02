// @ts-check

import { Player } from "../player.js";
import { HUD } from "../ui.js";
import { Enemy } from "../enemies.js";
import { Collectible, checkCollectibles } from "../collectibles.js";
import { Hazard, checkHazards } from "../hazards.js";
import { buildCollisionGrid, drawTileLayer } from "../../engine/tilemap.js";
import { Camera } from "../camera.js";

export class GameScene {
  constructor(app) {
    this.app = app;
    this.player = new Player();
    this.hud = new HUD();
    this.camera = new Camera();
    this.level = null;
    this.levelIndex = 0;
    this.grid = null;
    this.enemies = [];
    this.collectibles = [];
    this.hazards = [];
    this.timer = 0;
    this.testMode = false;
  }

  enter(params) {
    const levelIndex = params?.levelIndex || 0;
    this.levelIndex = levelIndex;
    this.level = this.app.levels[levelIndex];
    this.grid = buildCollisionGrid(this.level);
    this.player.body.position.x = this.level.entities.player.x;
    this.player.body.position.y = this.level.entities.player.y;
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;
    this.camera.position.x = Math.max(0, this.player.body.position.x - 160);
    this.camera.position.y = Math.max(0, this.player.body.position.y - 90);
    this.player.coins = 0;
    this.player.stars = 0;
    this.player.hearts = 3;
    this.player.goalReached = false;
    this.enemies = this.level.entities.enemies.map((e) => new Enemy(e.type, e.x, e.y));
    this.collectibles = this.level.entities.collectibles.map((c) => new Collectible(c.type, c.x, c.y));
    this.hazards = this.level.entities.hazards.map((h) => new Hazard(h.type, h.x, h.y, h.extra));
    this.timer = 0;
    this.testMode = params?.testMode || false;
    this.app.audio.stopMusic();
    this.app.audio.playMusic(this.levelIndex % 3);
  }

  update(dt) {
    if (!this.level || !this.grid) return;
    if (this.app.input.isPressed("pause")) {
      this.app.changeScene("pause", { returnTo: this });
      return;
    }
    this.timer += dt;
    this.player.update(this.app.input, this.grid, dt);
    for (const enemy of this.enemies) enemy.update(this.grid, dt);
    for (const hazard of this.hazards) hazard.update(dt);
    checkCollectibles(this.player, this.collectibles);
    checkHazards(this.player, this.hazards);
    this.camera.update(
      { x: this.player.body.position.x, y: this.player.body.position.y },
      { w: this.level.width * this.level.tileSize, h: this.level.height * this.level.tileSize },
      dt
    );
    if (this.player.hearts <= 0) {
      this.app.changeScene("game", { levelIndex: this.levelIndex, runEnter: true });
      return;
    }
    if (this.player.stars > 0 && this.timer > 1) {
      this.app.save.currentLevel = Math.max(this.app.save.currentLevel, this.levelIndex + 1);
      this.app.persistSave();
      this.app.changeScene("levelSelect");
    }
  }

  draw(ctx) {
    if (!this.level) return;
    ctx.save();
    ctx.translate(-this.camera.position.x, -this.camera.position.y);
    drawTileLayer(ctx, this.level);
    const body = this.player.body;
    ctx.fillStyle = "#ef476f";
    ctx.fillRect(body.position.x, body.position.y, 12, 28);
    ctx.fillStyle = "#ffd166";
    for (const item of this.collectibles) {
      if (item.collected) continue;
      ctx.fillRect(item.x, item.y, 8, 8);
    }
    ctx.fillStyle = "#ef476f";
    for (const enemy of this.enemies) {
      ctx.fillRect(enemy.body.position.x, enemy.body.position.y, 12, 24);
    }
    ctx.fillStyle = "#06d6a0";
    for (const hazard of this.hazards) {
      ctx.fillRect(hazard.x, hazard.y, 16, 16);
    }
    ctx.restore();
    this.hud.debug = this.app.debug;
    this.hud.fps = 60;
    this.hud.updateMs = this.app.avgUpdate;
    this.hud.renderMs = this.app.avgRender;
    this.hud.draw(ctx, this.player, { levelName: this.level.name, time: this.timer });
  }
}
