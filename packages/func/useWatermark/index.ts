import { generateWatermark, type Options } from './generate'
import { ref, h, onMounted, onUnmounted, defineComponent, type CSSProperties } from 'vue'

type WatermarkOptions = Options & { defaultText?: string }

export function useWatermark(options: WatermarkOptions = {}) {
  const Watermark = defineComponent({
    name: 'Watermark',
    props: {
      text: {
        type: String,
        default: options.defaultText ?? 'Hello World!',
      },
    },
    setup(props, { slots }) {
      const imageBase64 = generateWatermark(props.text, options)

      const parentRef = ref()

      let div: HTMLDivElement | undefined

      // 水印基础样式
      const watermarkStyle: CSSProperties = {
        position: 'absolute',
        backgroundImage: `url(${imageBase64})`,
        backgroundRepeat: 'repeat',
        backgroundSize: `${options.width ?? 100}px ${options.height ?? 100}px`,
        pointerEvents: 'none',
        zIndex: '9999',
        inset: '0',
      }

      function createWatermark() {
        if (!parentRef.value) return
        if (div) {
          div.remove()
        }
        div = document.createElement('div')
        Object.assign(div.style, watermarkStyle)
        parentRef.value.appendChild(div)
      }

      const ob = new MutationObserver((entries) => {
        for (const entriy of entries) {
          // 水印被移除时重新创建
          for (const node of entriy.removedNodes) {
            if (node === div) {
              createWatermark()
              return
            }
          }
          // 水印属性被修改时恢复
          if (entriy.target === div) {
            createWatermark()
          }
        }
      })

      onMounted(() => {
        createWatermark()
        ob.observe(parentRef.value, {
          childList: true,
          subtree: true,
          attributes: true,
        })
      })

      onUnmounted(() => {
        ob.disconnect()
        div = undefined
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
  })
  return {
    Watermark,
  }
}
