class LinkedNode<T = any> {
  _value
  next?: LinkedNode
  constructor(value: T) {
    this._value = value
  }
}

export class LinkedList {
  private _head: LinkedNode | undefined
  private _tail: LinkedNode | undefined
  private _length: number = 0

  constructor() {
    this.clear()
  }

  push(value: unknown) {
    const node = new LinkedNode(value)
    if (!this._head) {
      this._head = node
      this._tail = node
    } else {
      this._tail!.next = node
      this._tail = node
    }
    this._length++
  }

  unshift() {
    if (!this._head) return undefined

    const value = this._head._value
    this._head = this._head.next
    this._length--

    if (!this._head) {
      this._tail = undefined
    }

    return value
  }

  length() {
    return this._length
  }

  has(value: unknown) {
    let current = this._head

    while (current) {
      if (current._value === value) {
        return true
      }
      current = current.next
    }

    return false
  }

  print(divide = ' => ', print = true) {
    let current = this._head
    let result = ''
    while (current) {
      const value = JSON.stringify(current._value)

      result += result ? `${divide}${value}` : value
      current = current.next
    }

    print && console.log(`LinkedList print: ${result}`)

    return result
  }

  clear() {
    this._head = undefined
    this._tail = undefined
    this._length = 0
  }

  // 迭代器
  [Symbol.iterator]() {
    let current = this._head

    return {
      next() {
        if (current) {
          const value = current._value
          current = current.next
          return { value, done: false }
        } else {
          return { value: undefined as any, done: true }
        }
      },
    }
  }
}
