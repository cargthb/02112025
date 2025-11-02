// @ts-check

const KEY = "starsprint.save.v1";

const defaultSave = {
  settings: {
    master: 0.6,
    music: 0.4,
    sfx: 0.7,
    screenShake: true,
    colorblind: false,
    difficulty: "Normal",
    controls: {},
    fps: false
  },
  bestTimes: {},
  coins: 0,
  currentLevel: 0
};

function cloneDefault() {
  return JSON.parse(JSON.stringify(defaultSave));
}

export function loadSave() {
  try {
    const json = localStorage.getItem(KEY);
    if (!json) return cloneDefault();
    const data = JSON.parse(json);
    return { ...cloneDefault(), ...data };
  } catch (err) {
    console.warn("Failed to load save", err);
    return cloneDefault();
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("Failed to save data", err);
  }
}
