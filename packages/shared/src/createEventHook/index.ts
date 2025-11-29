import type { IsAny } from '../utils'

type Callback<T> = IsAny<T> extends true ? (...args: any) => void
  : [T] extends [void] ? () => void
      : [T] extends [any[]] ? (...args: T) => void
          : (...args: [T, ...unknown[]]) => void

export function createEventHook<T = any>() {
  const hooks = new Set<Callback<T>>()

  function on(listener: Callback<T>) {
    hooks.add(listener)
    return () => off(listener)
  }

  function off(listener: Callback<T>) {
    hooks.delete(listener)
  }

  function trigger(...args: Parameters<Callback<T>>): Promise<void[]> {
    return Promise.all(Array.from(hooks).map(listener => listener(...args)))
  }

  function clear() {
    hooks.clear()
  }

  return {
    on,
    off,
    trigger,
    clear,
  }
}
