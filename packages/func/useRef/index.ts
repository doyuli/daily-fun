import type { AnyFn } from '~/shared'

/**
 * VUE3 响应式的最小实现案例
 */

const targetMap = new WeakMap()

let activeEffect: Effect | null = null

class Effect {
  private _fn: Function
  constructor(fn: Function) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    this._fn()
    activeEffect = null
  }
}

function track(target: object, key: unknown) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)

  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }

  deps.add(activeEffect)
}

function trigger(target: object, key: unknown) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const deps = depsMap.get(key)
  if (!deps) return
  deps.forEach((effect: Effect) => {
    effect.run()
  })
}

export function effect(fn: AnyFn) {
  new Effect(fn).run()
}

export function useRef<T>(value: T) {
  const ref = {
    get value() {
      track(ref, 'value')
      return value
    },
    set value(newVal) {
      value = newVal
      trigger(ref, 'value')
    },
  }

  return ref
}

export function useReactive<T extends object>(value: T) {
  return new Proxy(value, {
    get(target, key, receiver) {
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      trigger(target, key)
      return result
    },
  })
}
