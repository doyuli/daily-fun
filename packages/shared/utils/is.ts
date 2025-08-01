export const hasOwn = <T extends object, K extends keyof T>(obj: T, key: K) => Object.hasOwn(obj, key)
export const isObject = (val: any) => typeof val === 'object' && val !== null
export const isArray = (val: any) => Array.isArray(val)
export const isFunction = (val: any) => typeof val === 'function'
export const isString = (val: any) => typeof val === 'string'
export const isNumber = (val: any) => typeof val === 'number'
