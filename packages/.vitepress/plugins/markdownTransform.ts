import type { Plugin } from 'vite'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const packages = ['core', 'shared', 'components']

export function MarkdownTransform(): Plugin {
  return {
    name: 'vueuse-md-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.match(/\.md\b/))
        return null

      // packages/core/src/compileTemplate/index.md => [core, src, compileTemplate, index.md]
      const [pkg, src, name, i] = id.split('/').slice(-4)

      if (packages.includes(pkg) && i === 'index.md') {
        const frontmatterEnds = code.indexOf('---\n\n')
        const firstHeader = code.search(/\n#{2,6}\s.+/)
        const sliceIndex = firstHeader < 0 ? frontmatterEnds < 0 ? 0 : frontmatterEnds + 4 : firstHeader

        const { header, footer } = getFunctionMarkdown(pkg, src, name)

        if (header)
          code = code.slice(0, sliceIndex) + header + code.slice(sliceIndex)

        if (footer)
          code = replacer(code, footer, 'FOOTER', 'tail')
      }

      return code
    },
  }
}

const GITHUB_BLOB_URL = 'https://github.com/doyuli/daily-fun/blob/main/packages'
const DIR_SRC = resolve(__dirname, '../..')

function getFunctionMarkdown(pkg: string, src: string, name: string) {
  // https://github.com/doyuli/daily-fun/blob/main/packages/core/useResetableRef
  const URL = `${GITHUB_BLOB_URL}/${pkg}/${src}/${name}`
  // daily-fun\docs\core\useResetableRef
  const dirname = join(DIR_SRC, pkg, src, name)
  const demoPath = ['demo.vue'].find(i => existsSync(join(dirname, i)))

  // [Source](link) • [Demo](link) • [Docs](link)
  const links = ([
    ['Source', `${URL}/index.ts`],
    demoPath ? ['Demo', `${URL}/${demoPath}`] : undefined,
    ['Docs', `${URL}/index.md`],
  ])
    .filter(i => i)
    .map(i => `[${i![0]}](${i![1]})`)
    .join(' • ')

  // ## Source
  const sourceSection = `## Source\n\n${links}\n`

  // ## Demo
  const demoSection = `
<script setup>
import Demo from \'./${demoPath}\'
</script>

## Demo

<DemoContainer>
<p class="demo-source-link"><a href="${URL}/${demoPath}" target="_blank">source</a></p>
<Demo/>
</DemoContainer>
`

  const footer = sourceSection

  const header = demoSection

  return {
    header,
    footer,
  }
}

function replacer(code: string, value: string, key: string, insert: 'head' | 'tail' | 'none' = 'none') {
  const START = `<!--${key}_STARTS-->`
  const END = `<!--${key}_ENDS-->`
  const regex = new RegExp(`${START}[\\s\\S]*?${END}`, 'im')

  const target = value ? `${START}\n\n${value.trim()}\n\n${END}` : `${START}${END}`

  if (!code.match(regex)) {
    if (insert === 'none')
      return code
    else if (insert === 'head')
      return `${target}\n\n${code}`
    else
      return `${code}\n\n${target}`
  }

  return code.replace(regex, target)
}
