<template>
  <AppHeader
    title="Expenses"
    subtitle="It is worth recording your expenses so as not to spend in the future"
  />
  <UCard>
    <template #header>
      <div class="flex justify-between">
        <h2 class="text-zinc-800 text-base font-semibold leading-tight">
          Categories
        </h2>
        <UButton
          icon="i-heroicons-plus"
          size="sm"
          @click="showCategoryForm({})"
        >
          New category
        </UButton>
      </div>
    </template>
    <AppTable
      @show-edit-form="showCategoryForm"
      @show-delete-form="showDeleteCategoryForm"
      :payload="categories"
      :page-count="5"
      :columns="categoriesTableColumns"
    />
    <UModal
      prevent-close
      v-model="isShowCategoryForm"
    >
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ category.id ? "Edit" : "Create" }} category
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isShowCategoryForm = false"
            />
          </div>
        </template>
        <CategoryForm
          :category="category"
          @close-modal="isShowCategoryForm = false"
        />
      </UCard>
    </UModal>
    <UModal
      prevent-close
      v-model="isShowDeleteCategoryForm"
    >
      <DeleteCategory
        @close-modal="isShowDeleteCategoryForm = false"
        :category="category"
      />
    </UModal>
  </UCard>
  <div class="grid grid-flow-col gap-10">
    <UCard>
      <template #header>
        <div class="flex justify-between">
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
        </div>
      </template>
      <AppTable
        @show-edit-form="showExpenseForm"
        @show-delete-form="showDeleteExpenseForm"
        :payload="expenses"
        :page-count="3"
        :columns="expensesTableColumns"
      />
      <UModal
        prevent-close
        v-model="isShowExpenseForm"
      >
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <div class="flex items-center justify-between">
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
            </div>
          </template>
          <expenseForm
            :expense="expense"
            @close-modal="isShowExpenseForm = false"
          />
        </UCard>
      </UModal>
      <UModal
        prevent-close
        v-model="isShowDeleteExpenseForm"
      >
        <DeleteExpense
          @close-modal="isShowDeleteExpenseForm = false"
          :expense="expense"
        />
      </UModal>
    </UCard>
    <UCard
      :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
    >
      <template #header>
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Categories-wise Overview
        </h3>
      </template>
      <Pie
        class="m-auto"
        :data="categoriesChartData"
        :options="chartOptions"
      />
    </UCard>
  </div>
  <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
    <Bar
      :data="expensesChartData"
      :options="chartOptions"
    />
  </UCard>
</template>

<script setup lang="ts">
import AppHeader from "~/components/AppHeader.vue"
import {useBalanceStore} from "~/store/balanceStore"
import {useAuthStore} from "~/store/authStore"
import AppTable from "~/components/AppTable.vue"
import {categoriesTableColumns, expensesTableColumns} from "~/utils/tableSchemes"
import {UButton, UCard, UModal} from "#components"
import CategoryForm from "~/components/forms/categoryForm.vue"
import DeleteCategory from "~/components/forms/deleteCategory.vue"
import expenseForm from "~/components/forms/expenseForm.vue"
import DeleteExpense from "~/components/forms/deleteExpense.vue"
import {Bar, Pie} from 'vue-chartjs'
import {generateDaysBar, generatePieChart} from "~/utils/chartUtils"

const balanceStore = useBalanceStore()
const authStore = useAuthStore()
const user = authStore.user
const categories = computed(() => balanceStore.getReverseCategories)
const expenses = computed(() => balanceStore.getCategoriesExpenses)

const category = ref<object>({})
const expense = ref<object>({})

const isShowCategoryForm = ref<boolean>(false)
const isShowDeleteCategoryForm = ref<boolean>(false)
const isShowExpenseForm = ref<boolean>(false)
const isShowDeleteExpenseForm = ref<boolean>(false)

const showCategoryForm = (item: object) => {
  category.value = item
  isShowCategoryForm.value = true
}

const showDeleteCategoryForm = (item: object) => {
  category.value = item
  isShowDeleteCategoryForm.value = true
}

const showExpenseForm = (item: object) => {
  expense.value = item
  isShowExpenseForm.value = true
}

const showDeleteExpenseForm = (item: object) => {
  expense.value = item
  isShowDeleteExpenseForm.value = true
}

const expensesChartConfig = {
  structure: {
    date: "createdAt",
    content: "amount"
  },
  days: 7,
  chartLabel: "Expenses for 7 days",
  backgroundColor: "cyan"
}

const categoriesChartConfig = {
  label: "title",
  dataKey: "totalExpenses",
  colorKey: "color"
}

const totalExpenses = computed(() => balanceStore.getTotalCategoryExpenses())
const expensesChartData = computed(() => generateDaysBar(expenses.value, expensesChartConfig))
const categoriesChartData = computed(() => generatePieChart(totalExpenses.value, categoriesChartConfig))

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: true,
})

onBeforeMount(async () => {
  if (balanceStore.categories.length == 0) await balanceStore.fetchUserCategories(user.id)
})

definePageMeta({
  middleware: ["auth"]
})
</script>