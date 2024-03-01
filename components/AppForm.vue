<template>
  <UForm
    :state="props.state"
    :schema="yupSchema"
    class="flex flex-col gap-5 h-full"
    @submit="submit($event)"
  >
    <UFormGroup
      v-for="input in schema.input"
      :key="input.id"
      :name="input.name"
      :label="input.label"
      :required="input.required"
      :hint="input.hint"
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
import type {InferType} from "yup"
import type {FormSubmitEvent} from "#ui/types"

const props = defineProps<{
  dir: string,
  type: string
  state: object,
  selectOptions?: object[]
  selectBy?: string,
  contentType: string,
  func?: Function
}>()

const emits = defineEmits<{ close: [value: boolean] }>()

const dirLowerCase = computed(() => props.dir.toLowerCase())
const item = computed(() => props.state)
const isShowPassword = ref<boolean>(false)

const { schema, rules, config } = await queryContent(`forms/${dirLowerCase.value}/form`).findOne()

const yupSchema = buildYup(rules, config as object)
type schema = InferType<typeof yupSchema>

const submit = async (event: FormSubmitEvent<schema>) => {
  try {
    // await props.func(event.data, props.contentType)
  } catch (err) {
    console.error(`Error initialized ${props.contentType}:`, err)
  }
  emits("close", true)
}
</script>