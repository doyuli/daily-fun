import type { Format, UserConfig } from 'tsdown'
import { defineConfig } from 'tsdown'

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

const externals = [
  'vue',
  /@daily-fun\/.*/,
]

const iifeGlobals = {
  'vue': 'Vue',
  '@daily-fun/shared': 'DailyFun',
  '@daily-fun/core': 'DailyFun',
}

export function createTsdownConfig(options?: Buildoptions): UserConfig[] {
  const {
    input = 'index.ts',
    iife,
    mjs,
    dts,
    build,
    target = 'es2018',
    external = [],
  } = options || {}

  if (build === false)
    return []

  const configs: UserConfig[] = []

  const formats: Format[] = []

  if (mjs !== false) {
    formats.push('es')
  }

  if (iife !== false) {
    formats.push('iife')
  }

  configs.push(defineConfig({
    target,
    dts,
    platform: 'browser',
    entry: input,
    format: formats,
    external: [...externals, ...external],
    globalName: 'DailyFun',
    outputOptions: {
      globals: iifeGlobals,
    },
  }))

  return configs
}
