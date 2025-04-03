import { ref, reactive } from 'vue'
import { cloneDeep } from '~/shared'

/**
 * 创建一个可重置的 ref
 * @param valueFn 初始值函数
 * @returns [state, reset]
 */
export function useResetableRefFn<T>(valueFn: () => T) {
  const state = ref(valueFn())

  const reset = () => {
    state.value = valueFn()
  }

  return [state, reset]
}

/**
 * 创建一个可重置的 ref
 * @param value 初始值
 * @param clone 克隆函数 默认使用 JSON.parse(JSON.stringify(value))
 * @returns [state, reset]
 */
export function useResetableRef<T>(value: T, clone = cloneDeep) {
  const _value = clone(value)
  const state = ref(_value)

  const reset = () => {
    state.value = clone(_value)
  }

  return [state, reset]
}

/**
 * 创建一个可重置的 reactive
 * @param value 初始值
 * @param clone 克隆函数 默认使用 JSON.parse(JSON.stringify(value))
 * @returns [state, reset]
 */
export function useResetableReactive<T extends object>(value: T, clone = cloneDeep) {
  const _value = clone(value)

  const state = reactive(_value)

  const reset = () => {
    Object.keys(state).forEach((key) => delete (state as any)[key])
    Object.assign(state, clone(_value))
  }
  return [state, reset]
}
