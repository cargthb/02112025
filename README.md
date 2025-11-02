# STARSPRINT

STARSPRINT is a compact HTML5 platformer built to run offline with no external dependencies. Launch the experience by opening `index.html` in any modern browser or by running a lightweight static server such as `npx serve` from the project root.

## Quickstart
1. Download or clone this repository.
2. Double-click `index.html` (or serve locally via `npx serve`).
3. Allow audio on the first key press if prompted.

## Controls
- **Move:** Arrow keys or WASD
- **Jump:** Space / Z / X / C / J / K
- **Pause:** P or Escape
- **Restart Level:** R
- **Gamepad:** D-pad/left stick to move, bottom face button to jump, Start to pause
- **Mobile:** On-screen D-pad and jump button appear automatically.

Controls are remappable via the Settings menu. Screen shake, flashing effects, colorblind palette, and audio levels can also be adjusted from Settings. Preferences and progress persist using `localStorage` under the key `starsprint.save.v1`.

## Accessibility & Features
- Fixed 320×180 logical resolution with pixel-perfect scaling.
- Deterministic physics with coyote time, jump buffer, and wall interactions.
- HUD displays hearts, coins, stars, level name, and timer. A debug overlay (toggle via developer console `window.app.debug = true`) shows performance metrics.
- Procedural audio with three lightweight music loops and synthesized SFX.
- Touch controls optimized for mobile browsers.
- Deterministic replay harness powering the internal test mode (`index.html#test`).

## Known Limitations
- The built-in Test Mode currently reports results in the console overlay only.
- Art and audio are minimalist to keep the project lightweight and offline-friendly.

## Credits & License
- **Creator: C.RELLA**
- Code and assets are provided under the MIT License (see below).

```
MIT License

Copyright (c) 2025 C.RELLA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

The in-game Credits screen displays “Creator: C.RELLA” to acknowledge authorship.
