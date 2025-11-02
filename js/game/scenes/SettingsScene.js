// @ts-check

export class SettingsScene {
  constructor(app) {
    this.app = app;
    this.selection = 0;
    this.options = ["Master", "Music", "SFX", "Colorblind", "Screen Shake", "Back"];
  }

  enter() {
    this.selection = 0;
  }

  update(dt) {
    if (this.app.input.isPressed("up")) this.selection = (this.selection + this.options.length - 1) % this.options.length;
    if (this.app.input.isPressed("down")) this.selection = (this.selection + 1) % this.options.length;
    if (this.app.input.isPressed("left")) this.adjust(-0.1);
    if (this.app.input.isPressed("right")) this.adjust(0.1);
    if (this.app.input.isPressed("back")) {
      this.app.changeScene("title");
    }
    if (this.app.input.isPressed("jump") && this.options[this.selection] === "Back") {
      this.app.changeScene("title");
    }
  }

  adjust(delta) {
    const settings = this.app.save.settings;
    const option = this.options[this.selection];
    if (option === "Master") settings.master = Math.max(0, Math.min(1, settings.master + delta));
    if (option === "Music") settings.music = Math.max(0, Math.min(1, settings.music + delta));
    if (option === "SFX") settings.sfx = Math.max(0, Math.min(1, settings.sfx + delta));
    if (option === "Colorblind" && delta !== 0) settings.colorblind = !settings.colorblind;
    if (option === "Screen Shake" && delta !== 0) settings.screenShake = !settings.screenShake;
    this.app.audio.applySettings(settings);
    this.app.persistSave();
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "#1c2b3a";
    ctx.fillRect(0, 0, 320, 180);
    ctx.fillStyle = "#eceff4";
    ctx.font = "10px monospace";
    ctx.fillText("Settings", 120, 40);
    const settings = this.app.save.settings;
    const values = [
      settings.master.toFixed(1),
      settings.music.toFixed(1),
      settings.sfx.toFixed(1),
      settings.colorblind ? "On" : "Off",
      settings.screenShake ? "On" : "Off",
      ""
    ];
    for (let i = 0; i < this.options.length; i++) {
      const y = 80 + i * 16;
      const active = i === this.selection;
      ctx.fillStyle = active ? "#ffd166" : "#eceff4";
      ctx.fillText(`${this.options[i]} ${values[i]}`, 60, y);
    }
    ctx.restore();
  }
}
