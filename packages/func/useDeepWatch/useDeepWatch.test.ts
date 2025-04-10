import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ref, watch, nextTick } from 'vue'
import { watchOldValue } from '.'

describe('watch', () => {
  it('should have the same reference', async () => {
    const morkValue = ref({ a: 1, b: 2 })

    const cb = vi.fn()

    watch(
      () => morkValue.value,
      (newVal, oldVal) => {
        cb(newVal, oldVal)
      },
      {
        deep: true,
      },
    )

    morkValue.value.a = 2

    await nextTick()

    expect(cb).toBeCalledWith({ a: 2, b: 2 }, { a: 2, b: 2 })
  })
})

describe('watchOldValue', () => {
  it('should have the different reference', async () => {
    const morkValue = ref({ a: 1, b: 2 })

    const cb = vi.fn()

    watchOldValue(
      () => morkValue.value,
      (newVal, oldVal) => {
        cb(newVal, oldVal)
      },
      {
        deep: true,
      },
    )

    morkValue.value.a = 2

    await nextTick()

    expect(cb).toBeCalledWith({ a: 2, b: 2 }, { a: 1, b: 2 })
  })

  it('should used custom clone', async () => {
    const morkValue = ref({ a: 1, b: 2 })

    const cb = vi.fn()

    watchOldValue(
      () => morkValue.value,
      (newVal, oldVal) => {
        cb(newVal, oldVal)
      },
      {
        deep: true,
        clone: (val) => val,
      },
    )

    morkValue.value.a = 2

    await nextTick()

    expect(cb).toBeCalledWith({ a: 2, b: 2 }, { a: 2, b: 2 })
  })
})
