import { NOOP, type Fn } from '~/shared'

/**
 * 创建一个可取消的异步任务
 * @param asyncFn 异步函数
 * @returns
 */
export function useCancelableTask<T extends any[], R extends Promise<any>>(
  asyncFn: (...args: T) => R,
): { execute: (...args: T) => R; cancel: Fn } {
  let _cancel = NOOP

  return {
    // 使用箭头函数，确保获取最新的 _cancel
    cancel: () => _cancel(),
    execute: (...args) => {
      return new Promise((resolve, reject) => {
        // 取消上次调用
        _cancel()

        // 更新 _cancel 为新的取消函数
        _cancel = () => {
          resolve = reject = NOOP
        }

        // 执行异步函数
        asyncFn(...args)
          .then((res) => resolve(res))
          .catch((err) => reject(err))
          .finally(() => {
            _cancel = NOOP
          })
      }) as R
    },
  }
}
