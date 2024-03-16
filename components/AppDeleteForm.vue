<template>
  <UForm
    :state="{}"
    class="flex flex-col gap-5 h-full"
  >
    <span class="text-black text-sm font-normal leading-tight">Are you sure you want to delete this {{ props.item }}?</span>
    <div class="grid grid-cols-2 gap-10">
      <UButton
        block
        size="sm"
        class="bg-black bg-opacity-50"
        @click.prevent="$emit('close', false)"
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
</template>

<script setup lang="ts">
import {UButton, UForm} from "#components"

const props = defineProps<{
  item: string,
}>()
const emits = defineEmits<{ close: [value: boolean] }>()

</script>

<style scoped>

</style>