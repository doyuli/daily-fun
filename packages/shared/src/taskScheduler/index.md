---
category: Utils
related: taskScheduler
---

# taskScheduler

并发受限的任务调度器，控制同时运行的任务数。

## Usage

```ts twoslash
import { TaskScheduler } from '@daily-fun/shared'

const scheduler = new TaskScheduler(2)

function delayTask(id: number, ms: number) {
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve(`done_${id}`), ms)
  })
}

await scheduler.addTask(() => delayTask(1, 300))
await scheduler.addTask(() => delayTask(2, 200))
await scheduler.addTask(() => delayTask(3, 100))
```
