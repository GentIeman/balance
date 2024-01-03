<template>
  <div class="grid grid-cols-[300px_1fr] bg-gray-100">
    <AppSideBar class="row-span-full" />
    <section class="grid auto-rows-max gap-5 sm:p-5">
      <AppHeader
        v-if="getHeaderContent"
        :title="getHeaderContent.title"
        :subtitle="getHeaderContent.subtitle"
      />
      <div class="grid gap-10">
        <slot />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import AppSideBar from "~/components/AppSideBar.vue"
import AppHeader from "~/components/AppHeader.vue"

const route = useRoute()

interface IHeaderObject {
  path: string,
  title: string,
  subtitle?: string
}

const headerContent: IHeaderObject[] = [
  {path: "/", title: "Dashboard", subtitle: "See your quick overview data right here"},
  {path: "/expenses", title: "Expenses", subtitle: "It is worth recording your expenses so as not to spend in the future"},
  {path: "/pension", title: "Pension (beta)", subtitle: "It is worth thinking about pension today"},
  {path: "/savings", title: "Savings", subtitle: "Set savings for the future"}
]

const getHeaderContent = computed(() => headerContent.find((item: IHeaderObject) => item.path === route.path))

</script>

<style scoped>

</style>