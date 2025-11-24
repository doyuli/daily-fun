import { noop } from '@daily-fun/shared'

export function useCancelableTask<T extends any[], R>(
  asyncFn: (...args: T) => Promise<R>,
) {
  let abort = noop
  return {
    cancel: () => abort(),
    execute: (...args: T): Promise<R> => {
      return new Promise<R>((resolve, reject) => {
        abort()
        abort = () => {
          resolve = reject = noop
        }

        asyncFn(...args)
          .then(resp => resolve(resp))
          .catch(error => reject(error))
          .finally(() => {
            abort = noop
          })
      })
    },
  }
}
