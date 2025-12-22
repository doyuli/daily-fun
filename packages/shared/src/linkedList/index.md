---
category: Utils
related: linkedList
---

# linkedList

简单的链表实现，支持 `push`、`pop`、`shift`、`unshift`、`remove`、`find`、`has`、`toArray`、`toString` 等。

## Usage

```ts twoslash
import { LinkedList } from '@daily-fun/shared'

const list = new LinkedList<number>()

list.push(1)
list.push(2)
list.unshift(0)

list.pop()
list.shift()

list.toArray()
list.toString()
```
