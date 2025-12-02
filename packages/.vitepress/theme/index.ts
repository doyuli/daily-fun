import type { Theme } from 'vitepress'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import DefaultTheme from 'vitepress/theme'
import DemoContainer from './components/DemoContainer.vue'

import '@shikijs/vitepress-twoslash/style.css'
import './styles/main.css'
import './styles/demo.css'
import './styles/utils.css'
import './styles/vars.css'
import './styles/overrides.css'
import 'uno.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(TwoslashFloatingVue)
    app.component('DemoContainer', DemoContainer)
  },
} satisfies Theme
