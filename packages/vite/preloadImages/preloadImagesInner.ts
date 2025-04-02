import type { Plugin } from 'vite'
import fg from 'fast-glob'

interface Options {
  dir: string
  attrs?: {
    rel: 'preload' | 'prefetch'
    [key: string]: string
  }
}

/**
 * 预加载 src 路径下的图片
 * @param options Options
 * @returns Plugin
 */
export const preloadImagesInner = (options: Options): Plugin => {
  const { dir, attrs = {} } = options

  const assetImages: string[] = []

  return {
    name: 'vite-plugin-preload-images-inner',

    generateBundle(_, bundle) {
      const values = Object.values(bundle)
      const files = fg.sync(dir)
      values.forEach((item) => {
        if (files.includes(Reflect.get(item, 'originalFileName'))) {
          assetImages.push(item.fileName)
        }
      })
    },

    transformIndexHtml(_, ctx) {
      let images: string[] = []

      if (ctx.server) {
        // 开发环境
        const files = fg.sync(dir)
        images = files.map((file) => ctx.server?.config.base + file)
      } else {
        // 生产环境
        images = assetImages
      }

      return images.map((href) => ({
        tag: 'link',
        attrs: {
          rel: 'prefetch',
          as: 'image',
          href,
          ...attrs,
        },
      }))
    },
  }
}
