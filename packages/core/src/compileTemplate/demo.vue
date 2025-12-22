<script setup lang="ts">
import { compileTemplate } from '@daily-fun/core'
import { computed, ref } from 'vue'

const template = ref('Hello {{ user.name }}, upper: {{ upper(user.name) }}')
const contextText = ref(JSON.stringify({ user: { name: 'Doyuli' } }, null, 2))

const baseContext = computed(() => {
  try {
    return JSON.parse(contextText.value)
  }
  catch {
    return {}
  }
})

const context = computed(() => ({
  ...baseContext.value,
  upper: (s: string) => s.toUpperCase(),
}))

const output = computed(() => compileTemplate(template.value, context.value))
</script>

<template>
  <div class="grid gap-4">
    <div>
      <p>Template</p>
      <textarea v-model="template" rows="4" class="w-full"></textarea>
    </div>
    <div>
      <p>Context JSON</p>
      <textarea v-model="contextText" rows="6" class="w-full"></textarea>
    </div>
    <div>
      <p>Result</p>
      <pre lang="json" class="ml-2">{{ output.result }}</pre>
    </div>
    <div v-if="output.error">
      <p>Error</p>
      <pre lang="json" class="ml-2">{{ output.error }}</pre>
    </div>
  </div>
</template>
