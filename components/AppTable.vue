<template>
  <UTable
    :rows="rows"
    :columns="props.columns"
  >
    <template
      #actions-data="{ row }"
      v-if="props.actions"
    >
      <AppDropDown
        :items="row"
        @click="emits('dropDownEvent', $event)"
        :action-labels="props.actions"
      />
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
import {UPagination, UTable, UContainer} from "#components"
import AppDropDown from "~/components/AppDropDown.vue"

const page = ref<number>(1)
const props = defineProps<{
  rows: object[],
  pageCount: number,
  columns: object[],
  actions?: string[]
}>()

const rows = computed(() => props.rows.slice((page.value - 1) * props.pageCount, (page.value) * props.pageCount))

const emits = defineEmits<{
  dropDownEvent: [value: object],
}>()

</script>

<style scoped>

</style>