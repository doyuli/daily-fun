<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { promiseResolve, promiseTimeout } from '~/shared'
import { useAsyncOnce, useCancelableTask } from '~/func'

/**
 * test useAsyncOnce
 */
const testUseAsyncOnce = () => {
  const { execute: getUserInfo } = useAsyncOnce((value: any) => {
    return promiseTimeout((resolve) => {
      console.log(value)
      resolve(value)
    }, 1000)
  })

  getUserInfo('useAsyncOnce')
  getUserInfo('useAsyncOnce')
  getUserInfo('useAsyncOnce')

  setTimeout(() => {
    getUserInfo('useAsyncOnce')
  }, 1001)
}

/**
 * test useCancelableTask
 */
const testUseCancelTask = async () => {
  const { execute, cancel } = useCancelableTask((value) => promiseResolve(value, 1000))
  execute('useCancelableTask').then((res) => {
    console.log("🚀 ~ execute ~ res:", res)
  })
  execute('useCancelableTask').then((res) => {
    console.log(res);
  })
  cancel()
}

onMounted(async () => {
  testUseAsyncOnce()
  testUseCancelTask()
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
