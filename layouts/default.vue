<template>
  <div class="grid grid-cols-[300px_1fr] h-screen bg-gray-100">
    <AppSideBar />
    <slot />
  </div>
</template>

<script setup lang="ts">
import AppSideBar from "~/components/AppSideBar.vue"
</script>

<style scoped>

</style>