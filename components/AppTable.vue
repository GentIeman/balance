<template>
  <UTable
    :rows="rows"
    :columns="props.columns"
  >
    <template
      #actions-data="{ row }"
    >
      <UDropdown :items="actions(row)">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-ellipsis-horizontal-20-solid"
        />
      </UDropdown>
    </template>
    <template #status-data="{ row }">
      {{ row.status.value }}
    </template>
  </UTable>
  <div
    class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
  >
    <UPagination
      v-if="props.payload.length > 0"
      v-model="page"
      :page-count="pageCount"
      :total="props.payload.length"
    />
  </div>
</template>

<script setup lang="ts">
import {UPagination, UTable, UButton, UDropdown} from "#components"
import {type ITableProps} from "~/utils/interfaces"

const page = ref<number>(1)
//
const props = defineProps<ITableProps>()
// r
const rows = computed(() => props.payload.slice((page.value - 1) * props.pageCount, (page.value) * props.pageCount))

const emit = defineEmits(["showEditForm", "showDeleteForm"])

const actions = (row: object) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => emit("showEditForm", row)
  },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: () => emit("showDeleteForm", row)
    }]
]

</script>

<style scoped>

</style>