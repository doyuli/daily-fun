import { describe, expect, it } from 'vitest'
import { LinkedList } from '.'

describe('linkedList', () => {
  it('should initialize as empty', () => {
    const list = new LinkedList()
    expect(list.length).toBe(0)
    expect(list.first).toBeUndefined()
    expect(list.last).toBeUndefined()
    expect(list.toArray()).toEqual([])
  })

  it('should push elements to the end', () => {
    const list = new LinkedList<number>()
    list.push(1)
    list.push(2)
    list.push(3)

    expect(list.length).toBe(3)
    expect(list.first).toBe(1)
    expect(list.last).toBe(3)
    expect(list.toArray()).toEqual([1, 2, 3])
  })

  it('should unshift elements to the beginning', () => {
    const list = new LinkedList<number>()
    list.unshift(3)
    list.unshift(2)
    list.unshift(1)

    expect(list.length).toBe(3)
    expect(list.first).toBe(1)
    expect(list.last).toBe(3)
    expect(list.toArray()).toEqual([1, 2, 3])
  })

  it('should shift elements from the beginning', () => {
    const list = new LinkedList<number>()
    list.push(1)
    list.push(2)
    list.push(3)

    expect(list.shift()).toBe(1)
    expect(list.length).toBe(2)
    expect(list.first).toBe(2)
    expect(list.last).toBe(3)
    expect(list.toArray()).toEqual([2, 3])

    expect(list.shift()).toBe(2)
    expect(list.shift()).toBe(3)
    expect(list.shift()).toBeUndefined()
    expect(list.length).toBe(0)
  })

  it('should pop elements from the end', () => {
    const list = new LinkedList<number>()
    list.push(1)
    list.push(2)
    list.push(3)

    expect(list.pop()).toBe(3)
    expect(list.length).toBe(2)
    expect(list.first).toBe(1)
    expect(list.last).toBe(2)
    expect(list.toArray()).toEqual([1, 2])

    expect(list.pop()).toBe(2)
    expect(list.pop()).toBe(1)
    expect(list.pop()).toBeUndefined()
    expect(list.length).toBe(0)
  })

  it('should handle single element operations', () => {
    const list = new LinkedList<number>()
    list.push(1)

    expect(list.length).toBe(1)
    expect(list.first).toBe(1)
    expect(list.last).toBe(1)

    expect(list.shift()).toBe(1)
    expect(list.length).toBe(0)
    expect(list.first).toBeUndefined()
    expect(list.last).toBeUndefined()

    list.push(2)
    expect(list.pop()).toBe(2)
    expect(list.length).toBe(0)
  })

  it('should check if element exists using has', () => {
    const list = new LinkedList<number>()
    list.push(1)
    list.push(2)
    list.push(3)

    expect(list.has(2)).toBe(true)
    expect(list.has(4)).toBe(false)
    expect(list.has(1)).toBe(true)
    expect(list.has(3)).toBe(true)

    // Test with different types
    const mixedList = new LinkedList<any>()
    mixedList.push('hello')
    mixedList.push(42)
    mixedList.push({ a: 1 })

    expect(mixedList.has('hello')).toBe(true)
    expect(mixedList.has(42)).toBe(true)
    expect(mixedList.has({ a: 1 })).toBe(false) // Object.is comparison
  })

  it('should find elements using callback', () => {
    const list = new LinkedList<number>()
    list.push(1)
    list.push(2)
    list.push(3)
    list.push(4)

    const found = list.find(value => value > 2)
    expect(found).toBeDefined()
    expect(found!._value).toBe(3)

    const notFound = list.find(value => value > 10)
    expect(notFound).toBeUndefined()
  })

  it('should remove elements by value', () => {
    const list = new LinkedList<number>()
    list.push(1)
    list.push(2)
    list.push(3)
    list.push(2)
    list.push(4)

    expect(list.remove(2)).toBe(true) // Removes first occurrence
    expect(list.toArray()).toEqual([1, 3, 2, 4])
    expect(list.length).toBe(4)

    expect(list.remove(1)).toBe(true) // Remove first element
    expect(list.toArray()).toEqual([3, 2, 4])

    expect(list.remove(4)).toBe(true) // Remove last element
    expect(list.toArray()).toEqual([3, 2])

    expect(list.remove(10)).toBe(false) // Remove non-existent element
    expect(list.toArray()).toEqual([3, 2])
  })

  it('should convert to array correctly', () => {
    const list = new LinkedList<number>()
    expect(list.toArray()).toEqual([])

    list.push(1)
    expect(list.toArray()).toEqual([1])

    list.push(2)
    list.push(3)
    expect(list.toArray()).toEqual([1, 2, 3])

    list.unshift(0)
    expect(list.toArray()).toEqual([0, 1, 2, 3])
  })

  it('should generate correct string representation', () => {
    const list = new LinkedList<number>()
    expect(list.toString()).toBe('LinkedList: []')

    list.push(1)
    expect(list.toString()).toBe('LinkedList: [1]')

    list.push(2)
    list.push(3)
    expect(list.toString()).toBe('LinkedList: [1,2,3]')

    expect(list.toString(' -> ')).toBe('LinkedList: [1 -> 2 -> 3]')
  })

  it('should clear the list', () => {
    const list = new LinkedList<number>()
    list.push(1)
    list.push(2)
    list.push(3)

    expect(list.length).toBe(3)
    expect(list.first).toBe(1)
    expect(list.last).toBe(3)

    list.clear()

    expect(list.length).toBe(0)
    expect(list.first).toBeUndefined()
    expect(list.last).toBeUndefined()
    expect(list.toArray()).toEqual([])
  })

  it('should support iteration', () => {
    const list = new LinkedList<number>()
    list.push(1)
    list.push(2)
    list.push(3)

    const result: number[] = []
    for (const value of list) {
      result.push(value)
    }

    expect(result).toEqual([1, 2, 3])
  })

  it('should handle edge cases with shift and pop', () => {
    const list = new LinkedList<number>()

    // Shifting from empty list
    expect(list.shift()).toBeUndefined()
    expect(list.length).toBe(0)

    // Popping from empty list
    expect(list.pop()).toBeUndefined()
    expect(list.length).toBe(0)

    // Single element operations
    list.push(42)
    expect(list.shift()).toBe(42)
    expect(list.length).toBe(0)

    list.push(42)
    expect(list.pop()).toBe(42)
    expect(list.length).toBe(0)
  })

  it('should maintain correct tail reference after operations', () => {
    const list = new LinkedList<number>()
    list.push(1)
    expect(list.last).toBe(1)

    list.push(2)
    expect(list.last).toBe(2)

    list.push(3)
    expect(list.last).toBe(3)

    list.pop()
    expect(list.last).toBe(2)

    list.shift()
    expect(list.first).toBe(2)
    expect(list.last).toBe(2)

    list.pop()
    expect(list.first).toBeUndefined()
    expect(list.last).toBeUndefined()
  })

  it('should handle object values correctly', () => {
    const list = new LinkedList<{ id: number, name: string }>()
    const obj1 = { id: 1, name: 'Alice' }
    const obj2 = { id: 2, name: 'Bob' }

    list.push(obj1)
    list.push(obj2)

    expect(list.length).toBe(2)
    expect(list.first).toBe(obj1)
    expect(list.last).toBe(obj2)
    expect(list.has(obj1)).toBe(true)
    expect(list.has({ id: 1, name: 'Alice' })).toBe(false) // Different object reference
  })
})
