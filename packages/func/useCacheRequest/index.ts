export interface CacheRequest {
  matchFn: (...args: any[]) => string
}

function defaultCacheKey(...args: any[]) {
  return JSON.stringify(args)
}

export function useCacheRequest(options?: CacheRequest) {
  const cache = new Map()
  const pendingRequests = new Map()

  const { matchFn = defaultCacheKey } = options || {}

  return async function request(...args: Parameters<typeof fetch>) {
    const cacheKey = matchFn(args)

    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey)
    }

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    const promise = fetch(...args)
      .then((resp) => {
        cache.set(cacheKey, resp)
        return resp
      })
      .catch((err) => {
        cache.delete(cacheKey)
        return err
      })

    pendingRequests.get(cacheKey)

    return promise
  }
}
