<template>
  <UContainer
    class="w-full"
    v-if="expensesCount == 0"
  >
    <UCard class="flex flex-col w-full justify-center">
      <template #header>
        <header class="flex">
          <h2 class=" flex flex-col text-zinc-800 text-[30px] font-semibold">
            Hello 👋
            <span class="text-zinc-600 text-lg font-normal">You don't have any expenses yet</span>
          </h2>
        </header>
      </template>
      <UButton
        block
        @click="isShowCategoryForm = true"
      >
        First expense
      </UButton>
    </UCard>
    <UModal
      @submut.capture="isShowCategoryForm = false"
      v-model="isShowCategoryForm"
    >
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <header class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              First expense
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
        <AppForm
          @submit="initExpense($event.data)"
          dir="expense"
          :state="{}"
          :select-options="categoryList"
          type="Create"
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
      <UCard :class="{'col-span-2': expensesCount > 0, 'col-span-full': expensesCount == 0}">
        <template #header>
          <header class="flex justify-between">
            <h2 class="text-zinc-800 text-base font-semibold leading-tight">
              Categories Status
            </h2>
          </header>
        </template>
        <AppTable
          :rows="convertDatesInArray(categoryByExpense, 'createdAt', 'en-US', {day: 'numeric', month: 'long', year: 'numeric'})"
          :page-count="5"
          :columns="[
            {key: 'title', label: 'Title', sortable: true},
            {key: 'limit', label: 'Budget limit', sortable: true},
            {key: 'status', label: 'Status', sortable: true}
          ]"
        />
      </UCard>
      <UCard
        v-if="expensesCount > 0"
        class="col-span-1"
      >
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Categories-wise Overview
          </h3>
        </template>
        <UContainer class="grid place-items-center h-full w-full">
          <PieChart
            :data="categoryByExpense"
            :config="pieChartConfig"
            :options="{maintainAspectRatio: false}"
          />
        </UContainer>
      </UCard>
    </UContainer>
    <UContainer class="grid grid-cols-3 auto-rows-max gap-10 w-full sm:p-0 lg:p-0">
      <UCard
        class="col-span-1 max-h-[450px]"
      >
        <template #header>
          <header class="flex items-center justify-between">
            <h3 class="text-zinc-800 text-lg font-semibold">
              Top 3 savings
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
        v-if="expensesCount > 0"
        class="grid col-span-2 bg-white"
      >
        <UContainer class="h-full">
          <TimeLineBarChart
            locales="en-US"
            :locale-date-options="{ year: 'numeric', month: 'long' }"
            :data="expenses"
            :options="{maintainAspectRatio: false, responsive: true}"
            :config="timeLineBarConfig"
          />
        </UContainer>
      </UCard>
    </UContainer>
  </UContainer>
</template>

<script setup lang="ts">
import {UButton, UCard, UContainer, UModal, UProgress} from "#components"
import AppForm from "~/components/AppForm.vue"
import AppTable from "~/components/AppTable.vue"
import {useExpenseStore} from "~/store/expenseStore"
import TimeLineBarChart from "~/components/charts/timeLineBarChart.vue"
import PieChart from "~/components/charts/pieChart.vue"
import {useCategoryStore} from "~/store/categoryStore"
import convertDatesInArray from "~/utils/convertDatesInArray"
import {useSavingStore} from "~/store/savingStore"
import calcProgress from "~/utils/calcProgress"

const expenseStore = useExpenseStore()
const {
  expenses,
  expensesCount,
} = storeToRefs(expenseStore)
const {fetchUserExpenses, initExpense} = expenseStore

const categoryStore = useCategoryStore()
const {
  categoryList,
  categoryByExpense
} = storeToRefs(categoryStore)
const {fetchUserCategoryLimits} = categoryStore

const isShowCategoryForm = ref<boolean>(false)

const savingStore = useSavingStore()
const {sortedSavingsByPercent} = storeToRefs(savingStore)
const {fetchUserSavings} = savingStore
const topThreeSavings = computed(() => sortedSavingsByPercent.value.slice(0, 3))

const pieChartConfig: IPieChartConfig = {
  label: "title",
  dataKey: "totalExpenses",
  colorKey: "color"
}

const timeLineBarConfig: IBarChartConfig = {
  structure: {dateKey: "createdAt", contentKey: "amount"},
  months: 12,
  label: "Expenses by Month",
  backgroundColor: "cyan"
}

definePageMeta({middleware: ["auth"]})

useSeoMeta({
  title: "Dashboard",
  description: "See your quick overview data right here"
})

onBeforeMount(async () => {
  await fetchUserExpenses()
  await fetchUserCategoryLimits()
  await fetchUserSavings()
})

</script>