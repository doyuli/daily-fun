---
category: Utils
related: createContext
---

# createContext

创建可注入的上下文，提供 `useContext` 与 `provideContext`。

## Usage

```ts twoslash
import { createContext } from '@daily-fun/shared'
import { reactive } from 'vue'

interface ContentValue {
  count: number
}

const [useCounter, provideCounter] = createContext<ContentValue>('counter')

const state = reactive({ count: 0 })
provideCounter(state)
```
