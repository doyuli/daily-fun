/**
 * 深拷贝 使用 JSON.parse(JSON.stringify(value))
 * @param value 需要深拷贝的值
 * @returns
 */
export function cloneDeep<T>(value: T): T {
  if (value === null || typeof value !== 'object') return value

  return JSON.parse(JSON.stringify(value))
}
