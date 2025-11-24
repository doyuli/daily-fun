import { useResetableReactive, useResetableRef } from '@daily-fun/core'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

describe('useResetableRef', () => {
  it('should be reset by useResetableRef', async () => {
    const [state, reset] = useResetableRef<Record<string, any>>({ a: '', b: 'I am B' })

    state.value.a = 'I am A'

    state.value.b = undefined

    state.value.c = 'I am C'

    await nextTick()

    expect(state.value).toEqual({ a: 'I am A', c: 'I am C' })

    reset()

    expect(state.value).toEqual({ a: '', b: 'I am B' })
  })

  it('should be reset by useResetableRef with getter', async () => {
    const [state, reset] = useResetableRef<Record<string, any>>(() => ({ a: '', b: 'I am B' }))

    state.value.a = 'I am A'

    state.value.b = undefined

    state.value.c = 'I am C'

    await nextTick()

    expect(state.value).toEqual({ a: 'I am A', c: 'I am C' })

    reset()

    expect(state.value).toEqual({ a: '', b: 'I am B' })
  })

  it('should be reset by useResetableReactive', async () => {
    const [state, reset] = useResetableReactive<Record<string, any>>({ a: '', b: 'I am B' })

    state.a = 'I am A'

    delete state.b

    state.c = 'I am C'

    await nextTick()

    expect(state).toEqual({ a: 'I am A', c: 'I am C' })

    reset()

    expect(state).toEqual({ a: '', b: 'I am B' })
  })
})
