import type { WatchSource, WatchCallback } from 'vue'
import { watch, toValue } from 'vue'
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
  callback: WatchCallback<T>,
  options?: Parameters<typeof watch>[2],
) => {
  const val = toValue(source)

  if (typeof val !== 'object' || val === null) {
    return watch(source, callback, options)
  }

  let oldVal = cloneDeep(val)
  return watch(
    source,
    (newVal, _, onCleanup) => {
      callback(newVal, oldVal, onCleanup)
      oldVal = cloneDeep(newVal)
    },
    options,
  )
}
