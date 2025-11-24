import { jsonStringify } from '@daily-fun/shared'

export interface CacheRequestOptions {
  /**
   * Generate cache key for given arguments
   *
   * @default JSON.stringify
   */
  generateKey?: (args: any[]) => string

  /**
   * Cache expiration in milliseconds
   *
   * @default 180000 (3 minutes)
   */
  cacheTime?: number
}

type RequestFunction<T extends any[], R> = (...args: T) => Promise<R>

export function createCacheRequest<T extends any[], R>(
  requestFn: RequestFunction<T, R>,
  options?: CacheRequestOptions,
) {
  const cacheRequest = new Map<string, { data: R, expire: number }>()
  const pendingRequest = new Map<string, Promise<R>>()

  const {
    generateKey = jsonStringify,
    cacheTime = 3 * 60 * 1000,
  } = options || {}

  function request(...args: T): Promise<R> {
    const key = generateKey(args)
    const now = Date.now()

    if (pendingRequest.has(key)) {
      return pendingRequest.get(key)!
    }

    if (cacheRequest.has(key)) {
      const { data, expire } = cacheRequest.get(key)!
      if (expire > now) {
        return Promise.resolve(data)
      }
      cacheRequest.delete(key)
    }

    const promise = requestFn(...args)
      .then((resp) => {
        cacheRequest.set(key, { data: resp, expire: now + cacheTime })
        return resp
      })
      .catch((err) => {
        cacheRequest.delete(key)
        throw err
      })
      .finally(() => {
        pendingRequest.delete(key)
      })

    pendingRequest.set(key, promise)

    return promise
  }

  const clear = () => {
    cacheRequest.clear()
    pendingRequest.clear()
  }

  request.clear = clear

  return request
}

export function createCacheFetch(options?: CacheRequestOptions) {
  return createCacheRequest(globalThis.fetch, options)
}
