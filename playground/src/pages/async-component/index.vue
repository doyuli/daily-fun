<script setup lang="ts">
import { defineAsyncComponent } from '@daily-fun/components'
import { h } from 'vue'

const AsyncComponent = defineAsyncComponent({
  loadingComponent: () => h('span', 'loading'),
  errorComponent: () => h('span', 'error'),
  loader: () => Promise.resolve(() => h('span', 'I am async component')),
})
</script>

<template>
  <div>
    <h1>AsyncComponent</h1>
    <AsyncComponent />
  </div>
</template>

<style scoped></style>
