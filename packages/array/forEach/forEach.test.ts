import { describe, it, expect, vi } from 'vitest'
import { forEach } from '.'

describe('forEach', () => {
  it('遍历数组并调用回调函数', () => {
    const arr = [1, 2, 3]
    const cb = vi.fn()

    forEach(arr, cb)

    expect(cb.mock.calls.length).toBe(3) // 回调函数被调用 3 次
    expect(cb.mock.calls[0]).toEqual([1, 0, arr]) // 第一次调用的参数
    expect(cb.mock.calls[1]).toEqual([2, 1, arr]) // 第二次调用的参数
    expect(cb.mock.calls[2]).toEqual([3, 2, arr]) // 第三次调用的参数
  })

  it('处理空数组', () => {
    const arr = []
    const cb = vi.fn()

    forEach(arr, cb)

    expect(cb.mock.calls.length).toBe(0) // 回调函数未被调用
  })

  it('处理绑定 this 上下文', () => {
    const arr = [1, 2, 3]
    const context = { multiplier: 2 }
    const cb = vi.fn(function (this: any, item: number) {
      return item * this.multiplier
    })

    forEach(arr, cb, context)

    expect(cb.mock.instances[0]).toBe(context) // this 上下文正确
    expect(cb.mock.results[0].value).toBe(2) // 1 * 2
    expect(cb.mock.results[1].value).toBe(4) // 2 * 2
    expect(cb.mock.results[2].value).toBe(6) // 3 * 2
  })

  it('处理传入的不是数组', () => {
    expect(() => forEach(null as any, vi.fn())).toThrowError('arr is not an array')
    expect(() => forEach(undefined as any, vi.fn())).toThrowError('arr is not an array')
    expect(() => forEach({} as any, vi.fn())).toThrowError('arr is not an array')
    expect(() => forEach('not an array' as any, vi.fn())).toThrowError('arr is not an array')
  })

  it('处理稀疏数组', () => {
    const arr = [1, , 3] // 稀疏数组
    const cb = vi.fn()

    forEach(arr, cb)

    expect(cb.mock.calls.length).toBe(2) // 只调用两次，跳过空值
    expect(cb.mock.calls[0]).toEqual([1, 0, arr]) // 第一次调用的参数
    expect(cb.mock.calls[1]).toEqual([3, 2, arr]) // 第三次调用的参数
  })
})
