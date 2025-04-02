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
 * 预加载图片
 * @param options Options
 * @returns Plugin
 */
export const preloadImages = (options: Options): Plugin => {
  const { dir, attrs = {} } = options

  return {
    name: 'vite-plugin-preload-images',
    transformIndexHtml(_, ctx) {
      const files = fg.sync(dir, {
        cwd: ctx.server?.config.publicDir,
      })

      const images = files.map((file) => ctx.server?.config.base + file)

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
