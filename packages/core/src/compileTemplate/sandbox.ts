import { isDomElement } from '@daily-fun/shared'
import { BLACKLIST, createBlackHole, GLOBAL_ALIASES } from './tools'

type SandboxContent = Record<string, any>

function createMockWindow() {
  const mockWindow = new Proxy(
    {},
    {
      has() {
        return true
      },
      set(target, key, value) {
        // 允许在 mockWindow 上临时赋值
        return Reflect.set(target, key, value)
      },
      get(_, key) {
        if (GLOBAL_ALIASES.has(key)) {
          // 访问 global 则返回自身
          return mockWindow
        }

        if (typeof key === 'string' && BLACKLIST.has(key)) {
          // 访问黑名单则返回黑洞
          return createBlackHole()
        }

        // 回退到原生 window
        const nativeValue = Reflect.get(window, key)

        if (typeof nativeValue === 'function' && !nativeValue.prototype) {
          return nativeValue.bind(window)
        }

        if (isDomElement(nativeValue)) {
          // 禁止 DOM 元素泄露
          return undefined
        }

        return nativeValue
      },
    },
  )

  return mockWindow
}

interface CompiledScript {
  execute: (context: SandboxContent) => any
}

const COMPILE_CACHE = new Map<string, CompiledScript>()

function compileScript(code: string): CompiledScript {
  const cached = COMPILE_CACHE.get(code)
  if (cached)
    return cached

  // eslint-disable-next-line no-new-func
  const fn = new Function(`
    with (this) {
      return (function() { 'use strict'; return (${code}); }).call(this);
    }
  `)

  const compiled: CompiledScript = {
    execute(context: SandboxContent) {
      const sandbox = createSandbox(context)
      return fn.call(sandbox)
    },
  }

  COMPILE_CACHE.set(code, compiled)
  return compiled
}

let sharedMockWindow: ReturnType<typeof createMockWindow> | null = null

function getSharedMockWindow() {
  if (!sharedMockWindow)
    sharedMockWindow = createMockWindow()

  return sharedMockWindow
}

function createSandbox(context: SandboxContent) {
  // 判断某个属性是否受保护
  const isProtected = (prop: PropertyKey) => {
    return prop in context || GLOBAL_ALIASES.has(prop)
  }

  const mock = getSharedMockWindow()

  return new Proxy(mock, {
    has() {
      return true
    },
    get(target, key, receiver) {
      if (key === Symbol.unscopables) {
        return undefined
      }

      if (key === 'toJSON') {
        return receiver
      }

      if (key in context) {
        const value = Reflect.get(context, key, receiver)
        if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
          Object.freeze(value)
        }
        return value
      }

      if (GLOBAL_ALIASES.has(key)) {
        // 全局别名指向沙箱自身
        return receiver
      }

      // 回退到 mockWindow
      return Reflect.get(target, key, receiver)
    },

    set(target, key, value, receiver) {
      if (isProtected (key)) {
        throw new Error(`Cannot modify protected property: ${key.toString()}`)
      }
      return Reflect.set(target, key, value, receiver)
    },

    defineProperty(target, key, attributes) {
      if (isProtected (key)) {
        throw new Error(`Cannot define protected property: ${key.toString()}`)
      }
      return Reflect.defineProperty(target, key, attributes)
    },

    deleteProperty(target, key) {
      if (isProtected (key)) {
        throw new Error(`Cannot delete protected property: ${key.toString()}`)
      }
      return Reflect.deleteProperty(target, key)
    },

    setPrototypeOf() {
      throw new Error('setPrototypeOf is not allowed in sandbox')
    },
  })
}

export function invokeCodeSnippet(snippet: string, context: SandboxContent) {
  const code = snippet.trim()
  if (code === '') {
    return undefined
  }

  const compiled = compileScript(code)
  return compiled.execute(context)
}
