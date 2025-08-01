// @ts-check

import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import esbuild from 'esbuild'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

const {
  values: { format },
  positionals,
} = parseArgs({
  allowPositionals: true,
  options: {
    format: {
      type: 'string',
      short: 'f',
      default: 'esm',
    },
  },
})

const outputFormat = format.startsWith('global')
  ? 'iife'
  : format === 'cjs'
    ? 'cjs'
    : 'esm'

const target = positionals.length ? positionals[0] : 'vue'

const pkgBase = `../packages/${target}`

const entry = resolve(__dirname, `${pkgBase}/src/index.ts`)

const outfile = resolve(__dirname, `${pkgBase}/dist/${target}.${format}.js`)

const pkg = require(`${pkgBase}/package.json`)

esbuild
  .context({
    entryPoints: [entry],
    outfile,
    format: outputFormat,
    bundle: true,
    sourcemap: true,
    globalName: pkg.buildOptions?.name,
    platform: format === 'cjs' ? 'node' : 'browser',
  })
  .then(ctx => ctx.watch())
