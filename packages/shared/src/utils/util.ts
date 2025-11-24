export function cloneDeep<T>(val: T): T {
  if (val === null || typeof val !== 'object')
    return val
  return JSON.parse(JSON.stringify(val))
}
export const jsonStringify = (val: unknown): string => JSON.stringify(val)
export const promiseResolve = <T>(value: T, ms: number = 30) => new Promise<T>(resolve => setTimeout(() => resolve(value), ms))
