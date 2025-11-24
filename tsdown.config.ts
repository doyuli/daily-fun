import type { Format, UserConfig } from 'tsdown'
import { defineConfig } from 'tsdown'

export interface Buildoptions {
  entry?: string | string[] | Record<string, string>
  iife?: boolean
  mjs?: boolean
  dts?: boolean
  build?: boolean
  target?: string
  external?: string[]
  globals?: Record<string, string>
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

export function createTsdownConfig(options?: Buildoptions): UserConfig | undefined {
  const {
    entry = 'src/index.ts',
    iife,
    mjs,
    dts,
    build,
    target = 'es2018',
    external = [],
    globals = {},
  } = options || {}

  if (build === false)
    return

  const formats: Format[] = []

  if (mjs !== false) {
    formats.push('es')
  }

  if (iife !== false) {
    formats.push('iife')
  }

  return defineConfig({
    entry,
    dts,
    target,
    platform: 'browser',
    format: formats,
    external: [...externals, ...external],
    globalName: 'DailyFun',
    outputOptions: iife
      ? {
          globals: {
            ...iifeGlobals,
            ...globals,
          },
        }
      : undefined,
  })
}
