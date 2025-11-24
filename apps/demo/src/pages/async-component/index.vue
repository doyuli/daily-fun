<script setup lang="ts">
import type { Component } from 'vue'
import { defineAsyncComponent } from '@daily-fun/components'
import { Input } from 'ant-design-vue'
import { h, shallowRef } from 'vue'

const input = shallowRef('async')

function loadComponent() {
  return new Promise<Component>((resolve) => {
    setTimeout(() => {
      resolve(Input)
    }, 1000)
  })
}

const AsyncInput = defineAsyncComponent({
  loadingComponent: () => h('span', 'loading'),
  errorComponent: () => h('span', 'error'),
  loader: loadComponent,
})
</script>

<template>
  <div>
    <h1>AsyncComponent</h1>
    <div>
      <p>
        asyncInput <AsyncInput v-model:value="input" class="w-300px" />
      </p>
      <p>asyncValue: {{ input }}</p>
    </div>
  </div>
</template>

<style scoped></style>
