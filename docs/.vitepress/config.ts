import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs'
import { defineConfig } from 'vitepress'

import metadata from '../public/meta.json'
import vite from './vite.config'

const Guide = [
  { text: 'Get Started', link: '/guide/' },
  { text: 'Best Practice', link: '/guide/best-practice' },
  { text: 'Configurations', link: '/guide/config' },
  { text: 'Components', link: '/guide/components' },
]

const DefaultSideBar = Guide

const FunctionsSideBar = getFunctionsSideBar()

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
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    codeTransformers: [
      transformerTwoslash({
        typesCache: createFileSystemTypesCache(),
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
