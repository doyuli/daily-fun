<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import HelloWorld from '../components/HelloWorld.vue'

import { useWatermark } from '~/func/useWatermark'

const { Watermark } = useWatermark({
  font: '16px sans-serif'
})
</script>

<template>
  <div class="home-container">
    <section class="home-wrapper">
      <header>
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

        <div class="wrapper">
          <Watermark>
            <HelloWorld msg="You did it!" />
          </Watermark>
        </div>
      </header>
      <main>
        <TheWelcome />
      </main>
    </section>
  </div>
</template>

<style scoped>
.home-wrapper {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-weight: normal;
}

@media (min-width: 1024px) {
  .home-container {
    display: flex;
    place-items: center;
    min-height: 100vh;
  }

  .home-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
