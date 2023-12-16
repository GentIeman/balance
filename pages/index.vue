<template>
  <AppHeader
    :title="setHeaderMeta(headerMeta, 'title')"
    :subtitle="setHeaderMeta(headerMeta, 'subtitle')"
  />
</template>

<script setup lang="ts">
const route = useRoute()

definePageMeta({
  middleware: ["auth"]
})

const headerMeta = [
  {title: "Dashboard", subtitle: "See your quick overview  data right here", page: "/"}
]
const setHeaderMeta = (meta: object, field: string): string => {
  for (let item of meta) {
    if (item.page == route.fullPath) return item[field]
  }
}

</script>

<style scoped>

</style>