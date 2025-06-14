import { describe, it, expect, vi, beforeEach } from 'vitest'
import { promiseResolve } from '~/shared'
import { useAsyncOnce } from '.'

describe('useAsyncOnce', () => {
  const mockAsyncFn = vi.fn(async (arg: number) => await promiseResolve(`result_${arg}`))

  beforeEach(() => {
    mockAsyncFn.mockClear()
  })

  it('should execute the async function only once', async () => {
    const { execute } = useAsyncOnce(mockAsyncFn)
    const [promise1, promise2, promise3] = [execute(1), execute(1), execute(1)]

    expect(promise1).toBe(promise2)
    expect(promise2).toBe(promise3)

    await Promise.all([promise1, promise2, promise3])
    expect(mockAsyncFn).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple different arguments separately', async () => {
    const { execute } = useAsyncOnce(mockAsyncFn)

    await Promise.all([execute(1), execute(2)])

    expect(mockAsyncFn).toHaveBeenCalledTimes(2)
    expect(mockAsyncFn).toHaveBeenCalledWith(1)
    expect(mockAsyncFn).toHaveBeenCalledWith(2)
  })

  it('should clean up the map after execution', async () => {
    const { execute } = useAsyncOnce(mockAsyncFn)

    const promise1 = execute(1)
    await expect(promise1).resolves.toEqual('result_1')
    expect(mockAsyncFn).toHaveBeenCalledTimes(1)

    const promise2 = execute(1)
    await expect(promise2).resolves.toEqual('result_1')
    expect(mockAsyncFn).toHaveBeenCalledTimes(2)
  })

  it('should handled error', async () => {
    const errorFn = vi.fn(async () => {
      throw new Error('test error')
    })

    const { execute } = useAsyncOnce(errorFn)

    await expect(execute()).rejects.toThrow('test error')

    await expect(execute()).rejects.toThrow('test error')

    expect(errorFn).toHaveBeenCalledTimes(2)
  })
})
