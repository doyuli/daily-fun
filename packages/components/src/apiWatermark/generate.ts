import { DEFAULT_OPTIONS } from './constants'

export interface WatermarkStyleOptions {
  width?: number
  height?: number
  rotate?: number
  font?: string
  fillStyle?: string
  textAlign?: CanvasTextAlign
  textBaseline?: CanvasTextBaseline
}

export function createWatermarkImage(
  text: string,
  options: WatermarkStyleOptions = {},
) {
  const { width, height, rotate, font, fillStyle, textAlign, textBaseline } = {
    ...DEFAULT_OPTIONS,
    ...options,
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')!

  ctx.save()
  try {
    ctx.translate(width / 2, height / 2)
    ctx.rotate((rotate * Math.PI) / 180)

    ctx.font = font
    ctx.fillStyle = fillStyle
    ctx.textAlign = textAlign
    ctx.textBaseline = textBaseline

    ctx.fillText(text, 0, 0)
  }
  finally {
    ctx.restore()
  }

  return canvas.toDataURL('image/png')
}
