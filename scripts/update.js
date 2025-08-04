import { existsSync } from 'node:fs'
import * as fs from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { glob } from 'tinyglobby'

const packages = ['components', 'core', 'shared']

const __dirname = fileURLToPath(new URL(import.meta.url))
export const DOCS_URL = 'https://vueuse.org'
export const DIR_ROOT = resolve(__dirname, '../..')
export const DIR_SRC = resolve(DIR_ROOT, 'packages')
export const DOSC_SRC = resolve(DIR_ROOT, 'docs')

async function update() {
  const metadata = {
    packages: {},
    functions: [],
  }

  for (const pkgName of packages) {
    const dir = join(DIR_SRC, pkgName)
    const functions = await listFunctions(dir, ['utils'])

    const pkg = {
      name: pkgName,
      dir: relative(DIR_ROOT, dir).replace(/\\/g, '/'),
    }

    metadata.packages[pkgName] = pkg

    await Promise.all(functions.map(async (name) => {
      const mdPath = join(dir, name, 'index.md').replace('packages', 'docs')
      // const tsPath = join(dir, name, 'index.ts')

      const fn = {
        name,
        package: pkg.name,
      }

      if (existsSync(join(dir, name, 'component.ts')))
        fn.component = true
      if (existsSync(join(dir, name, 'directive.ts')))
        fn.directive = true
      if (!existsSync(mdPath)) {
        metadata.functions.push(fn)
        return
      }

      fn.docs = `${DOCS_URL}/${pkg.name}/${name}/`
      fn.md = true

      const mdRaw = await fs.readFile(mdPath, 'utf-8')

      const { content: md, data: frontmatter } = matter(mdRaw)
      fn.category = frontmatter.category
      let description = (
        md
          // normalize newlines
          .replace(/\r\n/g, '\n')
          // remove ::: tip blocks
          .replace(/(:{3,}(?=[^:\n]*\n))[^\n]*\n[\s\S]*?\1 *(?=\n)/g, '')
          // remove headers
          .match(/#(?=\s).*\n+(.+?)(?:, |\. |\n|\.\n)/) || []
      )[1] || ''

      description = description.trim()
      description = description.charAt(0).toLowerCase() + description.slice(1)
      fn.description = description
      metadata.functions.push(fn)
    }))
  }

  metadata.functions.sort((a, b) => a.name.localeCompare(b.name))

  return metadata
}

async function listFunctions(dir, ignore = []) {
  const files = await glob('*', {
    onlyDirectories: true,
    cwd: dir,
    ignore: [
      '_*',
      'dist',
      'node_modules',
      ...ignore,
    ],
  })
  files.sort()
  return files.map(path => path.endsWith('/') ? path.slice(0, -1) : path)
}

async function run() {
  const metadata = await update()
  await fs.writeFile(join(DOSC_SRC, 'public', 'meta.json'), `${JSON.stringify(metadata, null, 2)}\n`)
}

run()
