import type { Ref } from 'vue'
import { cloneDeep } from '@daily-fun/shared'
import { reactive, ref } from 'vue'

type ResetRefReturn<T> = readonly [Ref<T>, () => void]

export function useResetableRef<T>(getter: () => T): ResetRefReturn<T>
export function useResetableRef<T>(value: T, clone?: (val: T) => T): ResetRefReturn<T>
export function useResetableRef<T>(
  valueOrGetter: T | (() => T),
  clone = cloneDeep,
) {
  const getRaw = () => {
    return typeof valueOrGetter === 'function' ? (valueOrGetter as () => T)() : clone(valueOrGetter)
  }
  const state = ref(getRaw())

  const reset = () => {
    state.value = getRaw()
  }

  return [state, reset] as const
}

export function useResetableReactive<T extends object>(value: T, clone = cloneDeep) {
  const rawValue = clone(value)
  const state = reactive(value)

  const reset = () => {
    Object.keys(state).forEach(key => delete (state as any)[key])
    Object.assign(state, clone(rawValue))
  }

  return [state, reset] as const
}
