export const NOOP = () => {}

export const promise = Promise.resolve()

export function promiseTimeout<T>(
  cb: (resolve: (value: T) => void, reject: (reason: any) => void) => void,
  ms: number,
) {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      cb(resolve, reject)
    }, ms)
  })
}

export function promiseResolve<T>(value: T, ms: number) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), ms))
}
