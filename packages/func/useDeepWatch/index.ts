import type { WatchSource, WatchCallback } from 'vue'
import { ref, reactive, watch, toValue } from 'vue'
import { cloneDeep } from '~/shared'

/**
 * 监听对象的旧值
 * @param source 监听的源
 * @param callback 回调函数
 * @param options 选项
 * @returns
 */
export const watchOldValue = <T>(
  source: WatchSource<T>,
  callback: WatchCallback<T, T | undefined>,
  options?: { clone?: (value: T) => T } & Parameters<typeof watch>[2],
) => {
  const { clone = cloneDeep } = options || {}

  const val = toValue(source)

  if (typeof val !== 'object' || val === null) {
    return watch(source, callback, options)
  }

  let oldVal = clone(val)
  return watch(
    source,
    (newVal, _, onCleanup) => {
      callback(newVal, oldVal, onCleanup)
      oldVal = clone(newVal)
    },
    options,
  )
}

const arr = ref([1, 2, 3])
const obj = reactive({
  a: 1,
  b: 2,
})

watchOldValue(
  () => arr,
  (newVal, oldVal) => {
    console.log(newVal, oldVal)
  },
)
