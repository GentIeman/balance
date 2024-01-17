<template>
  <UForm
    class="flex flex-col gap-5 h-full"
    :state="category"
    :schema="categorySchema"
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
      {{ category.id ? "Edit" : "Create" }}
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import {UButton, UForm, UFormGroup, UInput} from "#components"
import type {ICategory} from "~/utils/interfaces"
import {type InferType, number, object, string} from "yup"
import type {FormSubmitEvent} from "#ui/types"
import {useCategoryStore} from "~/store/categoryStore"
const categoryStore = useCategoryStore()
const {initCategory} = categoryStore

const props = defineProps<{ category: ICategory }>()
const emits = defineEmits<{ close: [value: boolean] }>()
const category = computed(() => props.category)

const categorySchema = object().shape({
  title: string()
      .min(3, "Must be at least 3 characters")
      .required("Required"),
  budgetLimit: number()
      .transform((value) => Number.isNaN(value) ? null : value )
      .nullable()
      .moreThan(9, "Not enough for the limit")
      .max(9999999, "Can you do?").required("Required")
})

type categorySchema = InferType<typeof categorySchema>
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