export type Fn = () => void

export type AnyFn<T = any> = (...args: any[]) => T
