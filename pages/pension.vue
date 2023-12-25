<template>
  <AppHeader
    title="Pension (beta)"
    subtitle="It is worth thinking about pension today"
  />
  <div
    v-if="getCategories().length > 0"
    class="grid grid-flow-col auto-cols-fr gap-5"
  >
    <UCard>
      <template #header>
        <header>
          <h2 class="flex flex-col gap-3 text-black-400 text-lg font-semibold">
            Pension budget: {{ pensionData.pensionBudget }}
            <span class="text-gray-600 text-base font-normal">Start pension year: {{ new Date(user.pensionYear).getFullYear() }}</span>
          </h2>
        </header>
      </template>
      <UContainer class="grid gap-5">
        <div class="flex flex-col items-end gap-2">
          <UProgress
            indicator
            :value="calcProgress(pensionData.annualSavings, pensionData.pensionBudget)"
          />
          <p class="text-black text-opacity-50 text-xs font-normal leading-tight">
            {{ pensionData.annualSavings }} in year / {{ pensionData.pensionBudget }}
          </p>
        </div>
        <div class="flex flex-col gap-3">
          <h3 class="text-black-400 text-lg font-semibold">
            Expenses for the current year
          </h3>
          <AppTable
            :columns="totalExpensesColumns"
            :page-count="3"
            :payload="predictYearlyExpensesByCategories(getCategories())"
          />
        </div>
      </UContainer>
    </UCard>
    <UCard>
      <template #header>
        <header>
          <h2 class="flex flex-col gap-3 text-black-400 text-lg font-semibold">
            Expenses reduction
          </h2>
        </header>
      </template>
      <UContainer class="grid gap-5">
        <AppTable
          :columns="expectedExpensesColumns"
          :page-count="3"
          :payload="reduceExpenses(getCategories())"
        />
      </UContainer>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import {UCard, UContainer, UProgress} from "#components"
import AppHeader from "~/components/AppHeader.vue"
import AppTable from "~/components/AppTable.vue"
import {useAuthStore} from "~/store/authStore"
import {calcProgress} from "~/utils/tools"
import {useBalanceStore} from "~/store/balanceStore"
import {storeToRefs} from "pinia"

const authStore = useAuthStore()
const user = authStore.user

const balanceStore = useBalanceStore()
const {getCategories} = storeToRefs(balanceStore)

const calculatePension = (salary: number, pensionDate: number) => {
  const pensionDateObject = new Date(pensionDate)
  const currentDate = new Date()
  const yearsDifference = pensionDateObject.getFullYear() - currentDate.getFullYear()

  const annualAmount = salary * 0.1
  const pensionUpToYear = (annualAmount * yearsDifference)

  return { pensionBudget: pensionUpToYear, annualSavings: annualAmount }
}

const pensionData = computed(() => calculatePension(user.salary, user.pensionYear))

const predictYearlyExpensesByCategories = (categories: object[]) => {
  const monthsInYear: number = 12
  const yearlyExpenses: object[] = []

  for (const category of categories) {
    const totalExpenses: number = balanceStore.getTotalCategoryExpenses(category)
    const averageMonthlyExpenses: number = totalExpenses / monthsInYear
    const yearlyExpense: number = averageMonthlyExpenses * monthsInYear

    yearlyExpenses.push({ category: category.title, expenses: yearlyExpense })
  }

  return yearlyExpenses
}

const reduceExpenses = (categories: string[]) => {
  const result: object[] = []

  categories.forEach(category => {
    const currentCategoryExpenses: number = balanceStore.getTotalCategoryExpenses(category)
    const expectedExpenses: number = currentCategoryExpenses / 2
    const expectedExpensesForCategory: number = expectedExpenses / categories.length

    result.push({category: category.title, currentExpenses: currentCategoryExpenses, expectedExpenses: expectedExpensesForCategory})
  })

  return result
}

onBeforeMount(async () => {
  if (balanceStore.categories.length == 0) await balanceStore.fetchUserCategories(user.id)
})
</script>

<style scoped>

</style>