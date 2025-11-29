import type { Component, CSSProperties } from 'vue'
import type { WatermarkStyleOptions } from './generate'
import { h, onMounted, onUnmounted, ref, watch } from 'vue'
import { DEFAULT_OPTIONS } from './constants'
import { createWatermarkImage } from './generate'

const watermarkCache = new Map<string, string>()

function getWatermarkImage(text: string, options: WatermarkStyleOptions): string {
  const key = JSON.stringify({ text, ...options })
  if (watermarkCache.has(key))
    return watermarkCache.get(key)!

  const image = createWatermarkImage(text, options)
  watermarkCache.set(key, image)
  return image
}

type WatermarkOptions = WatermarkStyleOptions & {
  defaultText?: string
  style?: CSSProperties
  watch?: boolean
}

export function defineWatermark(options: WatermarkOptions = {}): Component {
  const {
    defaultText,
    style: userStyle,
    watch: _watch = true,
    ...watermarkOptions
  } = { ...DEFAULT_OPTIONS, ...options }

  return {
    name: 'Watermark',
    props: {
      text: {
        type: String,
        default: defaultText ?? 'Hello World!',
      },
    },
    setup(props, { slots }) {
      const parentRef = ref<HTMLDivElement>()
      let watermarkDiv: HTMLDivElement | undefined

      function createWatermark() {
        if (!parentRef.value)
          return

        if (watermarkDiv) {
          watermarkDiv.remove()
        }

        watermarkDiv = document.createElement('div')

        const imageBase64 = getWatermarkImage(props.text, watermarkOptions)

        const finalStyle: CSSProperties = {
          position: 'absolute',
          backgroundImage: `url(${imageBase64})`,
          backgroundRepeat: 'repeat',
          backgroundSize: `${watermarkOptions.width}px ${watermarkOptions.height}px`,
          pointerEvents: 'none',
          zIndex: '9999',
          inset: '0',
          ...userStyle,
        }

        Object.assign(watermarkDiv.style, finalStyle)
        parentRef.value.appendChild(watermarkDiv)
      }

      if (_watch)
        watch(() => props.text, createWatermark, { immediate: true })

      const ob = new MutationObserver((entries) => {
        for (const entry of entries) {
          for (const node of entry.removedNodes) {
            if (node === watermarkDiv) {
              createWatermark()
              return
            }
          }
          if (entry.target === watermarkDiv) {
            createWatermark()
            return
          }
        }
      })

      onMounted(() => {
        createWatermark()
        ob.observe(parentRef.value!, {
          childList: true,
          subtree: true,
          attributes: true,
        })
      })

      onUnmounted(() => {
        ob.disconnect()
        watermarkDiv?.remove()
        watermarkDiv = undefined
      })

      return () =>
        h(
          'div',
          {
            class: 'watermark-container',
            ref: parentRef,
            style: {
              position: 'relative',
            },
          },
          slots,
        )
    },
  }
}
