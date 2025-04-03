import type { WatchSource, WatchCallback } from 'vue'
import { watch, toValue } from 'vue'
import { cloneDeep } from '~/shared'

/**
 * 使用 cloneDeep 的 watch
 * 解决 watch object 时 newValue 和 oldValue 一致的问题
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
