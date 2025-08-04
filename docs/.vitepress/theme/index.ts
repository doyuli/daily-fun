import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DemoContainer from './components/DemoContainer.vue'

import './styles/main.css'
import './styles/demo.css'
import './styles/utils.css'
import './styles/vars.css'
import './styles/overrides.css'
import 'uno.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoContainer', DemoContainer)
  },
} satisfies Theme
