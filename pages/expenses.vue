<template>
  <UContainer class="grid gap-5 w-full">
    <UCard>
      <template #header>
        <header class="flex justify-between">
          <h2 class="text-zinc-800 text-base font-semibold leading-tight">
            Categories
          </h2>
          <UButton
            icon="i-heroicons-plus"
            size="sm"
            @click="showCategoryLimitForm({})"
          >
            Set limit
          </UButton>
        </header>
      </template>
      <AppTable
        :rows="convertDatesInArray(categoryByExpense, 'createdAt', 'en-US', {day: 'numeric', month: 'long', year: 'numeric'})"
        :page-count="5"
        :columns="[
          { key: 'title', label: 'Title', sortable: true },
          { key: 'limit', label: 'Budget limit', sortable: true },
          { key: 'createdAt', label: 'Date creation', sortable: true },
          { key: 'actions' }
        ]"
        :actions="['clear limit']"
        @drop-down-event="setLimit($event.data)"
      />
      <UModal
        v-model="isShowCategoryLimitForm"
        @submit.capture="isShowCategoryLimitForm = false"
      >
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <header class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Set limit
              </h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isShowCategoryLimitForm = false"
              />
            </header>
          </template>
          <AppForm
            @submit="setLimit($event)"
            dir="category"
            :state="category"
            :select-options="categoryByExpense"
            type="Set limit"
          />
        </UCard>
      </UModal>
    </UCard>
    <UContainer class="grid grid-flow-col gap-5 lg:px-0 m-0">
      <UCard>
        <template #header>
          <header class="flex justify-between">
            <h2 class="text-zinc-800 text-base font-semibold leading-tight">
              Expenses
            </h2>
            <UButton
              icon="i-heroicons-plus"
              size="sm"
              @click="showExpenseForm({})"
            >
              Add expense
            </UButton>
          </header>
        </template>
        <AppTable
          :rows="convertDatesInArray(mapExpensesToCategories, 'createdAt', 'en-US', {day: 'numeric', month: 'long', year: 'numeric'} )"
          :page-count="3"
          :columns="[
            {key: 'amount', label: 'Amount', sortable: true},
            {key: 'category', label: 'Category', sortable: true},
            {key: 'createdAt', label: 'Date', sortable: true, type: 'date'},
            {key: 'actions'}
          ]"
          :actions="['edit', 'delete']"
          @drop-down-event="handleExpenseEvent($event)"
        />
      </UCard>
      <UModal
        v-model="isShowExpenseForm"
        @submit.capture="isShowExpenseForm = false"
      >
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <header class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                {{ expense.id ? "Edit" : "Create" }} expense
              </h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isShowExpenseForm = false"
              />
            </header>
          </template>
          <AppForm
            @submit="initExpense($event.data)"
            dir="expense"
            :state="expense"
            :select-options="categoryList"
            :type="expense.id ? 'Edit' : 'Create'"
          />
        </UCard>
      </UModal>
      <UModal
        v-model="isShowDeleteExpenseForm"
        @submit.capture="isShowDeleteExpenseForm = false"
      >
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Delete expense
              </h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isShowDeleteExpenseForm = false"
              />
            </div>
          </template>
          <AppDeleteForm
            item="expense"
            @close="isShowDeleteExpenseForm = $event"
            @submit="deleteExpense(expense)"
          />
        </UCard>
      </UModal>
      <UCard
        v-if="expensesCount > 0"
        :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
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
            :options="{responsive: true, maintainAspectRatio: false}"
          />
        </UContainer>
      </UCard>
    </UContainer>
    <UCard
      v-if="expensesCount > 0"
      :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
    >
      <UContainer class="h-full">
        <TimeLineBarChart
          locales="en-US"
          :locale-date-options="{ day: 'numeric' }"
          :data="expenses"
          :options="{maintainAspectRatio: false, responsive: true}"
          :config="timeLineBarConfig"
        />
      </UContainer>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import AppTable from "~/components/AppTable.vue"
import AppForm from "~/components/AppForm.vue"
import AppDeleteForm from "~/components/AppDeleteForm.vue"
import {UButton, UCard, UContainer, UModal} from "#components"
import {useExpenseStore} from "~/store/expenseStore"
import PieChart from "~/components/charts/pieChart.vue"
import TimeLineBarChart from "~/components/charts/timeLineBarChart.vue"
import convertDatesInArray from "~/utils/convertDatesInArray"
import {useCategoryStore} from "~/store/categoryStore"

const expenseStore = useExpenseStore()
const {
  fetchUserExpenses,
  initExpense,
  deleteExpense
} = expenseStore

const {
  expenses,
  expensesCount,
} = storeToRefs(expenseStore)

const categoryStore = useCategoryStore()
const {setLimit, fetchUserCategoryLimits} = categoryStore
const {
  categoryList,
  categoryByExpense,
  mapExpensesToCategories
} = storeToRefs(categoryStore)

const expense = ref<IExpense | object>({})
const category = ref<ICategory | object>({})

const isShowCategoryLimitForm = ref<boolean>(false)
const isShowExpenseForm = ref<boolean>(false)
const isShowDeleteExpenseForm = ref<boolean>(false)

const showExpenseForm = (item: object) => {
  expense.value = item
  isShowExpenseForm.value = true
}

const showCategoryLimitForm = (item: object) => {
  category.value = item
  isShowCategoryLimitForm.value = true
}

const handleExpenseEvent = (event: {data: object, type: string}) => {
  expense.value = event.data
  if (event.type == 'edit') {
    isShowExpenseForm.value = true
  } else {
    isShowDeleteExpenseForm.value = true
  }
}

const timeLineBarConfig: IBarChartConfig = {
  structure: {dateKey: "createdAt", contentKey: "amount"},
  days: 7,
  label: "Weekly expenses",
  backgroundColor: "cyan"
}

const pieChartConfig: IPieChartConfig = {
  label: "title",
  dataKey: "totalExpenses",
  colorKey: "color"
}

definePageMeta({
  middleware: ["auth"]
})

onBeforeMount(async () => {
  await fetchUserExpenses()
  await fetchUserCategoryLimits()
})

useSeoMeta({
  title: "Expenses",
  description: "It is worth recording your expenses so as not to spend in the future"
})
</script>