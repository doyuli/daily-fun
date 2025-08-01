import type { OutputOptions, RollupOptions } from 'rollup'
import type { Options as ESBuildOptions } from 'rollup-plugin-esbuild'
import json from '@rollup/plugin-json'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import { PluginPure as pure } from 'rollup-plugin-pure'

const configs: RollupOptions[] = []

function esbuildMinifier(options: ESBuildOptions) {
  const { renderChunk } = esbuild(options)

  return {
    name: 'esbuild-minifier',
    renderChunk,
  }
}

const pluginPure = pure({
  functions: ['defineComponent'],
})

const pluginEsbuild = esbuild()

const pluginDts = dts()

const externals = [
  'vue',
  /@daily-fun\/.*/,
]

const iifeGlobals = {
  'vue': 'Vue',
  '@daily-fun/shared': 'DailyFun',
  '@daily-fun/core': 'DailyFun',
}

const iifeName = 'DailyFun'

export interface Buildoptions {
  input?: string
  file?: string
  iife?: boolean
  mjs?: boolean
  dts?: boolean
  build?: boolean
  target?: string
  external?: string[]
}

export function createRollupConfig(options?: Buildoptions) {
  const { input = 'index.ts', file = 'index', iife, mjs, dts, build, target = 'es2018', external = [] } = options || {}

  if (build === false)
    return []

  const output: OutputOptions[] = []

  if (mjs !== false) {
    output.push({
      file: `dist/${file}.mjs`,
      format: 'es',
    })
  }

  if (iife !== false) {
    output.push(
      {
        file: `dist/${file}.iife.js`,
        format: 'iife',
        name: iifeName,
        extend: true,
        globals: iifeGlobals,
        plugins: [],
      },
      {
        file: `dist/${file}.iife.min.js`,
        format: 'iife',
        name: iifeName,
        extend: true,
        globals: iifeGlobals,
        plugins: [
          esbuildMinifier({
            minify: true,
          }),
        ],
      },
    )
  }

  configs.push({
    input,
    output,
    plugins: [
      target
        ? esbuild({ target })
        : pluginEsbuild,
      json(),
      pluginPure,
    ],
    external: [
      ...externals,
      ...(external || []),
    ],
  })

  if (dts !== false) {
    configs.push({
      input,
      output: [
        { file: `dist/${file}.d.mts` },
      ],
      plugins: [
        pluginDts,
      ],
      external: [
        ...externals,
        ...(external || []),
      ],
    })
  }

  return configs
}
