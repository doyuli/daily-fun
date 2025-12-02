# 开始使用

DailyFun 是一个基于 [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) 的工具函数集合。在继续之前，我们假设您已经熟悉 [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) 的基本概念。

## 安装

```bash
npm i @daily-fun/core
```

###### 示例项目

- [Vite + Vue 3](https://github.com/vueuse/vueuse-vite-starter)
- [Nuxt 3 + Vue 3](https://github.com/antfu/vitesse-nuxt3)
- [Webpack + Vue 3](https://github.com/vueuse/vueuse-vue3-example)

## 使用示例

只需从 `@daily-fun/core` 导入您需要的函数：

```vue twoslash
<script setup>
import { useCancelableTask } from '@daily-fun/core'

function asyncFunction() {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve('some...')
    }, 1000)
  })
}

// 可取消的异步函数
const { execute, cancel } = useCancelableTask(asyncFunction)

// 执行
execute()

// 取消
cancel()
</script>
```
