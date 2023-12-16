<template>
  <NuxtLayout>
    <NuxtPage class="sm:px-[30px] py-[20px]" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import {NuxtPage, NuxtLayout} from "#components"
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  height: 100vh;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>