<template>
  <UDropdown :items="actions(props.items)">
    <UButton
      color="gray"
      variant="ghost"
      icon="i-heroicons-ellipsis-horizontal-20-solid"
    />
  </UDropdown>
</template>

<script setup lang="ts">
import {UButton, UDropdown} from "#components"

const props = defineProps<{
  items: object,
  actionLabels: string[]
}>()

const emits = defineEmits<{
  click: [value: object],
}>()

const actions = (item: object) => {
  const allActions = [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => emits("click", {data: item, type: 'edit'})
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: () => emits("click", {data: item, type: 'delete'})
    },
    {
      label: 'Clear limit',
      icon: 'i-heroicons-trash-20-solid',
      click: () => emits("click", item)
    }
  ]

  return [allActions.filter(action => props.actionLabels.includes(action.label.toLowerCase()))]
}
</script>