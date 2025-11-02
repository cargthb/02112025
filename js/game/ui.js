// @ts-check

export class HUD {
  constructor() {
    this.debug = false;
    this.fps = 0;
    this.updateMs = 0;
    this.renderMs = 0;
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {import("./player.js").Player} player
   * @param {{levelName:string,time:number}} meta
   */
  draw(ctx, player, meta) {
    ctx.save();
    ctx.fillStyle = "#000000aa";
    ctx.fillRect(0, 0, 320, 20);
    ctx.fillStyle = "#eceff4";
    ctx.font = "8px monospace";
    ctx.fillText(`Hearts: ${player.hearts}`, 6, 10);
    ctx.fillText(`Coins: ${player.coins}`, 90, 10);
    ctx.fillText(`Stars: ${player.stars}`, 160, 10);
    ctx.fillText(`${meta.levelName}`, 230, 10);
    ctx.fillText(`Time: ${meta.time.toFixed(2)}`, 6, 18);
    if (this.debug) {
      ctx.fillText(`FPS: ${this.fps.toFixed(0)} U:${this.updateMs.toFixed(2)} R:${this.renderMs.toFixed(2)}`, 6, 28);
    }
    ctx.restore();
  }
}
