import { describe, expect, it, vi } from 'vitest'
import { useRef, useReactive, effect } from '.'

describe('useRef', () => {
  it('should be reactivity by useRef', async () => {
    const state = useRef<number>(1)

    const fn = vi.fn(() => state.value)
    effect(fn)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveReturnedWith(1)

    state.value = 2

    expect(fn).toBeCalledTimes(2)
    expect(fn).toHaveReturnedWith(2)
  })

  it('should be reactivity by useReactive', async () => {
    const state = useReactive({
      a: 1,
    })

    const fn = vi.fn(() => state.a)
    effect(fn)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveReturnedWith(1)

    state.a = 2

    expect(fn).toBeCalledTimes(2)
    expect(fn).toHaveReturnedWith(2)
  })
})
