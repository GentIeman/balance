<template>
  <UTable
    :rows="rows"
    :columns="props.columns"
  >
    <template #actions-data="{ row }">
      <UDropdown :items="actions(row)">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-ellipsis-horizontal-20-solid"
        />
      </UDropdown>
    </template>
    <template #status-data="{ row }">
      <span :class="{'text-red-500': row.status == 'Warn', 'text-green-500': row.status == 'Good'}">
        {{ row.status }}
      </span>
    </template>
  </UTable>
  <UContainer class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
    <UPagination
      v-if="props.rows.length > props.pageCount"
      v-model="page"
      :page-count="pageCount"
      :total="props.rows.length"
    />
  </UContainer>
</template>

<script setup lang="ts">
import {UPagination, UTable, UButton, UDropdown, UContainer} from "#components"

const page = ref<number>(1)
const props = defineProps<{
  rows: object[],
  pageCount: number,
  columns: object[]
}>()

const rows = computed(() => props.rows.slice((page.value - 1) * props.pageCount, (page.value) * props.pageCount))

const emits = defineEmits<{
  editModal: [value: object],
  deleteModal: [value: object]
}>()

const actions = (row: object) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => emits("editModal", row)
  },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: () => emits("deleteModal", row)
    }]
]

</script>

<style scoped>

</style>