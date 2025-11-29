import type { WatermarkStyleOptions } from './generate'

export const DEFAULT_OPTIONS: Required<WatermarkStyleOptions> = {
  width: 100,
  height: 100,
  rotate: -45,
  font: '20px sans-serif',
  fillStyle: 'rgba(0, 0, 0, 0.15)',
  textAlign: 'center',
  textBaseline: 'middle',
}
