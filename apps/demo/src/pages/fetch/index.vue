<script setup lang="ts">
import { UFetch } from '@daily-fun/core'

const ufetch = new UFetch()

ufetch.interceptors.request.use(
  (config) => {
    console.log('request1',config);
    throw new Error('custom err')
    return config
  },
  (error) => {
    console.log('request1 error',error);
    return error
  },
  {
    synchronous: true
  }
)

ufetch.interceptors.request.use(
  (config) => {
    console.log('request2',config);
    return config
  },
  (error) => {
    console.log('request2 error',error);
    return error
  },
  {
    synchronous: true
  }
)

ufetch.interceptors.response.use(
  (resp) => {
    console.log('response1',resp);
    return resp.json()
  },
  (error) => {
    console.log('response1 error',error);
    return error
  }
)

ufetch.interceptors.response.use(
  (resp) => {
    console.log('response2',resp);
    return resp
  },
  (error) => {
    console.log('response2 error',error);
    return error
  }
)

async function getData() {
  const data = await ufetch.request('https://jsonplaceholder.typicode.com/todos/1')
  console.log("🚀 ~ getData ~ data:", data)
}
</script>

<template>
  <div>
    <h1>UFetch</h1>
    <div>
      <button @click="getData">execute</button>
    </div>
  </div>
</template>

<style scoped></style>
