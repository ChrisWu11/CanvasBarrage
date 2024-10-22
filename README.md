# 高性能 Canvas 弹幕

> 可处理无限量的数据，不会有性能卡顿，超高自由度的配置

> 兼容所有框架

## 参数说明

### 弹幕实例参数

| 属性              | 描述               | 类型           | 必选 | 默认值      |
| ----------------- | ------------------ | -------------- | ---- | ----------- |
| id                | 挂载的 dom 的 id   | string         | 是   |             |
| barrageList       | 弹幕列表           | IBarrageItem[] | 是   |             |
| barrageRow        | 弹幕行数           | number         |      | 5           |
| barrageSpace      | 弹幕间距           | number         |      | 50          |
| toVw              | 是否转换为 vw 单位 | boolean        |      | false       |
| basePx            | 基准值             | number         |      | clientWidth |
| renderSize        | 屏幕真实渲染的数量 | number         |      | 50          |
| fontSize          | 字体大小           | number         |      | 20          |
| fontFamily        | 字体               | string         |      | Arial       |
| isRandomFontColor | 是否随机字体颜色   | boolean        |      | false       |
| fontColor         | 字体颜色           | string         |      | black       |
| barrageSpeed      | 弹幕速度           | number         |      | 1           |
| renderOverLimit   | 渲染超过限制数     | number         |      | 20          |
| maxLimit          | 原始数组最大限制   | number         |      | 200         |

### 弹幕数组`barrageList`参数

| 属性  | 描述     | 类型   | 必选 |
| ----- | -------- | ------ | ---- | --- |
| value | 弹幕内容 | string | 是   | 是  |

## 使用说明

### 生成实例

```js
const options = {
  id: '.canvas',
  barrageList: testList,
  isRandomFontColor: true,
  barrageSpeed: 1,
  barrageRow: 6
}

const barrage = new CanvasBarrage(options)
```

### 动画开始执行

```js
barrage.drawBarrage()
```

### 添加弹幕

```js
barrage.addBarrage(testList)
```
