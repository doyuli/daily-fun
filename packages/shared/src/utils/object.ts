export function isEmptyObject(obj: Record<PropertyKey, any>) {
  return Reflect.ownKeys(obj).length === 0
}

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj)
      result[key] = obj[key]
  }
  return result
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj }
  for (const key of keys)
    delete result[key]

  return result
}
