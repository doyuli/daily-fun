import type { AnyFn } from '@daily-fun/shared'

export class EventBus {
  private events: Map<string, Set<AnyFn>> = new Map()

  private constructor() {}
  private static instance: EventBus
  static getInstance() {
    return (EventBus.instance ??= new EventBus())
  }

  on(event: string, listener: AnyFn) {
    if (!this.events.has(event))
      this.events.set(event, new Set())

    this.events.get(event)!.add(listener)

    return () => this.off(event, listener)
  }

  off(event: string, listener: AnyFn) {
    const listeners = this.events.get(event)
    if (!listeners)
      return

    listeners.delete(listener)

    if (!listeners.size)
      this.events.delete(event)
  }

  emit(event: string, ...args: any[]) {
    this.events.get(event)?.forEach((listener) => {
      listener(...args)
    })
  }

  once(event: string, listener: AnyFn) {
    const onceListener = (...args: any[]) => {
      listener(...args)
      this.off(event, onceListener)
    }
    this.on(event, onceListener)
  }

  clear(event: string) {
    const listeners = this.events.get(event)
    if (!listeners)
      return

    listeners.clear()
    this.events.delete(event)
  }
}

export const bus = EventBus.getInstance()
