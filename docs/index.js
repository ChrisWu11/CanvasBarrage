class CanvasBarrage {
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
    this.el = document.querySelector(id)
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.el.offsetWidth
    this.canvas.height = this.el.offsetHeight
    this.canvas.style.position = 'absolute'
    this.canvas.style.top = '0'
    this.canvas.style.left = '0'
    this.el.parentNode?.insertBefore(this.canvas, this.el)

    this.toVw = toVw
    this.basePx = basePx || document.documentElement.clientWidth
    this.px2vw = this.pxTovw(basePx)
    this.barrageList = []
    this.barrageOriginList = barrageList
    this.renderSize = renderSize
    this.barrageCleanCount = 0
    this.barrageRow = barrageRow
    this.barrageSpace = barrageSpace
    this.barrageSpeed = barrageSpeed
    this.barrageOriginEndIndex = 0
    this.cleanCount = 0
    this.fontSize = fontSize
    this.fontFamily = fontFamily
    this.barrageWidth = this.el.offsetWidth
    this.barrageHeight = this.el.offsetHeight
    this.ctx = this.canvas.getContext('2d')
    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`
    this.ctx.textAlign = 'left'
    this.isRandomFontColor = isRandomFontColor
    this.fontColor = fontColor
    this.lock = false
    this.isFirstOver = true
    this.maxLimit = maxLimit

    if (this.barrageOriginList.length * 0.4 > renderOverLimit) {
      this.renderOverLimit = renderOverLimit
    } else {
      this.renderOverLimit = this.barrageOriginList.length * 0.2
    }

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

  handleBarragePosition(list) {
    const resList = JSON.parse(JSON.stringify(list))
    return resList.map(item => {
      if (this.isRandomFontColor) {
        item.barrageFontCol = this.getRandomHexColor()
      } else {
        item.barrageFontCol = this.fontColor
      }

      item.width = this.ctx.measureText(item.value).width

      let minIndex = 0
      let min = this.lastBarrageEnds[0]
      this.lastBarrageEnds.forEach((item, index) => {
        if (item < min) {
          min = item
          minIndex = index
        }
      })

      const row = minIndex % this.barrageRow

      item.x = this.lastBarrageEnds[row] + this.barrageSpace
      this.lastBarrageEnds[row] = item.x + item.width

      item.y = (row / this.barrageRow) * this.barrageHeight

      item.speed = this.barrageSpeed

      item.isExit = false
      return item
    })
  }

  drawBarrage() {
    const _this = this
    if (this.lock && this.barrageCleanCount >= 20) {
      return
    }
    this.ctx.clearRect(0, 0, this.barrageWidth, this.barrageHeight)

    this.lastBarrageEnds = this.lastBarrageEnds.map(_ => {
      return _ - this.barrageSpeed
    })

    this.barrageList.forEach(item => {
      this.ctx.beginPath()
      this.ctx.fillStyle = item.barrageFontCol
      this.ctx.fillText(item.value, item.x, item.y + this.px2vw(50))
      this.ctx.closePath()

      item.x -= item.speed

      if (item.x < -item.width) {
        if (item.isExit) {
          return
        }
        item.isExit = true
        this.barrageCleanCount++
      }
    })

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

  handleBarrageRenderList() {
    const total = this.barrageList.length

    this.barrageList = this.barrageList.filter(item => {
      return !item.isExit
    })

    this.cleanCount = total - this.barrageList.length
    if (this.isFirstOver) {
      this.barrageOriginEndIndex = this.cleanCount
      this.isFirstOver = false
    } else {
      this.barrageOriginEndIndex += this.cleanCount
    }

    let addList = this.handleBarrageOriginList(this.barrageOriginList)
    addList = this.handleBarragePosition(addList)
    this.barrageList = this.barrageList.concat(addList)
    this.barrageCleanCount = 0
  }

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
      this.barrageOriginEndIndex
    }
    return renderList
  }

  addBarrage(list) {
    this.barrageOriginList = this.barrageOriginList.concat(list)
    this.barrageList = this.barrageList.concat(this.handleBarragePosition(list))

    if (this.barrageOriginList.length > this.maxLimit) {
      this.barrageOriginList = this.barrageOriginList.slice(-this.maxLimit)
    }
  }
}

if (typeof window !== 'undefined') {
  window.CanvasBarrage = CanvasBarrage
}

export default CanvasBarrage
