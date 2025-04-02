import { describe, it, expect, vi } from 'vitest'
import { filter } from './filter'

describe('filter', () => {
  const isEven = (num: number) => num % 2 === 0

  it('处理空数组', () => {
    const arr = []

    const result = filter(arr, isEven)

    expect(result).toEqual([])
  })

  it('处理错误参数', () => {
    expect(() => filter(null as any, isEven)).toThrowError('arr is not an array')
    expect(() => filter(undefined as any, isEven)).toThrowError('arr is not an array')
    expect(() => filter({} as any, isEven)).toThrowError('arr is not an array')
    expect(() => filter('not an array' as any, isEven)).toThrowError('arr is not an array')
    expect(() => filter([], false as any)).toThrowError('callback must be a function')
  })

  it('处理稀疏数组', () => {
    const cb = vi.fn()
    const arr = [1, , 3]

    filter(arr, cb)

    expect(cb.mock.calls.length).toBe(2) // 只调用两次，跳过空值
    expect(cb.mock.calls[0]).toEqual([1, 0, arr]) // 第一次调用的参数
    expect(cb.mock.calls[1]).toEqual([3, 2, arr]) // 第三次调用的参数
  })

  it('处理绑定 this 上下文', () => {
    const arr = [1, 2, 3]
    const context = { threshold: 2 }
    const isGreaterThanThreshold = function (this: any, num: number) {
      return num > this.threshold
    }

    const result = filter(arr, isGreaterThanThreshold, context)

    expect(result).toEqual([3]) // 只保留大于 threshold 的元素
  })

  it('只保留偶数', () => {
    const arr = [1, 2, 3, 4, 5, 6]

    const result = filter(arr, isEven)

    expect(result).toEqual([2, 4, 6])
  })

  it('只保留数字', () => {
    const arr: any[] = ['test', 2, 3, 'even']

    const result = filter(arr, Number)

    expect(result).toEqual([2, 3])
  })
})
