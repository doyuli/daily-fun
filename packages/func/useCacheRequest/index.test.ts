import { describe, expect, it, vi } from 'vitest'
import { promiseResolve } from '~/shared'
import { useCacheRequest } from '.'

describe('useCacheRequest', () => {
  it('should return a function', () => {
    const request = useCacheRequest()
    expect(typeof request).toBe('function')
  })

  it('should return pending cache', async () => {
    const request = useCacheRequest()

    const request1 = request('http://example.com')
    const request2 = request('http://example.com')

    expect(request1).toEqual(request2)
  })

  it('should clear cache', async () => {
    const request = useCacheRequest()

    const request1 = request('http://example.com')
    request.clear()
    const request2 = request('http://example.com')

    expect(request1).not.to.equal(request2)
  })

  it('should return cache within the validity period', async () => {
    const originalFetch = global.fetch
    const mockFetch = vi.fn(async (arg: number) => await promiseResolve(`result_${arg}`, 30)) as any
    global.fetch = mockFetch

    const request = useCacheRequest({ cacheTime: 100 })

    await request('http://example.com')
    await request('http://example.com')
    expect(mockFetch).toBeCalledTimes(1)

    await request('http://example.com', { body: JSON.stringify({ id: 1 }) })
    expect(mockFetch).toBeCalledTimes(2)

    await promiseResolve('expired', 60)
    await request('http://example.com')
    expect(mockFetch).toBeCalledTimes(3)

    global.fetch = originalFetch
  })
})
