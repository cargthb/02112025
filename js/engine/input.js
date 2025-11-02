// @ts-check

const KEY_BINDINGS = {
  left: ["ArrowLeft", "KeyA"],
  right: ["ArrowRight", "KeyD"],
  up: ["ArrowUp", "KeyW"],
  down: ["ArrowDown", "KeyS"],
  jump: ["Space", "KeyZ", "KeyX", "KeyC", "KeyJ", "KeyK"],
  pause: ["Escape", "KeyP"],
  restart: ["KeyR"],
  back: ["Escape"]
};

/** @typedef {keyof typeof KEY_BINDINGS} ActionName */

/**
 * Unified input manager for keyboard, gamepad, and touch.
 */
export class InputManager {
  constructor() {
    /** @type {Map<ActionName, number>} */
    this.bindings = new Map();
    /** @type {Record<string, boolean>} */
    this.keyState = {};
    /** @type {Record<ActionName, boolean>} */
    this.down = /** @type {any} */ ({});
    this.prev = /** @type {Record<ActionName, boolean>} */ ({});
    /** @type {Record<ActionName, boolean>} */
    this.pressed = /** @type {any} */ ({});
    /** @type {Record<ActionName, boolean>} */
    this.released = /** @type {any} */ ({});
    /** @type {Set<number>} */
    this.activeGamepads = new Set();
    this.touches = {
      left: false,
      right: false,
      jump: false
    };
    this.loadBindings();
    this._setupKeyboard();
    this._setupGamepad();
    this._setupTouch();
  }

  loadBindings() {
    let parsed = {};
    try {
      parsed = JSON.parse(localStorage.getItem("starsprint.controls") || "{}");
    } catch (_) {
      parsed = {};
    }
    /** @type {Record<ActionName, string>} */
    const saved = parsed;
    for (const action in KEY_BINDINGS) {
      const key = /** @type {ActionName} */ (action);
      const value = saved[key];
      this.bindings.set(key, value ? value : KEY_BINDINGS[key][0]);
    }
  }

  saveBindings() {
    const data = {};
    for (const [action, key] of this.bindings) {
      data[action] = key;
    }
    localStorage.setItem("starsprint.controls", JSON.stringify(data));
  }

  /**
   * @param {ActionName} action
   */
  getKeyForAction(action) {
    return this.bindings.get(action) || KEY_BINDINGS[action][0];
  }

  _setupKeyboard() {
    window.addEventListener("keydown", (e) => {
      this.keyState[e.code] = true;
    });
    window.addEventListener("keyup", (e) => {
      this.keyState[e.code] = false;
    });
  }

  _setupGamepad() {
    window.addEventListener("gamepadconnected", (e) => {
      this.activeGamepads.add(e.gamepad.index);
    });
    window.addEventListener("gamepaddisconnected", (e) => {
      this.activeGamepads.delete(e.gamepad.index);
    });
  }

  _setupTouch() {
    const left = document.createElement("div");
    left.className = "touch-left";
    const right = document.createElement("div");
    right.className = "touch-right";
    const jump = document.createElement("div");
    jump.className = "touch-jump";
    const container = document.createElement("div");
    container.className = "touch-container";
    container.append(left, right, jump);
    document.body.appendChild(container);
    const setTouch = (key, value) => {
      this.touches[key] = value;
    };
    const setupButton = (el, key) => {
      el.addEventListener("touchstart", (ev) => {
        ev.preventDefault();
        setTouch(key, true);
      });
      el.addEventListener("touchend", (ev) => {
        ev.preventDefault();
        setTouch(key, false);
      });
      el.addEventListener("touchcancel", (ev) => {
        ev.preventDefault();
        setTouch(key, false);
      });
    };
    setupButton(left, "left");
    setupButton(right, "right");
    setupButton(jump, "jump");
  }

  beginFrame() {
    for (const action in KEY_BINDINGS) {
      const name = /** @type {ActionName} */ (action);
      const prev = this.down[name] || false;
      this.prev[name] = prev;
      const active = this._isActionActive(name);
      this.down[name] = active;
      this.pressed[name] = !prev && active;
      this.released[name] = prev && !active;
    }
  }

  /**
   * @param {ActionName} action
   */
  _isActionActive(action) {
    const key = this.getKeyForAction(action);
    if (this.keyState[key]) return true;
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const pad of pads) {
      if (!pad) continue;
      const horizontal = pad.axes[0] || 0;
      if (action === "left" && horizontal < -0.3) return true;
      if (action === "right" && horizontal > 0.3) return true;
      const buttons = pad.buttons;
      if (action === "jump" && buttons[0]?.pressed) return true;
      if (action === "pause" && buttons[9]?.pressed) return true;
    }
    if (action === "left" && this.touches.left) return true;
    if (action === "right" && this.touches.right) return true;
    if (action === "jump" && this.touches.jump) return true;
    return false;
  }

  /**
   * @param {ActionName} action
   */
  isDown(action) {
    return !!this.down[action];
  }

  /**
   * @param {ActionName} action
   */
  isPressed(action) {
    return !!this.pressed[action];
  }

  /**
   * @param {ActionName} action
   */
  isReleased(action) {
    return !!this.released[action];
  }
}
