/**
 * 异步函数只执行一次
 * @param asyncFn 异步函数
 * @returns 异步函数
 */
export function asyncOnce(asyncFn: (...args: any[]) => Promise<any>) {
  const map: Record<string, Promise<any>> = {}

  return (...args: any[]) => {
    const key = JSON.stringify(args)

    return (map[key] ??= new Promise((resolve, reject) => {
      asyncFn(...args)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          delete map[key]
        })
    }))
  }
}
