import { describe, it, expect, vi } from 'vitest'
import { LinkedList } from '.'

describe('linkedList', () => {
  it('should be define', () => {
    const linkedList = new LinkedList()

    linkedList.push(1)
    const head = linkedList.unshift()
    expect(head).toBe(1)
    expect(linkedList.print()).toBe('')

    linkedList.push(2)
    linkedList.push(3)
    expect(linkedList.print('=>', false)).toBe('2=>3')
    expect(linkedList.length()).toBe(2)
    expect(linkedList.has(2)).toBe(true)
    expect(linkedList.has(4)).toBe(false)
  })

  it('should handle empty list', () => {
    const list = new LinkedList()

    expect(list.unshift()).toBeUndefined()
    expect(list.print()).toBe('')
    expect(list.has(1)).toBe(false)

    const fn = vi.fn()
    for (const item of list) fn(item)
    expect(fn).not.toHaveBeenCalled()
  })

  it('should be iterator', () => {
    const linkedList = new LinkedList()
    const fn = vi.fn()

    linkedList.push(1)
    linkedList.push(2)
    linkedList.push(3)

    for (const linked of linkedList) {
      fn(linked)
      expect(fn).toBeCalledWith(linked)
    }

    expect(fn).toBeCalledTimes(3)
  })
})
