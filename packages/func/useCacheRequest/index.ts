export interface CacheRequest {
  matchFn?: (...args: any[]) => string
  cacheTime?: number
}

function defaultCacheKey(...args: any[]) {
  return JSON.stringify(args)
}

export function useCacheRequest(options?: CacheRequest) {
  const cache = new Map()
  const pendingRequests = new Map()

  const { matchFn = defaultCacheKey, cacheTime = 3 * 60 * 1000 } = options || {}

  async function request(...args: Parameters<typeof fetch>) {
    const cacheKey = matchFn(args)
    const _now = Date.now()

    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey)
    }

    if (cache.has(cacheKey)) {
      const { data, expire } = cache.get(cacheKey)
      if (expire > _now) {
        return data
      }
      cache.delete(cacheKey)
    }

    const promise = fetch(...args)
      .then((resp) => {
        cache.set(cacheKey, { data: resp, expire: _now + cacheTime })
        return resp
      })
      .catch((err) => {
        cache.delete(cacheKey)
        throw err
      })

    pendingRequests.get(cacheKey)

    return promise
  }

  const clear = () => {
    cache.clear()
    pendingRequests.clear()
  }

  request.clear = clear

  return request
}
