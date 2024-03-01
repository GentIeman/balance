<template>
  <UContainer class="grid place-content-center w-full h-screen absolute top-0 left-0 bg-white z-10 max-w-none">
    <UIcon
      :name="props.icon"
      class="bg-cyan-500 motion-safe:animate-spin"
      :style="{'font-size': props.size}"
    />
  </UContainer>
</template>

<script setup lang="ts">
import {UContainer, UIcon} from "#components"
const props = defineProps<{
  icon: string,
  size: string
}>()
</script>

<style scoped>

</style>