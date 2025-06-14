import { describe, expect, it, vi, beforeEach } from 'vitest'
import { promiseResolve } from '~/shared'
import { useCancelableTask } from '.'

describe('useCancelableTask', () => {
  const mockAsyncFn = vi.fn(async (arg: number) => await promiseResolve(`result_${arg}`))

  beforeEach(() => {
    mockAsyncFn.mockClear()
  })

  it('should be executed', async () => {
    const { execute } = useCancelableTask(mockAsyncFn)

    const promise = execute(1)

    await expect(promise).resolves.toEqual('result_1')
  })

  it('shoule be cancelled', async () => {
    const { execute, cancel } = useCancelableTask(mockAsyncFn)

    const thenFn = vi.fn()

    execute(1).then(thenFn)
    cancel()

    await promiseResolve(1)

    expect(thenFn).not.toHaveBeenCalled()
  })

  it('should be cancel previous task', async () => {
    const { execute } = useCancelableTask(mockAsyncFn)

    const thenFn = vi.fn()

    execute(1).then(thenFn)
    execute(2).then(thenFn)

    await promiseResolve(1)

    expect(thenFn).toBeCalledTimes(1)
  })
})
