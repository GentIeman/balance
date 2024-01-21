<template>
  <header>
    <h1 class="flex flex-col text-zinc-800 text-[40px] font-semibold">
      {{ props.title }}
      <span class="text-zinc-800 text-lg font-light"> {{ props.subtitle }} </span>
    </h1>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string,
  subtitle?: string
}>()
</script>

<style scoped>

</style>