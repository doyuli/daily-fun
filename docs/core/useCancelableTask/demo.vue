<script setup lang="ts">
import { useCancelableTask } from '@daily-fun/core'
import { shallowRef } from 'vue'

const state = shallowRef('loading')

function getData() {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve('success')
    }, 1000)
  })
}

const { execute: _execute, cancel } = useCancelableTask(getData)

async function execute() {
  state.value = 'loading'
  state.value = await _execute()
}
execute()
</script>

<template>
  <div>
    <pre lang="json" class="ml-2">{{ state }}</pre>
    <button @click="execute">
      execute
    </button>
    <button @click="cancel">
      cancel
    </button>
  </div>
</template>
