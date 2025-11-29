export type Fn = () => void
export type AnyFn<T = any> = (...args: any[]) => T
export type IsAny<T> = 0 extends (1 & T) ? true : false
