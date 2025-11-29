import type { WatchCallback, WatchOptions, WatchSource } from 'vue'
import { toValue, watch } from 'vue'
import { cloneDeep, isObject } from '../utils'

export function watchWithPrevious<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T, T | undefined>,
  options?: { clone?: (value: T) => T } & WatchOptions,
) {
  const { clone = cloneDeep, ...watchOptions } = options || {}

  const val = toValue(source)

  if (!isObject(val))
    return watch(source, callback, watchOptions)

  let oldVal = clone(val)
  return watch(
    source,
    (newVal, _, onCleanup) => {
      callback(newVal, oldVal, onCleanup)
      oldVal = clone(newVal)
    },
    watchOptions,
  )
}
