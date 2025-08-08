type AnyFn<T extends any[] = any[], R = any> = (...args: T) => R

type UFetchOptions = Parameters<typeof fetch>[1] & {
  timeout?: number
  url?: string
}

type DispatchUFetchOptions = UFetchOptions & {
  url: string
}

class InterceptorManager {
  handlers: {
    fulfilled: AnyFn
    rejected: AnyFn
    // Used to identify whether the interceptor is executed synchronously or asynchronously
    synchronous?: boolean
    // Used to decide whether to execute the interceptor
    runWhen?: AnyFn
  }[] = []

  constructor() {
    this.handlers = []
  }

  use(
    fulfilled: AnyFn,
    rejected: AnyFn,
    options?: {
      synchronous?: boolean
      runWhen?: AnyFn
    },
  ) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options?.synchronous,
      runWhen: options?.runWhen,
    })
  }
}

export class UFetch {
  interceptors: {
    request: InterceptorManager
    response: InterceptorManager
  }

  defaultOptions?: Parameters<typeof fetch>[1]

  constructor(options?: UFetchOptions) {
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    }
    this.defaultOptions = options || {}
  }

  request(optionOrUrl: string | DispatchUFetchOptions, options: UFetchOptions = {}) {
    if (typeof optionOrUrl === 'string') {
      options.url = optionOrUrl
    }
    else {
      options = optionOrUrl
    }

    const _options = { ...this.defaultOptions, ...options } as DispatchUFetchOptions

    // TODO: Maybe a linked list would be better.
    const requestInterceptorChain: {
      fulfilled: AnyFn
      rejected: AnyFn
    }[] = []
    let synchronousRequestInterceptors = true

    // requestInterceptor
    this.interceptors.request.handlers.forEach(({ fulfilled, rejected, synchronous, runWhen }) => {
      if (typeof runWhen === 'function' && runWhen(_options) === false) {
        return
      }
      synchronousRequestInterceptors = !!(synchronousRequestInterceptors && synchronous)
      // Use unshift to ensure execution order
      requestInterceptorChain.unshift({ fulfilled, rejected })
    })

    // responseInterceptor
    const responseInterceptorChain: {
      fulfilled: AnyFn
      rejected: AnyFn
    }[] = []
    this.interceptors.response.handlers.forEach(({ fulfilled, rejected }) => {
      responseInterceptorChain.push({ fulfilled, rejected })
    })

    let i = 0
    let len = 0
    let promise

    // asyncInterceptor
    if (!synchronousRequestInterceptors) {
      const chain: any[] = [
        {
          fulfilled: this.dispatchRequest,
          rejected: (error: any) => error,
        },
      ]
      chain.unshift(...requestInterceptorChain)
      chain.push(...responseInterceptorChain)

      promise = Promise.resolve(_options)
      len = chain.length

      while (len > i) {
        const { fulfilled, rejected } = chain[i++]
        promise = promise.then(fulfilled, rejected)
      }

      return promise
    }

    // requestInterceptorChain
    len = requestInterceptorChain.length
    let finalOptions = _options

    while (len > i) {
      const { fulfilled, rejected } = requestInterceptorChain[i++]

      try {
        finalOptions = fulfilled(finalOptions)
      }
      catch (error) {
        rejected.call(this, error)
        break
      }
    }

    try {
      promise = this.dispatchRequest(finalOptions)
    }
    catch (error) {
      return Promise.reject(error)
    }

    // responseInterceptorChain
    len = responseInterceptorChain.length
    i = 0

    while (len > i) {
      const { fulfilled, rejected } = responseInterceptorChain[i++]
      promise = promise.then(fulfilled, rejected)
    }

    return promise
  }

  async dispatchRequest(options: DispatchUFetchOptions): Promise<Response> {
    const { timeout, url, ...fetchOptions } = options

    const abortController = new AbortController()

    let timer: NodeJS.Timeout

    if (options.signal) {
      options.signal.addEventListener('abort', () => abortController.abort())
    }

    const finalOptions: RequestInit = {
      ...fetchOptions,
      signal: abortController.signal,
    }

    let timeoutPromise

    if (timeout) {
      timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`Request timed out after ${timeout}ms`))
          abortController.abort()
        }, timeout)
      })
    }

    return timeoutPromise
      ? await Promise.race([fetch(url, finalOptions), timeoutPromise])
      : await fetch(url, finalOptions).finally(() => {
          timer && clearTimeout(timer)
        })
  }
}
