import { describe, it, expect, vi } from 'vitest'
import { forEach } from '.'

describe('forEach', () => {
  it('should call callback for each item in the array', () => {
    const arr = [1, 2, 3]
    const cb = vi.fn()

    forEach(arr, cb)
    // cb 被调用三次
    expect(cb.mock.calls.length).toBe(3)
    expect(cb.mock.calls[0]).toEqual([1, 0, arr])
    expect(cb.mock.calls[1]).toEqual([2, 1, arr])
    expect(cb.mock.calls[2]).toEqual([3, 2, arr])
  })

  it('should handle an empty array', () => {
    const cb = vi.fn()

    forEach([], cb)

    expect(cb.mock.calls.length).toBe(0)
  })

  it('should bind the correct context to the callback', () => {
    const arr = [1, 2, 3]
    const context = { multiplier: 2 }
    const cb = vi.fn(function (this: any, item: number) {
      return item * this.multiplier
    })

    forEach(arr, cb, context)

    expect(cb.mock.instances[0]).toBe(context)
    expect(cb.mock.results[0].value).toBe(2)
    expect(cb.mock.results[1].value).toBe(4)
    expect(cb.mock.results[2].value).toBe(6)
  })

  it('should throw error when the first argument is not an array', () => {
    expect(() => forEach(null as any, vi.fn())).toThrowError(
      'Expected an array, but received object',
    )
    expect(() => forEach(undefined as any, vi.fn())).toThrowError(
      'Expected an array, but received undefined',
    )
    expect(() => forEach({} as any, vi.fn())).toThrowError('Expected an array, but received object')
    expect(() => forEach('not an array' as any, vi.fn())).toThrowError(
      'Expected an array, but received string',
    )
  })

  it('should skip sparse array elements', () => {
    const arr = [1, , 3]
    const cb = vi.fn()

    forEach(arr, cb)

    expect(cb.mock.calls.length).toBe(2)
    expect(cb.mock.calls[0]).toEqual([1, 0, arr])
    expect(cb.mock.calls[1]).toEqual([3, 2, arr])
  })
})
