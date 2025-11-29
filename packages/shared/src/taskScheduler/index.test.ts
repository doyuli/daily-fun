import { promiseResolve } from '@daily-fun/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TaskScheduler } from '.'

describe('taskScheduler', () => {
  const mockAsyncFn = vi.fn(
    async (arg: number, ms: number) => await promiseResolve(`result_${arg}`, ms),
  )

  const scheduler = new TaskScheduler(2)

  beforeEach(() => {
    mockAsyncFn.mockClear()
  })

  it('should return', async () => {
    const result = await scheduler.addTask(() => mockAsyncFn(1, 0))

    expect(result).toEqual('result_1')
  })

  it('should perform a maximum of two tasks at a time', async () => {
    scheduler.addTask(() => mockAsyncFn(1, 10))
    scheduler.addTask(() => mockAsyncFn(2, 20))
    scheduler.addTask(() => mockAsyncFn(3, 30))

    await promiseResolve(1, 10)

    expect(mockAsyncFn).toHaveBeenCalledTimes(2)
    expect(mockAsyncFn).toHaveBeenCalledWith(1, 10)
    expect(mockAsyncFn).toHaveBeenCalledWith(2, 20)

    await promiseResolve(1, 10)

    expect(mockAsyncFn).toHaveBeenCalledTimes(3)
    expect(mockAsyncFn).toHaveBeenCalledWith(3, 30)
  })
})
