// @ts-check

export class CreditsScene {
  constructor(app) {
    this.app = app;
  }

  enter() {}

  update(dt) {
    if (this.app.input.isPressed("back") || this.app.input.isPressed("jump")) {
      this.app.changeScene("title");
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "#0d0d1a";
    ctx.fillRect(0, 0, 320, 180);
    ctx.fillStyle = "#eceff4";
    ctx.font = "12px monospace";
    ctx.fillText("Credits", 120, 60);
    ctx.font = "10px monospace";
    ctx.fillText("Creator: C.RELLA", 90, 100);
    ctx.fillText("Thanks for playing!", 80, 130);
    ctx.restore();
  }
}
