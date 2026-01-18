# High-Performance Canvas Barrage Engine

> Handle massive barrage data smoothly with rich customization and multi-framework integration.

## ✨ Highlights

- **High-performance rendering**: Continuous drawing with `requestAnimationFrame` for smooth animation.
- **Infinite loop**: Automatically recycles off-screen barrages and replenishes new ones for nonstop playback.
- **Highly configurable**: Tune speed, rows, spacing, font, color, random color, and more.
- **Extensible**: Use `addBarrage` at runtime to append barrages dynamically.
- **Multi-environment friendly**: Use as a module or via the browser global.

## 📦 Install & Import

### 1. Modular usage (recommended)

```js
import CanvasBarrage from './index.js'
```

### 2. Direct browser usage

```html
<script src="./index.js"></script>
<script>
  const barrage = new window.CanvasBarrage({ /* options */ })
</script>
```

> The script attaches to `window.CanvasBarrage` automatically, so it works in any framework.

## 🧱 Container structure & styling tips

The canvas is absolutely positioned on top of the target container. Set the parent to relative positioning:

```html
<div class="barrage-wrapper">
  <div class="canvas"></div>
</div>
```

```css
.barrage-wrapper {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.canvas {
  width: 100%;
  height: 100%;
}
```

## 🚀 Quick start

```js
const options = {
  id: '.canvas',
  barrageList: [
    { value: 'Hello Canvas' },
    { value: 'Let the barrages roll!' },
    { value: 'High-performance rendering' }
  ],
  isRandomFontColor: true,
  barrageSpeed: 1,
  barrageRow: 6
}

const barrage = new CanvasBarrage(options)

// Start animation
barrage.drawBarrage()

// Append barrages dynamically
barrage.addBarrage([
  { value: 'New barrage A' },
  { value: 'New barrage B' }
])
```

## ⚙️ Options

| Option | Description | Type | Required | Default |
| --- | --- | --- | --- | --- |
| `id` | Target element selector (used to create the canvas overlay) | `string` | ✅ | None |
| `barrageList` | Initial barrage array | `IBarrageItem[]` | ✅ | `[]` |
| `barrageRow` | Number of rows | `number` | No | `5` |
| `barrageSpace` | Horizontal spacing between barrages | `number` | No | `50` |
| `toVw` | Convert movement units to `vw` | `boolean` | No | `false` |
| `basePx` | Base width for `vw` calculation | `number` | No | `document.documentElement.clientWidth` |
| `renderSize` | Barrages per render (performance control) | `number` | No | `50` |
| `fontSize` | Font size | `number` | No | `20` |
| `fontFamily` | Font family | `string` | No | `Arial` |
| `isRandomFontColor` | Randomize colors | `boolean` | No | `false` |
| `fontColor` | Default font color | `string` | No | `black` |
| `barrageSpeed` | Barrage speed | `number` | No | `1` |
| `renderOverLimit` | Re-render when exit count reaches this threshold | `number` | No | `20` |
| `maxLimit` | Maximum cached barrage count | `number` | No | `200` |

## 🧾 Barrage data structure (`barrageList`)

| Field | Description | Type | Required |
| --- | --- | --- | --- |
| `value` | Barrage content | `string` | ✅ |

> The engine auto-populates fields like `width`, `x`, `y`, `speed`, and `barrageFontCol` for each barrage.

## 🧩 API Methods

### `drawBarrage()`

Starts the barrage rendering loop. Call this after creating an instance.

### `addBarrage(list)`

Append barrages in batch:

```js
barrage.addBarrage([{ value: 'New barrage' }])
```

> If the total barrage count exceeds `maxLimit`, older data is trimmed to keep performance stable.

## 📌 Tips

- If barrages overlap or clip, ensure the container uses `position: relative` and a proper `height`.
- When `toVw` is enabled, movement is converted using `basePx`, making it suitable for responsive layouts.
- Enable `isRandomFontColor` for colorful barrage effects.

---

If you like this project, feel free to star ⭐️ or open an issue!
