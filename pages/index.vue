<template>
  <AppHeader
    title="Dashboard"
    subtitle="See your quick overview data right here"
  />
  <UContainer
    class="flex justify-center w-full sm:p-0 lg:p-0"
    v-if="categories.length == 0"
  >
    <UCard class="flex flex-col w-full justify-center">
      <template #header>
        <h2 class="flex flex-col text-zinc-800 text-[30px] font-semibold">
          Hello 👋
          <span class="text-zinc-600 text-lg font-normal">You don't have any categories yet</span>
        </h2>
      </template>
      <UButton
        block
        @click="isOpen = true"
      >
        Create category
      </UButton>
    </Ucard>
    <UModal
      prevent-close
      v-model="isOpen"
    >
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Create category
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpen = false"
            />
          </div>
        </template>
        <CategoryForm
          @close-modal="isOpen = false"
          :category="category"
        />
      </UCard>
    </UModal>
  </UContainer>
  <div
    v-else
    class="grid gap-10"
  >
    <UContainer class="flex justify-center w-full sm:p-5 bg-red-500 rounded-lg">
      <p class="text-white text-base font-semibold">
        Financial applications pacify spontaneous spending, help to save and multiply the accumulated
      </p>
    </UContainer>
    <div class="grid grid-cols-3 gap-10">
      <UCard class="col-span-2">
        <template #header>
          <div class="flex justify-between">
            <h2 class="text-zinc-800 text-base font-semibold leading-tight">
              Categories Status
            </h2>
          </div>
        </template>
        <AppTable
          :payload="categoriesWithStatus"
          :page-count="5"
          :columns="categoriesStatusTableColumns"
        />
      </UCard>
      <UCard
        class="col-span-1"
        :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
      >
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Categories-wise Overview
          </h3>
        </template>
        <UContainer class="grid place-items-center h-full">
          <Pie
            :data="categoriesChartData"
            :options="chartOptions"
          />
        </UContainer>
      </UCard>
    </div>
    <div class="grid grid-cols-3 auto-rows-max gap-10">
      <UCard
        class="col-span-1 max-h-[450px]"
      >
        <template #header>
          <header class="flex items-center justify-between">
            <h3 class="text-zinc-800 text-lg font-semibold">
              Savings
            </h3>
          </header>
        </template>
        <ul class="flex flex-col gap-10">
          <li
            class="w-full"
            v-for="saving in topThreeSavings"
            :key="saving.id"
          >
            <p class="text-cyan-950 text-lg font-semibold">
              {{ saving.title }}
            </p>
            <UProgress
              indicator
              :value="calcProgress(saving.currentAmount, saving.totalAmount)"
            />
            <p class="text-black text-opacity-80 text-xs font-normal">
              {{ saving.currentAmount ?? 0 }} / {{ saving.totalAmount }}
            </p>
          </li>
        </ul>
      </UCard>
      <UCard
        class="grid col-span-2 max-h-[450px] bg-white"
        :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
      >
        <UContainer class="h-full">
          <Bar
            :data="expensesChartData"
            :options="chartOptions"
          />
        </UContainer>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import {UButton, UCard, UContainer, UModal, UProgress} from "#components"
import AppHeader from "~/components/AppHeader.vue"
import CategoryForm from "~/components/forms/categoryForm.vue"
import {useBalanceStore} from "~/store/balanceStore"
import type {ICategory} from "~/utils/interfaces"
import {useAuthStore} from "~/store/authStore"
import {Bar, Pie} from "vue-chartjs"
import {generateMonthBar, generatePieChart} from "~/utils/chartUtils"
import {calcProgress} from "~/utils/tools"
import {categoriesStatusTableColumns} from "~/utils/tableSchemes"
import AppTable from "~/components/AppTable.vue"

const balanceStore = useBalanceStore()
const authStore = useAuthStore()
const user = authStore.user
const isOpen = ref<boolean>(false)

const topThreeSavings = computed(() => balanceStore.getSortedSavingsByPercent.slice(0, 3))
const categories = computed(() => balanceStore.getCategories())
const totalExpenses = computed(() => balanceStore.getTotalCategoryExpenses())
const expenses = computed(() => balanceStore.getCategoriesExpenses)

const setCategoriesStatus = (categories: object[]) => {
  return categories.map(category => ({
    ...category,
    status: balanceStore.getTotalCategoryExpenses(category) > category.budgetLimit
        ? {value: "Warn", class: "text-red-500"}
        : {value: "Good", class: "text-green-500"}
  }))
}

const categoriesWithStatus = computed(() => setCategoriesStatus(categories.value))

const categoriesChartConfig = {
  label: "title",
  dataKey: "totalExpenses",
  colorKey: "color"
}

const expensesChartConfig = {
  structure: {
    date: "createdAt",
    content: "amount"
  },
  months: 12,
  chartLabel: "Expenses by Month",
  backgroundColor: "cyan"
}

const categoriesChartData = computed(() => generatePieChart(totalExpenses.value, categoriesChartConfig))
const expensesChartData = computed(() => generateMonthBar(expenses.value, expensesChartConfig))

const chartOptions = ref({
  maintainAspectRatio: false,
})

const category = reactive<ICategory>({
  id: 0,
  title: "",
  budgetLimit: 10,
})

definePageMeta({
  middleware: ["auth"]
})

useSeoMeta({
  title: "Dashboard",
  description: "See your quick overview data right here"
})

onBeforeMount(async () => {
  if (balanceStore.categories.length == 0) await balanceStore.fetchUserCategories(user.id)
  if (balanceStore.savings.length == 0) await balanceStore.fetchUserSavings(user.id)
})

</script>