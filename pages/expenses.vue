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
      title="Categories"
      :rows="categories"
      :columns="categoriesTableColumns"
    />
    <UModal
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
      title="Expenses"
      :rows="expenses"
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

const balanceStore = useBalanceStore()
const authStore = useAuthStore()
const user = authStore.user
const categories = computed(() => balanceStore.getCategories())
const expenses = computed(() => balanceStore.getExpenses())

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

onBeforeMount(async () => {
  if (balanceStore.categories.length == 0) await balanceStore.fetchUserCategories(user.id)
})
</script>