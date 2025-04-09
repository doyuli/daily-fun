import { describe, it, expect, vi } from 'vitest'
import { filter } from '.'

describe('filter', () => {
  const isEven = (num: number) => num % 2 === 0

  it('should handle an empty array', () => {
    const result = filter([], isEven)

    expect(result).toEqual([])
  })

  it('should skip sparse array elements', () => {
    const cb = vi.fn()
    const arr = [1, , 3]

    filter(arr, cb)

    expect(cb.mock.calls.length).toBe(2)
    expect(cb.mock.calls[0]).toEqual([1, 0, arr])
    expect(cb.mock.calls[1]).toEqual([3, 2, arr])
  })

  it('should bind the correct context to the callback', () => {
    const arr = [1, 2, 3]
    const context = { threshold: 2 }
    const isGreaterThanThreshold = function (this: any, num: number) {
      return num > this.threshold
    }

    const result = filter(arr, isGreaterThanThreshold, context)

    expect(result).toEqual([3])
  })

  it('should only keep even numbers', () => {
    const result = filter([1, 2, 3, 4, 5, 6], isEven)

    expect(result).toEqual([2, 4, 6])
  })

  it('should only keep numbers', () => {
    const result = filter(['test', 2, 3, 'even'], Number)

    expect(result).toEqual([2, 3])
  })
})
