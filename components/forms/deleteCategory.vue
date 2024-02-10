<template>
  <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
          Delete category
        </h3>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="emits('close')"
        />
      </div>
    </template>
    <UForm
      class="flex flex-col gap-5 h-full"
      @submit="removeCategory(props.category)"
    >
      <span class="text-black text-sm font-normal leading-tight">Are you sure you want to delete this category?</span>
      <div class="grid grid-cols-2 gap-10">
        <UButton
          block
          size="sm"
          class="bg-black bg-opacity-50"
          @click.prevent="emits('close')"
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
import type {ICategory} from "~/utils/interfaces"
import {useCategoryStore} from "~/store/categoryStore"
const {deleteCategory} = useCategoryStore()

const props = defineProps<{ category: ICategory }>()
const emits = defineEmits<{ close: [value: boolean] }>()

const removeCategory = (category: ICategory) => {
  deleteCategory(category)
  emits("close", true)
}
</script>

<style scoped>

</style>