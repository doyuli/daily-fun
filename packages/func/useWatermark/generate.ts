export interface Options {
  width?: number
  height?: number
  rotate?: number
  font?: string
  fillStyle?: string
  textAlign?: CanvasTextAlign
  textBaseline?: CanvasTextBaseline
}

const initialOptions: Required<Options> = {
  width: 100,
  height: 100,
  rotate: -45,
  font: '20px sans-serif',
  fillStyle: 'rgba(0, 0, 0, 0.15)',
  textAlign: 'center',
  textBaseline: 'middle',
}

export function generateWatermark(text: string, options: Options) {
  const { width, height, rotate, font, fillStyle, textAlign, textBaseline } = {
    ...initialOptions,
    ...options,
  }

  const can = document.createElement('canvas')
  can.width = width
  can.height = height

  const ctx = can.getContext('2d')!

  // 保存初始状态
  ctx.save()
  try {
    // 1. 先移动到画布中心
    ctx.translate(width / 2, height / 2)

    // 2. 然后旋转（角度转弧度）
    ctx.rotate((rotate * Math.PI) / 180)

    // 3. 设置文字样式
    ctx.font = font
    ctx.fillStyle = fillStyle
    ctx.textAlign = textAlign
    ctx.textBaseline = textBaseline

    // 4. 绘制文字（现在坐标系原点在画布中心）
    ctx.fillText(text, 0, 0)
  } finally {
    ctx.restore() // 恢复初始状态
  }

  return can.toDataURL('image/png')
}
