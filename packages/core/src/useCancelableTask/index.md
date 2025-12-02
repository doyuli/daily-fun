---
category: Network
related: useCancelableTask
---

# useCancelableTask

useCancelableTask desc

## Usage

```ts {11} twoslash colorize-brackets
import { useCancelableTask } from '@daily-fun/core'
import {
  transformerTwoslash,
} from '@shikijs/twoslash'
import { shallowRef } from 'vue'

function getData() {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve('success')
    }, 1000)
  })
}

const { execute, cancel } = useCancelableTask(getData)
console.log('hello')
```
