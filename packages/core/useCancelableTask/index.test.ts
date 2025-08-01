import { promiseResolve, useCancelableTask } from '@fun/core'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

    const cb = vi.fn()

    execute(1).then(cb)
    cancel()

    await Promise.resolve()

    expect(cb).not.toHaveBeenCalled()
  })

  it('should be cancel previous task', async () => {
    const { execute } = useCancelableTask(mockAsyncFn)

    const cb = vi.fn()

    execute(1).then(cb)
    execute(2).then(cb)

    await promiseResolve(1)

    expect(cb).toBeCalledTimes(1)
  })
})
