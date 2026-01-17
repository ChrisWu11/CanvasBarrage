# CanvasBarrage 高性能 Canvas 弹幕引擎

> 可处理海量弹幕数据，保持顺滑动画体验，支持高度自定义与多框架集成。

## ✨ 特性

- **高性能渲染**：基于 `requestAnimationFrame` 持续绘制，平滑不卡顿。
- **无限循环**：自动回收已退出的弹幕并补充新弹幕，实现持续播放。
- **高度可配置**：速度、行数、间距、字体、颜色、随机色等参数随心调整。
- **可扩展**：运行时支持 `addBarrage` 动态追加弹幕数据。
- **多环境友好**：既支持模块引入，也可直接通过浏览器全局对象使用。

## 📦 安装与引入

### 1. 模块化使用（推荐）

```js
import CanvasBarrage from './index.js'
```

### 2. 浏览器直接使用

```html
<script src="./index.js"></script>
<script>
  const barrage = new window.CanvasBarrage({ /* options */ })
</script>
```

> 由于脚本会自动挂载到 `window.CanvasBarrage`，可以在任意框架中使用。

## 🧱 容器结构与样式建议

Canvas 会以绝对定位覆盖在目标容器上方，建议容器父级设置相对定位：

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

## 🚀 快速开始

```js
const options = {
  id: '.canvas',
  barrageList: [
    { value: 'Hello Canvas' },
    { value: '弹幕滚动起来！' },
    { value: '高性能渲染' }
  ],
  isRandomFontColor: true,
  barrageSpeed: 1,
  barrageRow: 6
}

const barrage = new CanvasBarrage(options)

// 启动动画
barrage.drawBarrage()

// 动态追加弹幕
barrage.addBarrage([
  { value: '新增弹幕 A' },
  { value: '新增弹幕 B' }
])
```

## ⚙️ 实例参数（Options）

| 参数 | 说明 | 类型 | 必选 | 默认值 |
| --- | --- | --- | --- | --- |
| `id` | 目标元素选择器（用于创建 Canvas 覆盖） | `string` | ✅ | 无 |
| `barrageList` | 初始弹幕数组 | `IBarrageItem[]` | ✅ | `[]` |
| `barrageRow` | 弹幕行数 | `number` | 否 | `5` |
| `barrageSpace` | 弹幕之间的水平间距 | `number` | 否 | `50` |
| `toVw` | 是否将位移单位换算为 `vw` | `boolean` | 否 | `false` |
| `basePx` | `vw` 计算基准宽度 | `number` | 否 | `document.documentElement.clientWidth` |
| `renderSize` | 单次渲染弹幕数量（用于性能控制） | `number` | 否 | `50` |
| `fontSize` | 字体大小 | `number` | 否 | `20` |
| `fontFamily` | 字体名称 | `string` | 否 | `Arial` |
| `isRandomFontColor` | 是否随机颜色 | `boolean` | 否 | `false` |
| `fontColor` | 默认字体颜色 | `string` | 否 | `black` |
| `barrageSpeed` | 弹幕速度 | `number` | 否 | `1` |
| `renderOverLimit` | 达到该退出数量时进行重新渲染 | `number` | 否 | `20` |
| `maxLimit` | 允许的最大弹幕缓存数量 | `number` | 否 | `200` |

## 🧾 弹幕数据结构（`barrageList`）

| 字段 | 说明 | 类型 | 必选 |
| --- | --- | --- | --- |
| `value` | 弹幕内容 | `string` | ✅ |

> 内部会为每条弹幕自动补充 `width`、`x`、`y`、`speed`、`barrageFontCol` 等字段。

## 🧩 API 方法

### `drawBarrage()`

启动弹幕绘制循环，建议在创建实例后调用。

### `addBarrage(list)`

追加弹幕数据，支持批量添加：

```js
barrage.addBarrage([{ value: '新弹幕' }])
```

> 若弹幕总数超过 `maxLimit`，将自动裁剪旧数据以保持性能稳定。

## 📌 小贴士

- 若出现弹幕遮挡问题，请检查容器是否设置了 `position: relative` 与合理的 `height`。
- `toVw` 开启后，弹幕位移会根据 `basePx` 自动换算，适合响应式场景。
- 使用 `isRandomFontColor` 可以快速创建多彩弹幕效果。

---

如果你喜欢这个项目，欢迎点个 Star ⭐️ 或提交 Issue 交流建议！
