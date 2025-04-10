/**
 * 异步函数只执行一次
 * @param asyncFn 异步函数
 * @returns 异步函数
 */
export function useAsyncOnce<T extends any[], R extends Promise<any>>(
  asyncFn: (...args: T) => R,
): { execute: (...args: T) => R } {
  const map: Record<string, R> = {}

  return {
    execute: (...args) => {
      const key = JSON.stringify(args)

      return (map[key] ??= new Promise((resolve, reject) => {
        asyncFn(...args)
          .then(resolve)
          .catch(reject)
          .finally(() => {
            delete map[key]
          })
      }) as R)
    },
  }
}
