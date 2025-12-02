import { existsSync } from 'node:fs'
import * as fs from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { glob } from 'tinyglobby'

const PACKAGES = ['components', 'core', 'shared', 'integrations', 'plugins']
const IGNORE_DIRS = ['utils']
const DOCS_BASE_URL = 'https://daily-fun.org'

const __dirname = fileURLToPath(new URL(import.meta.url))
const ROOT_PATH = resolve(__dirname, '../..', 'packages')
const OUTPUT_PATH = join(ROOT_PATH, 'public', 'meta.json')

async function buildProjectMetadata() {
  const metadata = {
    packages: {},
    functions: [],
  }

  for (const pkgName of PACKAGES) {
    const pkgRoot = join(ROOT_PATH, pkgName)
    const pkgCwd = join(pkgRoot, 'src')
    const functions = await getFunctionNamesInPackage(pkgCwd, IGNORE_DIRS)

    const pkg = {
      name: pkgName,
      dir: relative(ROOT_PATH, pkgRoot).replace(/\\/g, '/'),
    }

    metadata.packages[pkgName] = pkg

    await Promise.all(functions.map(async (name) => {
      const mdPath = join(pkgCwd, name, 'index.md')

      const fn = {
        name,
        package: pkg.name,
      }

      if (existsSync(join(pkgCwd, name, 'component.ts')))
        fn.component = true
      if (existsSync(join(pkgCwd, name, 'directive.ts')))
        fn.directive = true
      if (!existsSync(mdPath)) {
        metadata.functions.push(fn)
        return
      }

      fn.docs = `${DOCS_BASE_URL}/${pkg.name}/${name}/`
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

async function getFunctionNamesInPackage(cwd, ignore = []) {
  const files = await glob('*', {
    cwd,
    onlyDirectories: true,
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

async function writeMetadataToFile() {
  const metadata = await buildProjectMetadata()
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(metadata, null, 2)}\n`)
}

writeMetadataToFile()
