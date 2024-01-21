<template>
  <UContainer
    class="w-full"
    v-if="getCategoriesCount == 0"
  >
    <UCard class="flex flex-col w-full justify-center">
      <template #header>
        <header class="flex">
          <h2 class=" flex flex-col text-zinc-800 text-[30px] font-semibold">
            Hello 👋
            <span class="text-zinc-600 text-lg font-normal">You don't have any categories yet</span>
          </h2>
        </header>
      </template>
      <UButton
        block
        @click="isShowCategoryForm = true"
      >
        Create category
      </UButton>
    </UCard>
    <UModal
      prevent-close
      v-model="isShowCategoryForm"
    >
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <header class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Create category
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isShowCategoryForm = false"
            />
          </header>
        </template>
        <CategoryForm
          @close-modal="isShowCategoryForm = false"
          :category="{}"
        />
      </UCard>
    </UModal>
  </UContainer>
  <UContainer
    v-else
    class="grid gap-10 w-full"
  >
    <UContainer class="flex justify-center w-full sm:p-5 bg-red-500 rounded-lg">
      <p class="text-white text-base font-semibold">
        Financial applications pacify spontaneous spending, help to save and multiply the accumulated
      </p>
    </UContainer>
    <UContainer class="grid grid-cols-3 gap-10 w-full sm:p-0 lg:p-0">
      <UCard :class="{'col-span-2': getExpensesCount > 0, 'col-span-full': getExpensesCount == 0}">
        <template #header>
          <header class="flex justify-between">
            <h2 class="text-zinc-800 text-base font-semibold leading-tight">
              Categories Status
            </h2>
          </header>
        </template>
        <AppTable
          :rows="getCategoryStatus"
          :page-count="5"
          :columns="[
            {key: 'title', label: 'Title', sortable: true},
            {key: 'budgetLimit', label: 'Limit', sortable: true},
            {key: 'status', label: 'Status', sortable: true}
          ]" 
        />
      </UCard>
      <UCard
        v-if="getExpensesCount > 0"
        class="col-span-1"
        :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
      >
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Categories-wise Overview
          </h3>
        </template>
        <UContainer class="grid place-items-center h-full w-full">
          <PieChart
            :data="getTotalExpensesByCategory()"
            :config="PieChartConfig"
            :options="{maintainAspectRatio: false}"
          />
        </UContainer>
      </UCard>
    </UContainer>
    <UContainer class="grid gap-10 w-full sm:p-0 lg:p-0">
      <UCard
        v-if="getExpensesCount > 0"
        class="grid col-span-2 bg-white"
        :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
      >
        <UContainer class="h-full">
          <TimeLineBarChart
            locales="en-US"
            :locale-date-options="{ year: 'numeric', month: 'long' }"
            :data="expenses"
            :options="{maintainAspectRatio: false, responsive: true}"
            interval="month"
            :config="timeLineBarConfig"
          />
        </UContainer>
      </UCard>
    </UContainer>
  </UContainer>
</template>

<script setup lang="ts">
import {UButton, UCard, UContainer, UModal} from "#components"
import CategoryForm from "~/components/forms/categoryForm.vue"
import AppTable from "~/components/AppTable.vue"
import {useExpenseStore} from "~/store/expenseStore"
import TimeLineBarChart from "~/components/charts/timeLineBarChart.vue"
import PieChart from "~/components/charts/pieChart.vue"
import type {IBarChartConfig} from "~/utils/interfaces"
import {useCategoryStore} from "~/store/categoryStore"

const expenseStore = useExpenseStore()
const {
  expenses,
  getExpensesCount
} = storeToRefs(expenseStore)
const {fetchUserExpenses} = expenseStore


const categoryStore = useCategoryStore()
const {
  getTotalExpensesByCategory,
  getCategoryStatus,
  getCategoriesCount
} = storeToRefs(categoryStore)

const isShowCategoryForm = ref<boolean>(false)

const PieChartConfig = {
  label: "title",
  dataKey: "totalExpenses",
  backgroundColor: "color"
}

const timeLineBarConfig: IBarChartConfig = {
  structure: {dateKey: "createdAt", contentKey: "amount"},
  months: 12,
  label: "Expenses by Month",
  backgroundColor: "cyan"
}

definePageMeta({ middleware: ["auth"] })

useSeoMeta({
  title: "Dashboard",
  description: "See your quick overview data right here"
})

onBeforeMount(async () => {
  await fetchUserExpenses()
})

</script>