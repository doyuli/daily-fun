import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useAsyncState } from '.'
import { promiseResolve } from '~/shared'

describe('useAsyncState', () => {
  const asyncFn = vi.fn((arg: number) => promiseResolve(`result_${arg}`))

  beforeEach(() => {
    asyncFn.mockClear()
  })

  it('should be called', async () => {
    const { state, isLoading, isReady } = useAsyncState(() => asyncFn(1))

    expect(isLoading.value).toBe(true)
    expect(isReady.value).toBe(false)

    await promiseResolve(1)

    expect(state.value).toBe('result_1')
    expect(isLoading.value).toBe(false)
    expect(isReady.value).toBe(true)
  })

  it('should be reactivity', async () => {
    let arg = 1
    const { state, execute } = useAsyncState(() => asyncFn(arg))

    await promiseResolve(1)

    expect(state.value).toBe('result_1')

    arg = 2

    await execute()

    expect(state.value).toBe('result_2')
  })

  it('should be not immediated with initialState', async () => {
    let arg = 1
    const { state, execute } = useAsyncState(() => asyncFn(arg), 'I am initialState', {
      immediate: false,
    })

    expect(state.value).toBe('I am initialState')

    await execute(1)

    expect(state.value).toBe('result_1')
  })

  it('should throw error', async () => {
    const errorFn = vi.fn(async () => {
      throw new Error('I am Error')
    })

    const { error, execute } = useAsyncState(errorFn, undefined, {
      throwError: true,
      immediate: false,
    })

    await expect(execute()).rejects.toThrow('I am Error')

    expect((error.value as Error).message).toBe('I am Error')
  })
})
