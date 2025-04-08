export interface Options {
  width?: number
  height?: number
  font?: string
  fillStyle?: string
  textAlign?: CanvasTextAlign
  textBaseline?: CanvasTextBaseline
}

export function generateWatermark(text: string, options: Options) {
  const { width, height, font, fillStyle, textAlign, textBaseline } = options || {}

  const can = document.createElement('canvas')
  can.width = width ?? 100
  can.height = height ?? 100

  const ctx = can.getContext('2d')!
  ctx.rotate((-20 * Math.PI) / 120)
  ctx.font = font ?? '15px Vedana'
  ctx.fillStyle = fillStyle ?? 'rgba(0, 0, 0, 0.15)'
  ctx.textAlign = textAlign ?? 'center'
  ctx.textBaseline = textBaseline ?? 'middle'
  ctx.fillText(text, can.width / 20, can.height)

  return can.toDataURL('image/png')
}
