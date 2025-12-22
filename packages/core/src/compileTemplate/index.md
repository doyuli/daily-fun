---
category: Utils
related: compileTemplate
---

# compileTemplate

<span v-pre>将字符串模板中的 `{{ ... }}` 代码片段在沙箱中执行，并以提供的上下文返回结果与错误信息。</span>

## Usage

```ts twoslash
import { compileTemplate } from '@daily-fun/core'

const tpl = 'Hello {{ user.name }}, upper: {{ upper(user.name) }}'

const { result, error } = compileTemplate(tpl, {
  user: { name: 'Doyuli' },
  upper: (s: string) => s.toUpperCase(),
})
```
