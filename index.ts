interface ICanvasBarrage {
  id: string
  barrageList: IBarrageItem[]
  barrageRow?: number
  barrageSpace?: number
  toVw?: boolean
  basePx?: number
  renderSize?: number
  fontSize?: number
  fontFamily?: string
  isRandomFontColor?: boolean
  fontColor?: string
  barrageSpeed?: number
  renderOverLimit?: number
  maxLimit?: number
}

interface IBarrageItem {
  value: string
  barrageFontCol?: string
  width?: number
  x?: number
  y?: number
  speed?: number
  isExit?: boolean
}

class CanvasBarrage implements ICanvasBarrage {
  id!: string
  el: HTMLElement
  barrageList: IBarrageItem[]
  barrageRow: number
  barrageSpace: number
  toVw: boolean
  basePx: number
  renderSize: number
  fontSize: number
  fontFamily: string
  isRandomFontColor: boolean
  fontColor: string
  barrageSpeed: number
  renderOverLimit: number
  ctx: CanvasRenderingContext2D
  barrageWidth: number
  barrageHeight: number
  barrageCleanCount: number
  barrageOriginEndIndex: number
  cleanCount: number
  lock: boolean
  isFirstOver: boolean
  lastBarrageEnds: number[]
  barrageOriginList: IBarrageItem[]
  px2vw: (px: number) => number
  canvas: HTMLCanvasElement
  maxLimit: number

  constructor({
    id = null,
    barrageList = [],
    barrageRow = 5,
    barrageSpace = 50,
    toVw = false,
    basePx = document.documentElement.clientWidth,
    renderSize = 50,
    fontSize = 20,
    fontFamily = 'Arial',
    isRandomFontColor = false,
    fontColor = 'black',
    barrageSpeed = 1,
    renderOverLimit = 20,
    maxLimit = 200
  } = {}) {
    this.el = document.querySelector(id as unknown as string)!
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.el.offsetWidth
    this.canvas.height = this.el.offsetHeight
    this.canvas.style.position = 'absolute' // 设置 canvas 位置为绝对
    this.canvas.style.top = '0' // 设置 canvas 的 top 为图片的 offsetTop
    this.canvas.style.left = '0' // 设置 canvas 的 left 为图片的 offsetLeft
    this.el.parentNode?.insertBefore(this.canvas, this.el) // 将 canvas 插入到el节点前面

    this.toVw = toVw // 是否转换vw
    this.basePx = basePx || document.documentElement.clientWidth // 基准px
    this.px2vw = this.pxTovw(basePx)
    this.barrageList = [] // 弹幕渲染列表
    this.barrageOriginList = barrageList // 弹幕原始数据
    this.renderSize = renderSize // 真实渲染的数量
    this.barrageCleanCount = 0 // 记录移出屏幕的弹幕的数量
    this.barrageRow = barrageRow // 弹幕行数
    this.barrageSpace = barrageSpace // 弹幕间隔
    this.barrageSpeed = barrageSpeed // 弹幕速度
    this.barrageOriginEndIndex = 0 // 弹幕原始数据的结束索引
    this.cleanCount = 0 // 清除的数量
    this.fontSize = fontSize // 字体大小
    this.fontFamily = fontFamily // 字体
    this.barrageWidth = this.el.offsetWidth
    this.barrageHeight = this.el.offsetHeight
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`
    this.ctx.textAlign = 'left'
    this.isRandomFontColor = isRandomFontColor // 弹幕字体是否随机颜色
    this.fontColor = fontColor // 弹幕字体颜色
    this.lock = false // 弹幕绘制锁
    this.isFirstOver = true // 是否第一次超出
    this.maxLimit = maxLimit // 最大渲染数量

    // 处理渲染超出限制数量
    if (this.barrageOriginList.length * 0.4 > renderOverLimit) {
      this.renderOverLimit = renderOverLimit // 渲染超出限制数量
    } else {
      this.renderOverLimit = this.barrageOriginList.length * 0.2
    }

    // 初始化每一行弹幕出现的随机位置
    this.lastBarrageEnds = new Array(this.barrageRow).fill(0).map(() => {
      return this.barrageWidth / 2 + Math.random() * 500
    })

    this.barrageList = this.handleBarragePosition(this.barrageOriginList)
  }

  pxTovw(basePx) {
    const clientWidth = document.documentElement.clientWidth
    const range = clientWidth / basePx
    return function (px) {
      return px / range
    }
  }

  getRandomHexColor() {
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += Math.floor(Math.random() * 16).toString(16)
    }
    return color
  }

  // 处理弹幕坐标
  handleBarragePosition(list) {
    const resList = JSON.parse(JSON.stringify(list))
    return resList.map(item => {
      // 设置弹幕字体颜色
      if (this.isRandomFontColor) {
        item.barrageFontCol = this.getRandomHexColor()
      } else {
        item.barrageFontCol = this.fontColor
      }

      item.width = this.ctx.measureText(item.value).width
      // item.height = 30;

      // 获取最短的一行的index
      let minIndex = 0
      let min = this.lastBarrageEnds[0]
      this.lastBarrageEnds.forEach((item, index) => {
        if (item < min) {
          min = item
          minIndex = index
        }
      })

      const row = minIndex % this.barrageRow // 计算当前弹幕应该在哪一行

      item.x = this.lastBarrageEnds[row] + this.barrageSpace // 设置当前弹幕的x坐标为该行最后一个弹幕的结束位置加上间隔
      this.lastBarrageEnds[row] = item.x + item.width // 更新该行最后一个弹幕的结束位置

      item.y = (row / this.barrageRow) * this.barrageHeight

      item.speed = this.barrageSpeed

      item.isExit = false
      return item
    })
  }

  // 绘制弹幕
  drawBarrage() {
    // debugger;
    const _this = this
    if (this.lock && this.barrageCleanCount >= 20) {
      return
    }
    this.ctx.clearRect(0, 0, this.barrageWidth, this.barrageHeight)

    this.lastBarrageEnds = this.lastBarrageEnds.map(_ => {
      // return item - this.barrageSpeed;
      return _ - this.barrageSpeed
    })

    this.barrageList.forEach(item => {
      // 绘制文字
      this.ctx.beginPath()
      this.ctx.fillStyle = item.barrageFontCol as string
      this.ctx.fillText(
        item.value,
        item.x!, // 22是左边padding的距离，因为设计稿上左右padding不一样
        item.y! + this.px2vw(50)
      )
      this.ctx.closePath()

      // 绘制弹幕移动
      // item.x -= this.barrageSpeed;
      item.x! -= item.speed!

      // 处理弹幕移出了屏幕
      if (item.x! < -item.width!) {
        if (item.isExit) {
          return
        }
        item.isExit = true
        this.barrageCleanCount++
      }
    })
    // 当超出的弹幕数量大于等于renderOverLimit时，做的虚拟列表处理，精髓！！！
    if (this.barrageCleanCount >= this.renderOverLimit) {
      this.lock = true
      this.handleBarrageRenderList()
      this.lock = false
      requestAnimationFrame(_this.drawBarrage.bind(_this))
      return
    } else {
      requestAnimationFrame(_this.drawBarrage.bind(_this))
    }
  }

  // 将移出的弹幕加在最后
  handleBarrageRenderList() {
    const total = this.barrageList.length

    // 删除移出的弹幕
    this.barrageList = this.barrageList.filter(item => {
      return !item.isExit
    })

    // 已移除的弹幕数量
    this.cleanCount = total - this.barrageList.length
    if (this.isFirstOver) {
      this.barrageOriginEndIndex = this.cleanCount
      this.isFirstOver = false
    } else {
      this.barrageOriginEndIndex += this.cleanCount
    }

    // var addList = barrageList.splice(0, cleanCount);
    let addList = this.handleBarrageOriginList(this.barrageOriginList)
    addList = this.handleBarragePosition(addList)
    this.barrageList = this.barrageList.concat(addList)
    this.barrageCleanCount = 0
  }

  // 动态处理原始弹幕数据
  handleBarrageOriginList(list) {
    const total = list.length

    const startIndex = total <= this.barrageOriginEndIndex - this.cleanCount ? 0 : this.barrageOriginEndIndex - this.cleanCount

    const endIndex = total <= this.barrageOriginEndIndex ? total : this.barrageOriginEndIndex

    let rest = 0
    let renderList = []
    if (endIndex === total) {
      rest = Number(this.cleanCount) - Number(endIndex) + Number(startIndex)
      renderList = list.slice(startIndex, endIndex).concat(list.slice(0, rest))
    } else {
      renderList = list.slice(startIndex, endIndex)
    }

    if (this.barrageOriginEndIndex >= total) {
      this.barrageOriginEndIndex = 0
    } else {
      // barrageOriginEndIndex += cleanCount;
    }
    return renderList
  }

  // 添加弹幕数据
  addBarrage(list) {
    this.barrageOriginList = this.barrageOriginList.concat(list)
    this.barrageList = this.barrageList.concat(this.handleBarragePosition(list))

    if (this.barrageOriginList.length > this.maxLimit) {
      // 只保留后面的maxLimit条数据
      this.barrageOriginList = this.barrageOriginList.slice(-this.maxLimit)
    }
  }
}

export default CanvasBarrage
