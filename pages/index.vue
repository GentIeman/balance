<template>
  <AppHeader
    title="Dashboard"
    subtitle="See your quick overview data right here"
  />
  <UContainer
    class="flex justify-center w-full sm:p-0 lg:p-0 m-0"
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
</template>

<script setup lang="ts">
import {UButton, UCard, UContainer, UModal} from "#components"
import AppHeader from "~/components/AppHeader.vue"
import CategoryForm from "~/components/forms/categoryForm.vue"
import {useBalanceStore} from "~/store/balanceStore"
import type {ICategory} from "~/utils/interfaces"
import {useAuthStore} from "~/store/authStore"

const balanceStore = useBalanceStore()
const authStore = useAuthStore()
const user = authStore.user
const categories = computed(() => balanceStore.getCategories())
const isOpen = ref<boolean>(false)

const category = reactive<ICategory>({
  id: 0,
  title: "",
  budgetLimit: 10,
})

definePageMeta({
  middleware: ["auth"]
})

onBeforeMount(async () => {
  if (categories.value.length == 0) await balanceStore.fetchUserCategories(user.id)
})
</script>