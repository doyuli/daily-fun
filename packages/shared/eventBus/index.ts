import type { AnyFn } from '~/shared'

/**
 * 事件总线
 */
export class EventBus {
  private events: Record<string, Set<AnyFn>> = {}

  private constructor() {}
  private static instance: EventBus
  static getInstance() {
    return (EventBus.instance ??= new EventBus())
  }

  /**
   * 监听事件
   * @param eventName 事件名
   * @param cb 回调函数
   */
  on(eventName: string, cb: AnyFn) {
    ;(this.events[eventName] ??= new Set()).add(cb)
  }

  /**
   * 触发事件
   * @param eventName 事件名
   * @param args 参数
   */
  emit(eventName: string, ...args: any[]) {
    this.events[eventName]?.forEach((cb) => cb(...args))
  }

  /**
   * 移除事件
   * @param eventName 事件名
   * @param cb 回调函数
   */
  off(eventName: string, cb: AnyFn) {
    this.events[eventName]?.delete(cb)
  }

  /**
   * 一次性监听事件
   * @param eventName 事件名
   * @param cb 回调函数
   */
  once(eventName: string, cb: AnyFn) {
    const handle = (...args: any[]) => {
      cb(...args)
      this.off(eventName, handle)
    }
    this.on(eventName, handle)
  }
}

export const bus = EventBus.getInstance()
