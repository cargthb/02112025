// @ts-check

export class LevelSelectScene {
  constructor(app) {
    this.app = app;
    this.selection = 0;
  }

  enter() {
    this.selection = this.app.save.currentLevel || 0;
  }

  update(dt) {
    const maxIndex = Math.max(0, this.app.levels.length - 1);
    if (this.app.input.isPressed("left")) this.selection = Math.max(0, this.selection - 1);
    if (this.app.input.isPressed("right")) this.selection = Math.min(maxIndex, this.selection + 1);
    const unlocked = Math.max(0, this.app.save.currentLevel);
    if (this.selection > unlocked) this.selection = unlocked;
    if (this.app.input.isPressed("jump") && this.selection <= unlocked) {
      this.app.changeScene("game", { levelIndex: this.selection, runEnter: true });
    }
    if (this.app.input.isPressed("back")) {
      this.app.changeScene("title");
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "#1c2b3a";
    ctx.fillRect(0, 0, 320, 180);
    ctx.fillStyle = "#eceff4";
    ctx.font = "10px monospace";
    ctx.fillText("Select Level", 100, 40);
    const unlocked = Math.max(0, this.app.save.currentLevel);
    for (let i = 0; i < this.app.levels.length; i++) {
      const y = 80 + i * 24;
      const active = i === this.selection;
      const lock = i > unlocked ? " (Locked)" : "";
      ctx.fillStyle = active ? "#ffd166" : i > unlocked ? "#4e4e7a" : "#eceff4";
      ctx.fillText(`${i + 1}. ${this.app.levels[i].name}${lock}`, 60, y);
    }
    ctx.restore();
  }
}
