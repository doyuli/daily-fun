# 组件

我们引入了一个新的包，`@daily-fun/components`，提供了无渲染组件版本的可组合函数。

## 安装

```bash
npm i @daily-fun/core @daily-fun/components
```

## 使用

例如，对于 `defineAsyncComponent`，不再需要为函数绑定组件引用：

```vue twoslash
<script setup>
import type { Component } from 'vue'
import { defineAsyncComponent } from '@daily-fun/components'
import { h } from 'vue'

function loadComponent() {
  return new Promise<Component>((resolve) => {
    setTimeout(() => {
      resolve(h('input', { type: 'text' }))
    }, 1000)
  })
}

const AsyncComponent = defineAsyncComponent({
  loadingComponent: () => h('span', 'loading'),
  errorComponent: () => h('span', 'error'),
  loader: loadComponent,
})
</script>

<template>
  <div>
    <AsyncComponent />
  </div>
</template>
```

我们现在可以使用自动绑定的无渲染组件：

```vue
<script setup>
import { OnClickOutside } from '@daily-fun/components'

function close() {
  /* ... */
}
</script>

<template>
  <OnClickOutside @trigger="close">
    <div>
      Click Outside of Me
    </div>
  </OnClickOutside>
</template>
```

## 返回值

您可以使用 `v-slot` 访问返回值。

```vue
<template>
  <UseMouse v-slot="{ x, y }">
    x: {{ x }}
    y: {{ y }}
  </UseMouse>
</template>
```

```vue
<template>
  <UseDark v-slot="{ isDark, toggleDark }">
    <button @click="toggleDark()">
      Is Dark: {{ isDark }}
    </button>
  </UseDark>
</template>
```

请参考每个函数的文档以了解组件样式的详细用法。
