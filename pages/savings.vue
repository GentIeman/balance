<template>
  <AppHeader
    title="Savings"
    subtitle="Set goals for the future"
  />
  <UContainer class="flex w-full h-100 sm:p-5 bg-white rounded-2xl shadow justify-between items-center">
    <p class="text-zinc-800 text-3em font-normal leading-none">
      Set new goals for yourself, to do this, click
    </p>
    <UButton
      icon="i-heroicons-plus"
      size="sm"
      @click="isShowGoalForm = true"
    >
      Add goal
    </UButton>
  </UContainer>
  <UCard
    class="max-w-[300px]"
    v-for="saving in savings"
    :key="saving.id"
  >
    <template #header>
      <header class="flex items-center justify-between">
        <p class="text-zinc-800 text-lg font-semibold leading-tight">
          {{ saving.title }}
          <UIcon
            v-if="saving.currentAmount >= saving.totalAmount"
            name="i-heroicons-check-badge-solid"
            class="text-green-600 text-lg"
          />
        </p>
        <UDropdown
          :items="actions(saving)"
          :popper="{placement: 'bottom-end'}"
        >
          <UButton
            color="gray"
            variant="solid"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </header>
    </template>
    <div class="flex flex-col items-end gap-2">
      <UProgress
        indicator
        :value="calcProgress(saving.currentAmount, saving.totalAmount)"
      />
      <p class="text-black text-opacity-80 text-xs font-normal">
        {{ saving.currentAmount ?? 0 }} / {{ saving.totalAmount }}
      </p>
    </div>
    <ul class="flex flex-col gap-2">
      <li class="text-gray-800 text-lg font-semibold">
        Details
      </li>
      <li class="text-black text-sm font-normal">
        End date: <time>{{ new Date(saving.endDate).toLocaleDateString() }}</time>
      </li>
    </ul>
  </UCard>
  <UModal
    prevent-close
    v-model="isShowGoalForm"
  >
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ goal.id ? "Edit" : "Create" }} goal
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="closeGoalForm"
          />
        </div>
      </template>
      <goalForm
        :user-salary="user.salary"
        :goal="goal"
        @close-modal="closeGoalForm"
      />
    </UCard>
  </UModal>
  <UModal
    prevent-close
    v-model="isShowDeleteGoalForm"
  >
    <DeleteGoal
      @close-modal="closeDeleteGoalForm"
      :goal="goal"
    />
  </UModal>
</template>

<script setup lang="ts">
import {UContainer, UButton, UCard, UDropdown, UProgress, UModal, UIcon} from "#components"
import AppHeader from "~/components/AppHeader.vue"
import {useBalanceStore} from "~/store/balanceStore"
import {useAuthStore} from "~/store/authStore"
import GoalForm from "~/components/forms/goalForm.vue"
import {calcProgress} from "~/utils/tools"
import DeleteGoal from "~/components/forms/deleteGoal.vue"
const balanceStore = useBalanceStore()
const authStore = useAuthStore()
const user = authStore.user

const goal = ref<object>({})
const savings = computed(() => balanceStore.savings)
const isShowGoalForm = ref<boolean>(false)
const isShowDeleteGoalForm = ref<boolean>(false)

const showGoalForm = (item: object) => {
  goal.value = item
  isShowGoalForm.value = true
}

const closeGoalForm = () => {
  goal.value = {}
  isShowGoalForm.value = false
}

const showDeleteGoalForm = (item: object) => {
  goal.value = item
  isShowDeleteGoalForm.value = true
}

const closeDeleteGoalForm = () => {
  goal.value = {}
  isShowDeleteGoalForm.value = false
}


const actions = (item: object) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => showGoalForm(item)
  },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: () => showDeleteGoalForm(item)
    }]
]

onBeforeMount(async () => {
  if (balanceStore.savings.length == 0) await balanceStore.fetchUserSavings(user.id)
})
</script>

<style scoped>

</style>