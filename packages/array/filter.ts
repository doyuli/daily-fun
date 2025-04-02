export function filter<T>(
  arr: T[],
  cb: (item: T, index: number, array: T[]) => unknown,
  thisArg?: any,
) {
  if (!Array.isArray(arr)) {
    throw new TypeError('arr is not an array')
  }

  if (typeof cb !== 'function') {
    throw new TypeError('callback must be a function')
  }

  const result: T[] = []

  const _len = arr.length
  const _callback = thisArg ? cb.bind(thisArg) : cb

  for (let i = 0; i < _len; i++) {
    if (i in arr && _callback(arr[i], i, arr)) {
      result.push(arr[i])
    }
  }

  return result
}
