<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

function pathToComponentName(path: string): string {
  return path
    .replace(/^[/\-_]+/, '')
    .replace(/[/\-_]+$/, '')
    .replace(/[/\-_]+(\w)/g, (_, c) => c.toUpperCase())
    .replace(/^(\w)/, (_, c) => c.toUpperCase())
}

const navs = computed(() => {
  return routes.map((route) => {
    const name = route.path === '/' ? 'Home' : pathToComponentName(route.path ?? 'index')
    return {
      name,
      path: route.path,
    }
  })
})
</script>

<template>
  <header>
    <nav>
      <RouterLink v-for="nav in navs" :key="nav.name" class="nav-link" :to="nav.path">
        {{ nav.name }}
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.nav-link:not(:last-child)::after {
  content: '|';
  margin: 0 0.75rem;
  color: #999;
}
</style>
