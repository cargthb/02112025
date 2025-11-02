// @ts-check

export class PauseScene {
  constructor(app) {
    this.app = app;
    this.returnTo = null;
    this.selection = 0;
    this.options = ["Resume", "Restart", "Exit"];
  }

  enter(params) {
    this.returnTo = params?.returnTo || null;
    this.selection = 0;
    this.app.audio.pauseMusic(true);
  }

  update(dt) {
    if (this.app.input.isPressed("up")) this.selection = (this.selection + this.options.length - 1) % this.options.length;
    if (this.app.input.isPressed("down")) this.selection = (this.selection + 1) % this.options.length;
    if (this.app.input.isPressed("jump")) {
      const choice = this.options[this.selection];
      if (choice === "Resume" && this.returnTo) {
        this.app.audio.pauseMusic(false);
        this.app.resumeScene(this.returnTo);
      }
      if (choice === "Restart" && this.returnTo) {
        this.app.audio.pauseMusic(false);
        this.app.changeScene("game", { levelIndex: this.returnTo.levelIndex, runEnter: true });
      }
      if (choice === "Exit") {
        this.app.audio.pauseMusic(false);
        this.app.changeScene("levelSelect");
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "#000000aa";
    ctx.fillRect(0, 0, 320, 180);
    ctx.fillStyle = "#eceff4";
    ctx.font = "10px monospace";
    ctx.fillText("Paused", 130, 60);
    for (let i = 0; i < this.options.length; i++) {
      const y = 90 + i * 16;
      const active = i === this.selection;
      ctx.fillStyle = active ? "#ffd166" : "#eceff4";
      ctx.fillText(this.options[i], 120, y);
    }
    ctx.restore();
  }
}
