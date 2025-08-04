import { defineConfig } from 'vitepress'
import viteConfig from './vite.config'

const Guide = [
  { text: 'Get Started', link: '/guide/' },
  { text: 'Best Practice', link: '/guide/best-practice' },
  { text: 'Configurations', link: '/guide/config' },
  { text: 'Components', link: '/guide/components' },
]

const DefaultSideBar = Guide

const FunctionsSideBar = [
  { text: 'useResetableRef', link: '/core/useResetableRef' },
]

const sidebar = {
  '/guide/': DefaultSideBar,
  '/core/': FunctionsSideBar,
  '/shared/': FunctionsSideBar,
}

const nav = [
  {
    text: 'Guide',
    items: [
      { text: 'Guide', items: Guide },
    ],
  },
  {
    text: 'Core',
    items: [
      {
        text: '',
        items: [
          { text: 'Core', link: '/core/useResetableRef' },
        ],
      },
    ],
  },
]

export default defineConfig({
  title: 'DailyFun',
  description: 'Interesting toolset',
  lang: 'en-US',
  ignoreDeadLinks: true,
  themeConfig: {
    logo: '/favicon.svg',
    nav,
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-PRESENT Yulia Dong',
    },
  },
  vite: viteConfig as any,
})
