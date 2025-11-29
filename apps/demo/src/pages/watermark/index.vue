<script setup lang="ts">
import { defineWatermark } from '@daily-fun/components'
import { shallowRef } from 'vue'

const text = shallowRef('Hello Daily Fun!')

const Watermark = defineWatermark({
  defaultText: 'Daily Fun',
  fillStyle: 'red',
  font: '14px sans-serif',
})
</script>

<template>
  <div>
    <input v-model="text" type="text">
    <Watermark :text>
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae numquam neque, vero dolores consectetur eaque minus similique facere aliquid aut accusamus eligendi. Rerum autem recusandae nesciunt. Saepe accusamus quas deserunt.
      Aspernatur maiores, iusto placeat distinctio unde, molestiae dolor ratione, voluptates esse dolorum nihil! Iusto eos, natus ut recusandae quidem quam, fuga explicabo nemo, quis inventore ipsum nulla expedita accusantium magni!
      Ipsum tempora adipisci harum atque doloremque officia laborum a assumenda esse in nisi voluptates laudantium consequuntur eaque quaerat quibusdam exercitationem eveniet sed impedit, aperiam ut vero reprehenderit culpa possimus. Facere.
      Unde, facere sequi, ipsa fugit culpa deleniti perferendis quasi, nobis aut saepe quae architecto fugiat deserunt sunt alias eum numquam aliquam? Quaerat, enim commodi! Esse unde aliquam debitis quis deleniti?
      Tenetur magni, quaerat officia neque ut reiciendis impedit, tempora qui dolores expedita perferendis. Quisquam eos illo, laudantium nemo natus ipsa beatae labore. Exercitationem minima accusamus vel corrupti in quidem vitae.
    </Watermark>
  </div>
</template>
