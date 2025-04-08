export function promiseTimeout<T>(
  cb: (resolve: (value: T) => void, reject: (reason: any) => void) => void,
  ms: number = 30,
) {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      cb(resolve, reject)
    }, ms)
  })
}

export function promiseResolve<T>(value: T, ms: number = 30) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), ms))
}

/**
 * 深拷贝 使用 JSON.parse(JSON.stringify(value))
 * @param value 需要深拷贝的值
 * @returns
 */
export function cloneDeep<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value

  return JSON.parse(JSON.stringify(value))
}
