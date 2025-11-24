export function isDomElement(value: any) {
  return value instanceof Element || value instanceof HTMLCollection
}

export function createBlackHole(): any {
  return new Proxy(
    () => createBlackHole(),
    {
      get(_, key) {
        if (key === 'toString') {
          return () => ''
        }
        if (key === Symbol.toPrimitive) {
          return () => ''
        }
        return createBlackHole()
      },
    },
  )
}

export const BLACKLIST = new Set([
  'top',
  'opener',
  'window',
  'globalThis',
  'self',
  'global',
  'alert',
  'confirm',
  'prompt',
  'localStorage',
  'sessionStorage',
  'eval',
  'Function',
  'setTimeout',
  'setInterval',
  'location',
  'history',
  'navigator',
  'cookie',
  'frames',
  'parent',
  'fetch',
  'XMLHttpRequest',
  'document',
  'MutationObserver',
  'console',
])

export const GLOBAL_ALIASES = new Set<PropertyKey>(['window', 'globalThis', 'self', 'global'])
