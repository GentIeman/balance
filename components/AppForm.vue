<template>
  <UForm
    :state="props.state"
    :schema="yupSchema"
    class="flex flex-col gap-5 h-full"
  >
    <UFormGroup
      v-for="select in form.schema.select"
      :key="select.id"
      :name="select.name"
      :label="select.label"
      :required="select.required"
      :hint="select.hint"
    >
      <USelectMenu
        :searchable="select.isSearchable"
        :searchable-placeholder="select.searchPlaceholder"
        v-model="state[select.name]"
        :placeholder="select.placeholder"
        :options="props.selectOptions"
        :option-attribute="select.optionAttribute"
      >
        <template #option="{ option }">
          <span
            class="flex-shrink-0 w-2 h-2 mt-px rounded-full"
            :style="{ background: `#${option.color}` }"
          />
          <span class="truncate">{{ option[select.optionAttribute] }}</span>
        </template>
        <template #empty>
          No items
        </template>
      </USelectMenu>
    </UFormGroup>
    <UFormGroup
      v-for="input in form.schema.input"
      :key="input.id"
      :name="input.name"
      :label="input.label"
      :required="input.required"
      :hint="input.hint"
    >
      <UInput
        v-if="input"
        v-model="state[input.name]"
        @input="$event.target.value = input.type == 'number' ? Math.max(input.min, Math.min(input.max, $event.target.value)) : $event.target.value"
        :type="input.type === 'password' && isShowPassword ? 'text' : input.type"
        :placeholder="input.placeholder"
        :ui="{ icon: { trailing: { pointer: '' } } }"
      >
        <template
          #trailing
          v-if="input.type == 'password'"
        >
          <UButton
            color="gray"
            variant="link"
            size="sm"
            :icon="isShowPassword ? 'i-heroicons-eye-20-solid' : 'i-heroicons-eye-slash-20-solid'"
            @click="isShowPassword = !isShowPassword"
            :padded="false"
          />
        </template>
      </UInput>
    </UFormGroup>
    <UButton
      block
      v-for="button in form.schema.button"
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
  state: object,
  selectOptions?: object[]
}>()

const emits = defineEmits<{ close: [value: boolean] }>()

const dirLowerCase = computed(() => props.dir.toLowerCase())
const state = computed(() => props.state)
const isShowPassword = ref<boolean>(false)

const forms = await queryContent("forms").find()
const form = computed(() => forms.find((form) => form._dir === dirLowerCase.value))

const yupSchema = buildYup(form.value?.rules, form.value?.config as object)
</script>