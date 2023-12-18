<template>
  <UTable
    :rows="slicedRows"
    :columns="columns"
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
    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="slicedRows.length"
      />
    </div>
  </UTable>
</template>

<script setup lang="ts">
import {UPagination, UTable, UButton, UDropdown} from "#components"

const slicedRows = computed(() => {
  return props.rows.slice((page.value - 1) * props.pageCount, (page.value) * props.pageCount)
})

const page = ref(1)

const props = defineProps({
  rows: {
    type: Array,
    required: true
  },
  pageCount: {
    required: false,
    default: 5
  },
  columns: {
    required: true
  },
})

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