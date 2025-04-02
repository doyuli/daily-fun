/**
 * 异步函数只执行一次
 * @param asyncFn 异步函数
 * @returns 异步函数
 */
export function useAsyncOnce(asyncFn: (...args: any[]) => Promise<any>) {
  const map: Record<string, Promise<any>> = {}

  return {
    execute: (...args: any[]) => {
      const key = JSON.stringify(args)

      return (map[key] ??= new Promise((resolve, reject) => {
        asyncFn(...args)
          .then(resolve)
          .catch(reject)
          .finally(() => {
            delete map[key]
          })
      }))
    },
  }
}
