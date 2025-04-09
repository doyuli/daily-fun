/**
 * 数组随机排序
 * @param arr
 * @returns 返回一个新数组
 */
export function shuffle<T>(arr: T[]): T[] {
  if (!Array.isArray(arr)) {
    throw new TypeError(`Expected an array, but received ${typeof arr}`)
  }

  const shuffled = arr.slice()

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}
