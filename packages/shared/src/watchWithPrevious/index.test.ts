import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref, watch } from 'vue'
import { watchWithPrevious } from '.'

describe('watch', () => {
  it('should have the same reference', async () => {
    const state = ref({ a: 1, b: 2 })

    const cb = vi.fn()

    watch(
      () => state.value,
      (newVal, oldVal) => {
        cb(newVal, oldVal)
      },
      {
        deep: true,
      },
    )

    state.value.a = 2

    await nextTick()

    expect(cb).toBeCalledWith({ a: 2, b: 2 }, { a: 2, b: 2 })
  })
})

describe('watchWithPrevious', () => {
  it('should have the different reference', async () => {
    const state = ref({ a: 1, b: 2 })

    const cb = vi.fn()

    watchWithPrevious(
      () => state.value,
      (newVal, oldVal) => {
        cb(newVal, oldVal)
      },
      {
        deep: true,
      },
    )

    state.value.a = 2

    await nextTick()

    expect(cb).toBeCalledWith({ a: 2, b: 2 }, { a: 1, b: 2 })
  })

  it('should used custom clone', async () => {
    const state = ref({ a: 1, b: 2 })

    const cb = vi.fn()

    watchWithPrevious(
      () => state.value,
      (newVal, oldVal) => {
        cb(newVal, oldVal)
      },
      {
        deep: true,
        clone: val => val,
      },
    )

    state.value.a = 2

    await nextTick()

    expect(cb).toBeCalledWith({ a: 2, b: 2 }, { a: 2, b: 2 })
  })
})
