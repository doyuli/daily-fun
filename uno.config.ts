// uno.config.ts
import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    { 'flex-center': 'flex items-center justify-center' },
    { 'flex-between': 'flex items-center justify-between' },
  ],
  theme: {
    // phone:hidden 表示 @media (min-width: 640px)
    // lt-phone:hidden 表示 @media (max-width: 639.9px)
    // at-pad:hidden 表示 @media (min-width: 768px) and (max-width: 1023.9px)
    breakpoints: {
      phone: '640px',
      pad: '768px',
      notebook: '1024px',
      desktop: '1280px',
      tv: '1536px',
    },
  },
  presets: [
    // 默认预设
    presetUno(),
    // 开启属性模式
    presetAttributify(),
    // 图标预设 https://icones.js.org/collection/ri
    presetIcons({
      scale: 1.1,
      autoInstall: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [
    // 启用 Windi CSS for UnoCSS 的变体组功能(就是简写，具体看链接): https://unocss.dev/transformers/variant-group#usage
    transformerVariantGroup(),
    // 在样式类里你也可以写原子化 css 具体看链接: https://unocss.dev/transformers/directives#usage
    transformerDirectives(),
  ],
})
