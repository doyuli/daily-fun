<script setup lang="ts">
import { useResetableRef } from '@daily-fun/core'

const [state, reset] = useResetableRef({
  a: 1,
  b: 2,
})
</script>

<template>
  <div>
    <pre lang="json" class="ml-2">{{ state }}</pre>
    <button @click="reset">
      reset
    </button>
    <button @click="state.a++">
      a++
    </button>
  </div>
</template>
