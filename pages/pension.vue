<template>
  <AppHeader
    title="Pension (beta)"
    subtitle="It is worth thinking about pension today"
  />
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
          :columns="[{key: 'category', label: 'Category', sortable: true},{key: 'expenses', label: 'Total Expenses', sortable: true}]"
          :page-count="3"
          :payload="yearlyExpenses"
        />
      </div>
    </UContainer>
  </UCard>
</template>

<script setup lang="ts">
import {UCard, UContainer, UProgress} from "#components"
import AppHeader from "~/components/AppHeader.vue"
import AppTable from "~/components/AppTable.vue"
import {useAuthStore} from "~/store/authStore"
import {calcProgress} from "~/utils/tools"
import {useBalanceStore} from "~/store/balanceStore"

const authStore = useAuthStore()
const user = authStore.user

const balanceStore = useBalanceStore()
const categories = computed(() => balanceStore.getCategories())

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

const yearlyExpenses = computed(() => predictYearlyExpensesByCategories(categories.value))

onBeforeMount(async () => {
  if (balanceStore.categories.length == 0) await balanceStore.fetchUserCategories(user.id)
})
</script>

<style scoped>

</style>