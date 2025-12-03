import type { InjectionKey } from 'vue'
import { inject, provide } from 'vue'

export function createContext<T>(keyDescription: string) {
  const injectKey: InjectionKey<T> = Symbol(keyDescription)

  function useContext(fallback?: T): T {
    const context = inject(injectKey, fallback)
    if (context === undefined) {
      throw new Error(`[createContext] injection "${keyDescription}" not found. Did you forget to provide it?`)
    }
    return context
  }

  function provideContext(value: T) {
    provide(injectKey, value)
    return value
  }

  return [useContext, provideContext] as const
}
