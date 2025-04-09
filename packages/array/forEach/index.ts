export function forEach<T>(
  arr: T[],
  cb: (item: T, index: number, array: T[]) => void,
  thisArg?: unknown,
): void {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected an array, but received ${typeof arr}`)
  }

  if (typeof cb !== 'function') {
    throw new TypeError('callback must be a function')
  }

  const _callback = thisArg ? cb.bind(thisArg) : cb

  const _len = arr.length

  for (let i = 0; i < _len; i++) {
    // 检查当前索引是否存在，避免稀疏数组的问题
    if (i in arr) {
      _callback(arr[i], i, arr)
    }
  }
}
