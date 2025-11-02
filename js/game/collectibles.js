// @ts-check

export class Collectible {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.collected = false;
  }
}

export function checkCollectibles(player, collectibles) {
  const body = player.body;
  for (const item of collectibles) {
    if (item.collected) continue;
    const dx = Math.abs(body.position.x - item.x);
    const dy = Math.abs(body.position.y - item.y);
    if (dx < 12 && dy < 12) {
      item.collected = true;
      if (item.type === "coin") player.coins++;
      if (item.type === "star") player.stars++;
    }
  }
}
