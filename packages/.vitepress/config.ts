import { resolve } from 'node:path'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs'
import { defineConfig } from 'vitepress'

import metadata from '../public/meta.json'
import vite from './vite.config'

const Guide = [
  { text: '开始使用', link: '/guide/' },
  { text: '最佳实践', link: '/guide/best-practice' },
  { text: '组件', link: '/guide/components' },
]

const FunctionsSideBar = getFunctionsSideBar()

const DefaultSideBar = [
  { text: 'Guide', items: Guide },
  ...FunctionsSideBar,
]

const sidebar = {
  '/guide/': DefaultSideBar,
  '/core/': FunctionsSideBar,
  '/shared/': FunctionsSideBar,
}

const nav = [
  {
    text: '指南',
    items: [
      { text: 'Guide', items: Guide },
    ],
  },
  {
    text: '函数',
    items: FunctionsSideBar,
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
      { icon: 'github', link: 'https://github.com/doyuli/daily-fun' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-PRESENT Doyuli',
    },
  },
  rewrites: {
    ':pkg/src/:func/(.*)': ':pkg/:func/index.md',
  },
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    codeTransformers: [
      transformerTwoslash({
        typesCache: createFileSystemTypesCache({
          dir: resolve(__dirname, 'cache', 'twoslash'),
        }),
      }),
    ],
    languages: ['js', 'ts'],
  },
  vite,
})

function getFunctionsSideBar() {
  const links: any[] = []

  const categories = metadata.functions.map(func => func.category).filter(Boolean)

  for (const category of categories) {
    const functions = metadata.functions.filter(i => i.category === category && i.md)

    links.push({
      text: category,
      items: functions.map(i => ({
        text: i.name,
        link: `/${i.package}/${i.name}/`,
      })),
    })
  }

  return links
}
