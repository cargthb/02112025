// @ts-check

export class TitleScene {
  constructor(app) {
    this.app = app;
    this.time = 0;
    this.logoScale = 1;
    this.audioPromptShown = false;
  }

  enter() {
    this.time = 0;
  }

  update(dt) {
    this.time += dt;
    if (!this.audioPromptShown && this.app.audio.settings.enabled) {
      this.audioPromptShown = true;
    }
    if (this.app.input.isPressed("jump")) {
      this.app.changeScene("levelSelect");
    }
    if (this.app.input.isPressed("up")) {
      this.app.changeScene("settings");
    }
    if (this.app.input.isPressed("down")) {
      this.app.changeScene("credits");
    }
    if (location.hash === "#test") {
      this.app.changeScene("game", { levelIndex: 0, testMode: true });
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "#0d0d1a";
    ctx.fillRect(0, 0, 320, 180);
    ctx.fillStyle = "#ffd166";
    ctx.font = "20px monospace";
    ctx.fillText("STARSPRINT", 60, 90);
    ctx.font = "8px monospace";
    ctx.fillText("Press Jump", 120, 120);
    ctx.fillText("Up: Settings  Down: Credits", 80, 140);
    if (!this.app.audio.settings.enabled) {
      ctx.fillText("Tap to enable audio", 90, 150);
    }
    ctx.restore();
  }
}
