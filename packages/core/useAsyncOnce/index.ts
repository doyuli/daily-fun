import { jsonStringify } from '@fun/shared'

interface AsyncOnceOptions<T extends any[]> {
  /**
   * Generate cache key for given arguments
   *
   * @default JSON.stringify
   */
  generateKey?: (args: T) => string
}

export function useAsyncOnce<T extends any[], R>(
  asyncFn: (...args: T) => Promise<R>,
  options: AsyncOnceOptions<T> = {},
) {
  const { generateKey = jsonStringify } = options

  const cache = new Map<string, Promise<R>>()

  return {
    execute: (...args: T): Promise<R> => {
      const key = generateKey(args)

      const cached = cache.get(key)
      if (cached)
        return cached

      const promise = asyncFn(...args).finally(() => {
        cache.delete(key)
      })
      cache.set(key, promise)

      return promise
    },
  }
}
