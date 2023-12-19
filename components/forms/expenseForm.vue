<template>
  <UForm
    class="flex flex-col gap-5 h-full"
    :state="localExpense"
    :schema="expenseFormValidation"
    @submit="initExpense($event)"
  >
    <UFormGroup
      name="category"
      size="sm"
      label="Category"
    >
      <USelect
        placeholder="Select category"
        :options="categories"
        v-model="localExpense.categoryId"
        option-attribute="title"
        value-attribute="id"
        required
      />
    </UFormGroup>
    <UFormGroup
      name="amount"
      size="sm"
      label="Amount"
      required
    >
      <UInput
        v-model="localExpense.amount"
        type="number"
        placeholder="1000"
      />
    </UFormGroup>
    <UButton
      block
      size="sm"
      type="submit"
    >
      {{ localExpense.id ? 'Edit' : 'Create' }}
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import {UButton, UForm, UFormGroup, UInput, USelect} from "#components"
import {useBalanceStore} from "~/store/balanceStore"
import type {IExpense, IExpenseFormProps} from "~/utils/interfaces"
import {expenseFormValidation} from "~/utils/schemes"
import type {InferType} from "yup"
import type {FormSubmitEvent} from "#ui/types"

const balanceStore = useBalanceStore()
const {expense} = defineProps<IExpenseFormProps>()

const emptyExpense = reactive<IExpense>({
  id: 0,
  amount: 0,
  categoryId: 0
})

const localExpense = computed(() => {
  return expense ? expense : emptyExpense
})

const emits = defineEmits(["closeModal"])
const categories = computed(() => balanceStore.getCategories())
type expenseSchema = InferType<typeof expenseFormValidation>
const initExpense = (event: FormSubmitEvent<expenseSchema>) => {
  const operationType = expense.id ? "update" : "create"
  balanceStore.initExpense(event.data, operationType)
  emits("closeModal")
}
</script>