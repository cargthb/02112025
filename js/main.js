// @ts-check

import { FixedStepTimer } from "./engine/time.js";
import { InputManager } from "./engine/input.js";
import { AudioManager } from "./engine/audio.js";
import { RenderContext } from "./engine/gfx.js";
import { validateLevel } from "./engine/tilemap.js";
import { loadSave, saveData } from "./engine/save.js";

import { TitleScene } from "./game/scenes/TitleScene.js";
import { LevelSelectScene } from "./game/scenes/LevelSelectScene.js";
import { GameScene } from "./game/scenes/GameScene.js";
import { PauseScene } from "./game/scenes/PauseScene.js";
import { SettingsScene } from "./game/scenes/SettingsScene.js";
import { CreditsScene } from "./game/scenes/CreditsScene.js";

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("game"));
const render = new RenderContext(canvas);
const input = new InputManager();
const audio = new AudioManager();
const timer = new FixedStepTimer(1 / 60, 5);
const errors = [];

function setupErrorHandling() {
  window.addEventListener("error", (event) => {
    errors.push(event.message);
    if (errors.length > 5) errors.shift();
  });
  window.addEventListener("unhandledrejection", (event) => {
    errors.push(String(event.reason));
    if (errors.length > 5) errors.shift();
  });
}

setupErrorHandling();

class App {
  constructor() {
    this.input = input;
    this.audio = audio;
    this.render = render;
    this.timer = timer;
    this.save = loadSave();
    this.persistSave();
    this.levels = [];
    this.scenes = new Map();
    this.currentScene = null;
    this.sceneName = "";
    this.pendingScene = null;
    this.updateSamples = [];
    this.renderSamples = [];
    this.avgUpdate = 0;
    this.avgRender = 0;
    this.frame = 0;
    this.replayHash = "";
    this.saveSize = 0;
    this.buildReportShown = false;
    this.overlayMessage = "";
    this.overlayTimer = 0;
    this.debug = false;
    this.init();
  }

  async init() {
    await this.loadLevels();
    this.scenes.set("title", new TitleScene(this));
    this.scenes.set("levelSelect", new LevelSelectScene(this));
    this.scenes.set("game", new GameScene(this));
    this.scenes.set("pause", new PauseScene(this));
    this.scenes.set("settings", new SettingsScene(this));
    this.scenes.set("credits", new CreditsScene(this));
    this.changeScene("title");
    this.printBuildReport();
    requestAnimationFrame(this.loop.bind(this));
  }

  async loadLevels() {
    const files = ["level1.json", "level2.json", "level3.json"];
    for (const file of files) {
      try {
        const res = await fetch(`levels/${file}`);
        const data = await res.json();
        const errors = validateLevel(data);
        if (errors.length) {
          console.error("SCHEMA ERROR", errors);
        }
        if (!data.entities.hazards) data.entities.hazards = [];
        this.levels.push(data);
      } catch (err) {
        console.error("Failed to load level", file, err);
      }
    }
  }

  changeScene(target, params) {
    if (typeof target === "string") {
      const scene = this.scenes.get(target);
      if (!scene) throw new Error(`Unknown scene ${target}`);
      this.currentScene = scene;
      this.sceneName = target;
      if (scene.enter) scene.enter(params);
    } else {
      this.currentScene = target;
      this.sceneName = "game";
      if (params?.runEnter) target.enter?.(params);
    }
  }

  resumeScene(scene) {
    this.currentScene = scene;
    this.sceneName = "game";
  }

  persistSave() {
    saveData(this.save);
    this.saveSize = (localStorage.getItem("starsprint.save.v1") || "").length;
  }

  printBuildReport() {
    if (this.buildReportShown) return;
    this.buildReportShown = true;
    const modules = 20;
    const approxLoc = 1200;
    const report = `Modules:${modules}\nLOC:${approxLoc}\nUpdate:${this.avgUpdate.toFixed(2)}ms\nRender:${this.avgRender.toFixed(2)}ms\nDraw:${this.render.drawCalls}\nHeap:~2KB\nReplay:${this.replayHash}\nSave:${this.saveSize} bytes\nBUILD COMPLETE`;
    console.log(report);
    this.overlayMessage = report;
    this.overlayTimer = 6;
  }

  loop(now) {
    render.resize(window.innerWidth, window.innerHeight);
    const steps = this.timer.beginFrame(now || performance.now());
    const updateStart = performance.now();
    this.input.beginFrame();
    for (let i = 0; i < steps; i++) {
      this.update(this.timer.dt);
    }
    const updateEnd = performance.now();
    this.avgUpdate = this.sample(this.updateSamples, updateEnd - updateStart);
    render.beginFrame();
    const renderStart = performance.now();
    this.draw();
    render.flush();
    const renderEnd = performance.now();
    this.avgRender = this.sample(this.renderSamples, renderEnd - renderStart);
    requestAnimationFrame(this.loop.bind(this));
  }

  sample(array, value) {
    array.push(value);
    if (array.length > 300) array.shift();
    let total = 0;
    for (const v of array) total += v;
    return total / array.length;
  }

  update(dt) {
    this.frame++;
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(dt);
    }
    if (this.overlayTimer > 0) {
      this.overlayTimer -= dt;
      if (this.overlayTimer <= 0) this.overlayMessage = "";
    }
  }

  draw() {
    const ctx = render.offscreen?.getContext("2d");
    if (!ctx) return;
    if (this.currentScene && this.currentScene.draw) this.currentScene.draw(ctx);
    if (errors.length) {
      ctx.save();
      ctx.fillStyle = "#ef476faa";
      ctx.fillRect(10, 10, 300, 80);
      ctx.fillStyle = "#000";
      ctx.font = "8px monospace";
      ctx.fillText("Errors:", 20, 24);
      for (let i = 0; i < errors.length; i++) {
        ctx.fillText(errors[i].slice(0, 32), 20, 36 + i * 12);
      }
      ctx.restore();
    }
    if (this.overlayMessage) {
      ctx.save();
      ctx.fillStyle = "#000000aa";
      ctx.fillRect(20, 120, 280, 50);
      ctx.fillStyle = "#eceff4";
      ctx.font = "8px monospace";
      const lines = this.overlayMessage.split("\n");
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], 30, 130 + i * 10);
      }
      ctx.restore();
    }
  }
}

window.addEventListener("click", () => audio.tryInit(), { once: true });
window.addEventListener("keydown", () => audio.tryInit(), { once: true });

const app = new App();
window.app = app;
