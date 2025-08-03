<script setup lang="ts">
import { onErrorCaptured, shallowRef } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

const error = shallowRef<Error | null>(null)
onErrorCaptured((err) => {
  console.error('💥 Captured error at root', err)
  error.value = err
})
</script>

<template>
  <AppHeader />

  <div v-if="error">
    <pre>{{ error }}</pre>
  </div>

  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Transition mode="out-in">
        <KeepAlive>
          <Suspense>
            <component :is="Component" />

            <template #fallback>
              Loading...
            </template>
          </Suspense>
        </KeepAlive>
      </Transition>
    </template>
  </RouterView>
</template>

<style scoped></style>
