<template>
  <div class="grid grid-cols-[300px_1fr] h-100 bg-gray-100">
    <AppSideBar />
    <div class="grid auto-rows-max gap-10 sm:px-[30px] sm:py-[20px]">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSideBar from "~/components/AppSideBar.vue"
import {useAuthStore} from "~/store/authStore"
const authStore = useAuthStore()

authStore.cacheUser()
</script>

<style scoped>

</style>