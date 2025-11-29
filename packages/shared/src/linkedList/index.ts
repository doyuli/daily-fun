export class LinkedNode<T = any> {
  _value
  next?: LinkedNode<T>
  constructor(value: T) {
    this._value = value
  }
}

export class LinkedList<T = any> {
  private _head: LinkedNode<T> | undefined
  private _tail: LinkedNode<T> | undefined
  private _length: number = 0

  constructor() {
    this.clear()
  }

  push(value: T) {
    const node = new LinkedNode(value)
    if (!this._head) {
      this._head = node
      this._tail = node
    }
    else {
      this._tail!.next = node
      this._tail = node
    }
    this._length++
  }

  unshift(value: T) {
    const node = new LinkedNode(value)
    if (!this._head) {
      this._head = node
      this._tail = node
    }
    else {
      node.next = this._head
      this._head = node
    }
    this._length++
  }

  shift() {
    if (!this._head)
      return undefined

    const value = this._head._value
    this._head = this._head.next

    if (!this._head) {
      this._tail = undefined
    }

    this._length--
    return value
  }

  pop() {
    if (!this._head)
      return undefined

    if (this._head === this._tail) {
      const value = this._head._value
      this.clear()
      return value
    }

    let current = this._head
    while (current.next && current.next !== this._tail) {
      current = current.next
    }

    const value = this._tail!._value
    current.next = undefined
    this._tail = current
    this._length--

    return value
  }

  get length() {
    return this._length
  }

  get first() {
    return this._head?._value
  }

  get last() {
    return this._tail?._value
  }

  has(value: unknown) {
    let current = this._head

    while (current) {
      if (Object.is(current._value, value)) {
        return true
      }
      current = current.next
    }

    return false
  }

  find(callback: (value: T) => boolean) {
    let current = this._head
    while (current) {
      if (callback(current._value)) {
        return current
      }
      current = current.next
    }
    return undefined
  }

  remove(value: T) {
    if (!this._head)
      return false

    if (Object.is(this._head._value, value)) {
      this.shift()
      return true
    }

    let current = this._head
    while (current.next) {
      if (Object.is(current.next._value, value)) {
        if (current.next === this._tail) {
          this._tail = current
        }
        current.next = current.next.next
        this._length--
        return true
      }
      current = current.next
    }
    return false
  }

  toArray() {
    const result: T[] = []
    let current = this._head
    while (current) {
      result.push(current._value)
      current = current.next
    }
    return result
  }

  toString(divider = ',') {
    let current = this._head
    const values: string[] = []

    while (current) {
      const value = JSON.stringify(current._value)
      values.push(value)
      current = current.next
    }

    return `LinkedList: [${values.join(divider)}]`
  }

  clear() {
    this._head = undefined
    this._tail = undefined
    this._length = 0
  }

  * [Symbol.iterator]() {
    let current = this._head
    while (current) {
      yield current._value
      current = current.next
    }
  }
}
