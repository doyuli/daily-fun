import { describe, expect, it, vi } from 'vitest'
import { EventBus } from '.'

describe('taskScheduler', () => {
  it('should be in singleton mode', () => {
    const bus1 = EventBus.getInstance()
    const bus2 = EventBus.getInstance()

    expect(bus1).toBe(bus2)
  })

  it('should trigger event handler when event is emitted', async () => {
    const bus = EventBus.getInstance()
    const handler = vi.fn()
    const payload = [1, 2, 3]

    bus.on('test', handler)

    bus.emit('test', payload)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(payload)
  })

  it('should not trigger handler after off() is called', async () => {
    const bus = EventBus.getInstance()
    const handler1 = vi.fn()
    const handler2 = vi.fn()
    const payload = [1, 2, 3]

    bus.on('test', handler1)
    bus.on('test', handler2)

    bus.off('test', handler1)

    bus.emit('test', payload)

    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).toHaveBeenCalledTimes(1)
    expect(handler2).toHaveBeenCalledWith(payload)
  })

  it('should trigger once handler only one time', () => {
    const bus = EventBus.getInstance()
    const handler = vi.fn()
    const payload = [1, 2, 3]

    bus.once('test', handler)

    bus.emit('test', payload)
    bus.emit('test', payload)

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(payload)
  })
})

it('should clear all handlers after clear() is called', () => {
  const bus = EventBus.getInstance()
  const handler = vi.fn()
  const payload = [1, 2, 3]

  bus.on('test', handler)

  bus.clear('test')

  bus.emit('test', payload)

  expect(handler).not.toHaveBeenCalled()
})
