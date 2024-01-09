<template>
  <UForm
    class="flex flex-col gap-5 h-full"
    :state="category"
    :schema="categoryFormValidation"
    @submit="putCategory($event)"
  >
    <UFormGroup
      name="title"
      size="sm"
      label="Title"
      required
    >
      <UInput
        v-model="category.title"
        type="text"
        placeholder="Dream category"
      />
    </UFormGroup>
    <UFormGroup
      name="budgetLimit"
      size="sm"
      label="Limit"
      required
    >
      <UInput
        v-model="category.budgetLimit"
        type="number"
        placeholder="1000"
      />
    </UFormGroup>
    <UButton
      block
      type="submit"
    >
      {{ props.category.id ? "Edit" : "Create" }}
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import {categoryFormValidation} from "~/utils/schemes"
import {UButton, UForm, UFormGroup, UInput} from "#components"
import type {ICategory, ICategoryFormProps} from "~/utils/interfaces"
import {type InferType} from "yup"
import type {FormSubmitEvent} from "#ui/types"
import {useCategoryStore} from "~/store/categoryStore"
const categoryStore = useCategoryStore()
const {initCategory} = categoryStore

const props = defineProps<ICategoryFormProps>()
const category = reactive<ICategory>(props.category)
const emits = defineEmits<{ close: [value: boolean] }>()

type categorySchema = InferType<typeof categoryFormValidation>
const putCategory = async(event: FormSubmitEvent<categorySchema>) => {
  try {
    await initCategory(event.data)
  } catch (err) {
    console.error("Error initialized category:", err)
  }
  emits("close", true)
}
</script>

<style scoped>

</style>