import { existsSync } from 'node:fs'
import * as fs from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { glob } from 'tinyglobby'

const PACKAGES = ['components', 'core', 'shared', 'integrations', 'plugins']
const IGNORE_DIRS = ['utils']
const DOCS_BASE_URL = 'https://daily-fun.org'

const __dirname = fileURLToPath(new URL(import.meta.url))
const ROOT = resolve(__dirname, '../..')
const PACKAGES_ROOT = join(ROOT, 'packages')
const OUTPUT_PATH = join(PACKAGES_ROOT, 'public', 'meta.json')

async function main() {
  const metadata = await buildProjectMetadata()
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(metadata, null, 2)}\n`)
}

main().catch((err) => {
  console.error('[meta] failed:', err)
  process.exit(1)
})

async function buildProjectMetadata() {
  const metadata = {
    packages: {},
    functions: [],
  }

  for (const pkgName of PACKAGES) {
    const pkgRoot = join(PACKAGES_ROOT, pkgName)
    const pkgSrc = join(pkgRoot, 'src')
    const functions = await getFilesInPackage(pkgSrc, IGNORE_DIRS)

    metadata.packages[pkgName] = {
      name: pkgName,
      dir: relative(ROOT, pkgRoot).replace(/\\/g, '/'),
    }

    await Promise.all(
      functions.map(name =>
        processFunction(pkgName, pkgSrc, name).then(fn =>
          metadata.functions.push(fn),
        ),
      ),
    )
  }

  metadata.functions.sort((a, b) => a.name.localeCompare(b.name))

  return metadata
}

async function processFunction(pkgName, pkgSrc, name) {
  const fnDir = join(pkgSrc, name)
  const mdPath = join(fnDir, 'index.md')

  const fn = {
    name,
    package: pkgName,
  }

  if (existsSync(join(fnDir, 'component.ts')))
    fn.component = true
  if (existsSync(join(fnDir, 'directive.ts')))
    fn.directive = true
  if (!existsSync(mdPath))
    return fn

  fn.docs = `${DOCS_BASE_URL}/${pkgName}/${name}/`
  fn.md = true

  const mdRaw = await fs.readFile(mdPath, 'utf8')
  const { content, data } = matter(mdRaw)

  fn.category = data.category
  fn.description = processDescription(content)

  return fn
}

function processDescription(md) {
  const normalized = md.replace(/\r\n/g, '\n')
  const cleaned = normalized.replace(
    /(:{3,}(?=[^:\n]*\n))[^\n]*\n[\s\S]*?\1 *(?=\n)/g,
    '',
  )

  // First line after H1
  const match = cleaned.match(/#(?=\s).*\n+(.+?)(?:, |\. |\n|\.\n)/)
  let description = match?.[1] ?? ''

  description = description.trim()
  return description.charAt(0).toLowerCase() + description.slice(1)
}

async function getFilesInPackage(cwd, ignore = []) {
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
  return files.map(path => path.endsWith('/') ? path.slice(0, -1) : path).sort()
}
