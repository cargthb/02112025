// @ts-check

export const palettes = {
  default: [
    "#0d0d1a",
    "#1c2b3a",
    "#3b4252",
    "#88c0d0",
    "#eceff4",
    "#ffd166",
    "#ef476f",
    "#06d6a0"
  ],
  colorblind: [
    "#1b1b2f",
    "#4e4e7a",
    "#7f7f9c",
    "#ffd166",
    "#f6f5f5",
    "#06d6a0",
    "#ff8360",
    "#33658a"
  ]
};

/**
 * @param {string[]} palette
 * @returns {Map<string, string>}
 */
export function createShadeMap(palette) {
  const map = new Map();
  for (let i = 0; i < palette.length; i++) {
    map.set(`c${i}`, palette[i]);
  }
  return map;
}

/**
 * @param {string} color
 * @param {number} alpha
 */
export function withAlpha(color, alpha) {
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
