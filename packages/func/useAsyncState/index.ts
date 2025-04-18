import { ref, shallowRef } from 'vue'
import { promiseResolve } from '~/shared'

interface Options<D = any> {
  immediate?: boolean
  throwError?: boolean
  shallow?: boolean
  delay?: number
  resetOnExecute?: boolean
  onError?: (e: unknown) => void
  onSuccess?: (data: D) => void
}

const defaultOptions: Options = {
  immediate: true,
  throwError: false,
  shallow: true,
  delay: 0,
  resetOnExecute: true,
}

export function useAsyncState<D, T extends any[]>(
  asyncFn: (...args: T) => Promise<D> | Promise<D>,
  initialSate?: D,
  options?: Options<D>,
) {
  const { immediate, throwError, shallow, delay, resetOnExecute, onError, onSuccess } = {
    ...defaultOptions,
    ...options,
  }

  const state = (shallow ? shallowRef : ref)<D | undefined>(initialSate)
  const error = shallowRef<unknown>(null)
  const isLoading = shallowRef(false)
  const isReady = shallowRef(false)

  const execute = async (delay = 0, ...args: T): Promise<D> => {
    isLoading.value = true
    if (resetOnExecute) {
      isReady.value = false
      state.value = initialSate
      error.value = null
    }

    if (delay) {
      await promiseResolve(undefined, delay)
    }

    const _asyncFn = typeof asyncFn === 'function' ? asyncFn(...(args as T)) : asyncFn

    try {
      const result = await _asyncFn
      state.value = result
      error.value = null
      isReady.value = true
      onSuccess?.(result)
    } catch (err) {
      error.value = err
      onError?.(err)
      if (throwError) {
        throw err
      }
    } finally {
      isLoading.value = false
    }

    return state.value
  }

  immediate && execute(delay, ...([] as unknown as T))

  return {
    state,
    error,
    isLoading,
    isReady,
    execute,
  }
}
