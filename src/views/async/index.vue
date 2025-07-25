<script setup lang="ts">
import { defineAsyncComponent } from '~/components/apiAsyncComponent'
import type { Component } from 'vue'
import { h } from 'vue'

const AsyncComponent = defineAsyncComponent({
  loader: () => {
    return new Promise<Component>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          props: ['msg'],
          setup(props, { slots }) {
            return () => h('div', [`${props.msg} async component`, h('h4', null, slots)])
          },
        })
      }, 1000)
    })
  },
  loadingComponent: () => h('div', 'loading'),
  errorComponent: () => h('div', 'error'),
})
</script>

<template>
  <div class="p4">
    <h1>AsyncComponent</h1>
    <AsyncComponent msg="hello,"> I am Slot </AsyncComponent>
  </div>
</template>

<style lang="scss" scoped></style>
