import { createCacheFetch, promiseResolve } from '@daily-fun/core'
import { describe, expect, it, vi } from 'vitest'

describe('useCacheRequest', () => {
  it('should return a function', () => {
    const request = createCacheFetch()
    expect(typeof request).toBe('function')
  })

  it('should return pending cache', async () => {
    const request = createCacheFetch()

    const request1 = request('http://example.com')
    const request2 = request('http://example.com')

    expect(request1).toEqual(request2)
  })

  it('should clear cache', async () => {
    const request = createCacheFetch()

    const request1 = request('http://example.com')
    request.clear()
    const request2 = request('http://example.com')

    expect(request1).not.to.equal(request2)
  })

  it('should return cache within the validity period', async () => {
    const originalFetch = globalThis.fetch
    const mockFetch = vi.fn(async (arg: number) => await promiseResolve(`result_${arg}`, 30)) as any
    globalThis.fetch = mockFetch

    const request = createCacheFetch({ cacheTime: 100 })

    await request('http://example.com')
    await request('http://example.com')
    expect(mockFetch).toBeCalledTimes(1)

    await request('http://example.com', { body: JSON.stringify({ id: 1 }) })
    expect(mockFetch).toBeCalledTimes(2)

    await promiseResolve('expired', 60)
    await request('http://example.com')
    expect(mockFetch).toBeCalledTimes(3)

    globalThis.fetch = originalFetch
  })
})
