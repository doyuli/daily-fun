import { describe, it, expect, vi } from 'vitest'
import { shuffle } from '.'

describe('shuffle', () => {
  it('should return new arrary', () => {
    const arr = [1, 2, 3, 4]

    const shuffled = shuffle(arr)

    expect(shuffled).not.toBe(arr)
    expect(arr).toEqual([1, 2, 3, 4])
  })

  it('should include all original elementss', () => {
    const arr = [1, 2, 3, 4]

    const shuffled = shuffle(arr)

    expect(shuffled).toHaveLength(arr.length)
    expect(shuffled.sort()).toEqual(arr.sort())
  })

  it('should handled empty or single', () => {
    expect(shuffle([])).toEqual([])
    expect(shuffle([1])).toEqual([1])
  })

  it('should generated different returns', () => {
    const arr = [1, 2, 3, 4]

    // 创建对 Math.random 的监听 强制第一次返回 0.5 第二次返回 0.3
    vi.spyOn(Math, 'random')
      .mockImplementationOnce(() => 0.5)
      .mockImplementationOnce(() => 0.3)

    expect(shuffle(arr)).not.toEqual(shuffle(arr))

    // 恢复原始实现
    vi.restoreAllMocks()
  })

  it('should generated same returns', () => {
    const arr = [1, 2, 3, 4]

    vi.spyOn(Math, 'random').mockImplementation(() => 0.5)

    expect(shuffle(arr)).toEqual(shuffle(arr))

    vi.restoreAllMocks()
  })
})
