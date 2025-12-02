import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import { MarkdownTransform } from './plugins/markdownTransform'

export default defineConfig({
  plugins: [
    MarkdownTransform(),
    UnoCSS(),
  ],
})
