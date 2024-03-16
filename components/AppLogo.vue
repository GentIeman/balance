<template>
  <img
    :width="width"
    :height="height"
    src="/img/Logo.svg"
    alt="Logo"
  >
</template>

<script setup lang="ts">

interface ILogo {
  width: number,
  height: number
}

const {width, height} = defineProps<ILogo>()
</script>

<style scoped>

</style>