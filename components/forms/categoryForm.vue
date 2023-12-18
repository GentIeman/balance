<template>
  <UForm
    class="flex flex-col gap-5 h-full"
    :state="localCategory"
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
        v-model="localCategory.title"
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
        v-model="localCategory.budgetLimit"
        type="number"
        placeholder="1000"
      />
    </UFormGroup>
    <UButton
      block
      type="submit"
    >
      {{ localCategory.id ? "Edit" : "Create" }}
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import {categoryFormValidation} from "~/utils/schemes"
import {UButton, UForm, UFormGroup, UInput} from "#components"
import type {ICategory, ICategoryFormProps} from "~/utils/interfaces"
import {useBalanceStore} from "~/store/balanceStore"
import type {InferType} from "yup"
import type {FormSubmitEvent} from "#ui/types"
const balanceStore = useBalanceStore()

const categoryEmpty = reactive<ICategory>({
  id: 0,
  title: "",
  budgetLimit: 0
})

const {category} = defineProps<ICategoryFormProps>()

const localCategory = computed(() => {
  return category ? category : categoryEmpty
})

const emit = defineEmits(["closeModal"])
type categorySchema = InferType<typeof categoryFormValidation>
const putCategory = (event: FormSubmitEvent<categorySchema>) => {
  const operationType = category.id ? "update" : "create"
  balanceStore.initCategory(event.data, operationType)
  emit("closeModal")
}
</script>

<style scoped>

</style>