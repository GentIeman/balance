<template>
  <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Delete category
        </h3>
        {{ category }}
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="emit('closeModal')"
        />
      </div>
    </template>
    <UForm
      class="flex flex-col gap-5 h-full"
      :state="{}"
      @submit="removeCategory(category)"
    >
      <span class="text-black text-sm font-normal leading-tight">Are you sure you want to delete this category?</span>
      <div class="grid grid-cols-2 gap-10">
        <UButton
          block
          size="sm"
          class="bg-black bg-opacity-50"
          @click.prevent="emit('closeModal')"
          type="button"
        >
          No
        </UButton>
        <UButton
          block
          size="sm"
          color="rose"
          type="submit"
        >
          Yes
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import {UButton, UCard, UForm} from "#components"
import {useBalanceStore} from "~/store/balanceStore"
import type {ICategory, IDeleteCategory} from "~/utils/interfaces"
const balanceStore = useBalanceStore()

const {category} = defineProps<IDeleteCategory>()

const emit = defineEmits(["closeModal"])
const removeCategory = (category: ICategory) => {
  balanceStore.deleteCategory(category)
  emit("closeModal")
}
</script>

<style scoped>

</style>