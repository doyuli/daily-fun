import type { Options as CompileOptions } from '@daily-fun/integrations/asyncCatch'
import type { Plugin } from 'vite'
import { compile } from '@daily-fun/integrations/asyncCatch'
import { createFilter } from 'vite'

const VITE_PLUGIN_NAME = 'vite-plugin-async-catch'

interface PluginOptions extends CompileOptions {
  include?: string | string[]
  exclude?: string | string[]
}

export function AsyncCatchPlugin(options?: PluginOptions): Plugin {
  const {
    include = ['**/*.{js,ts,jsx,tsx,vue}'],
    exclude = ['**/node_modules/**'],
    ...compileOpts
  } = options || {}

  const filter = createFilter(include, exclude)

  return {
    name: VITE_PLUGIN_NAME,
    enforce: 'post',
    transform(code, id) {
      if (!filter(id) || !code.includes('await'))
        return null

      try {
        const transformedCode = compile(code, compileOpts)
        return {
          code: transformedCode,
          map: null,
        }
      }
      catch (err: any) {
        console.warn(`[${VITE_PLUGIN_NAME}] Failed to process ${id}:`, err.message)
        return null
      }
    },
  }
}
