<template>
  <UForm
    :state="props.item"
    :schema="buildYup(rules, config as object)"
    class="flex flex-col gap-5 h-full"
  >
    <UFormGroup
      v-for="input in schema.input"
      :key="input.id"
      :name="input.name"
      :label="input.label"
      :required="input.required"
    >
      <USelectMenu
        v-if="input.select"
        v-model="item[input.name]"
        :placeholder="input.placeholder"
        :options="props.selectOptions"
        :by="props.selectBy"
        :option-attribute="input.optionAttribute"
      />
      <UInput
        v-if="input"
        v-model="item[input.name]"
        @input="$event.target.value = input.type == 'number' ? Math.max(input.min, Math.min(input.max, $event.target.value)) : $event.target.value"
        :type="input.type"
        :placeholder="input.placeholder"
      />
    </UFormGroup>
    <UButton
      block
      v-for="button in schema.button"
      :key="button.id"
      :type="button.type"
    >
      {{ props.type }}
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import {UButton, UForm, UFormGroup, UInput, USelectMenu} from "#components"
import {buildYup} from "schema-to-yup"

const props = defineProps<{
  dir: string,
  type: string
  item: object,
  selectOptions?: object[]
  selectBy?: string
}>()

const item = computed(() => props.item)

const emits = defineEmits<{ close: [value: boolean] }>()

const {schema, rules, config} = await queryContent(`forms/${props.dir.toLowerCase()}/form`).findOne()
</script>

<style scoped>

</style>