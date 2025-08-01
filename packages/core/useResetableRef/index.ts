import { cloneDeep } from '@fun/shared'
import { reactive, ref } from 'vue'

export function useResetableRef<T>(value: T, clone = cloneDeep) {
  const rawValue = clone(value)
  const state = ref(value)

  const reset = () => {
    state.value = clone(rawValue)
  }

  return [state, reset] as const
}

export function useResetableRefFn<T>(getter: () => T) {
  const state = ref(getter())

  const reset = () => {
    state.value = getter()
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
