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

/**
 * 生成指定范围内的随机整数
 * @param min - 范围下限（包括）
 * @param max - 范围上限（包括）
 * @returns 在[min, max]范围内的随机整数
 */
export function getRandomInt(min: number, max: number): number {
  // 确保 min 和 max 是整数
  min = Math.ceil(min)
  max = Math.floor(max)

  // 生成[min, max]范围内的随机整数
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 判断是否为奇数
 */
export const isOdd = (num: number) => {
  return num % 2 !== 0
}
