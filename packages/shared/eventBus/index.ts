import type { AnyFn } from '~/shared'

export class EventBus {
  private events: Record<string, Set<AnyFn>> = {}

  private constructor() {}
  private static instance: EventBus
  static getInstance() {
    return (EventBus.instance ??= new EventBus())
  }

  on(eventName: string, cb: AnyFn) {
    ;(this.events[eventName] ??= new Set()).add(cb)
  }

  emit(eventName: string, ...args: any[]) {
    this.events[eventName]?.forEach((cb) => cb(...args))
  }

  off(eventName: string, cb: AnyFn) {
    this.events[eventName]?.delete(cb)
  }

  once(eventName: string, cb: AnyFn) {
    const handle = (...args: any[]) => {
      cb(...args)
      this.off(eventName, handle)
    }
    this.on(eventName, handle)
  }
}

export const bus = EventBus.getInstance()
