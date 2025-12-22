---
category: Utils
related: eventBus
---

# eventBus

简易事件总线，支持 `on`、`off`、`once`、`emit`、`clear`。

## Usage

```ts twoslash
import { bus } from '@daily-fun/shared'

const stop = bus.on('ping', (msg: string) => {
  console.log(msg)
})

bus.emit('ping', 'hello')

stop()
```
