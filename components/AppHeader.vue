<template>
  <h1 class="flex flex-col text-zinc-800 text-[40px] font-semibold">
    {{ title }}
    <span class="text-zinc-800 text-lg font-light"> {{ subtitle }} </span>
  </h1>
</template>

<script setup lang="ts">
import type {IHeader} from "~/utils/interfaces"

defineProps<IHeader>()
</script>

<style scoped>

</style>