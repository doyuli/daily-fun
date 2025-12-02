---
category: State
related: useResetableRef
---

# useResetableRef

Resetable ref

## Usage

```ts {4} twoslash
import { useResetableRef } from '@daily-fun/core'

const counter = { a: 1, b: 2 }
const [state, reset] = useResetableRef(counter)
```
