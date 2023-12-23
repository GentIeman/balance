<template>
  <UForm
    class="flex flex-col gap-5 h-full"
    :state="localGoal"
    :schema="goalFormValidation"
    @submit="putGoal($event)"
  >
    <UFormGroup
      name="title"
      size="sm"
      label="Title"
      required
    >
      <UInput
        v-model="localGoal.title"
        type="text"
        placeholder="Dream goal"
      />
    </UFormGroup>
    <UFormGroup
      name="totalAmount"
      size="sm"
      label="Amount"
      required
    >
      <UInput
        v-model="localGoal.totalAmount"
        type="number"
        placeholder="1000"
      />
    </UFormGroup>
    <UFormGroup
      name="currentAmount"
      size="sm"
      label="Current amount"
      required
    >
      <UInput
        v-model="localGoal.currentAmount"
        type="number"
        placeholder="1000"
      />
    </UFormGroup>
    <UFormGroup
      name="endDate"
      size="sm"
      label="End date"
      required
    >
      <UInput
        v-model="localGoal.endDate"
        type="date"
        :min="minDate"
        :max="maxDate"
        :value="localGoal.endDate ? new Date(localGoal.endDate).toISOString().slice(0, 10) : ''"
        placeholder="mm/dd/yyyy"
      />
    </UFormGroup>
    <UButton
      block
      type="submit"
    >
      {{ localGoal.id ? "Edit" : "Create" }}
    </UButton>
    <div v-if="localGoal.totalAmount > 0">
      <UDivider>
        <UIcon
          name="i-heroicons-information-circle-20-solid"
          class="text-2xl text-gray-600"
        />
      </UDivider>
      <p class="text-gray-400">
        {{ checkSavingsPossibility(userSalary, localGoal.totalAmount) }}
      </p>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import {goalFormValidation} from "~/utils/schemes"
import {UButton, UForm, UFormGroup, UInput, UDivider, UIcon} from "#components"
import type {IGoalFormProps} from "~/utils/interfaces"
import type {InferType} from "yup"
import type {FormSubmitEvent} from "#ui/types"
import {useBalanceStore} from "~/store/balanceStore"
import {checkSavingsPossibility} from "~/utils/tools"
const balanceStore = useBalanceStore()

const {goal, userSalary} = defineProps<IGoalFormProps>()

const minDate = computed(() => new Date().toISOString().slice(0, 10))
const maxDate = computed(() => new Date(new Date().setFullYear(new Date().getFullYear() + 4)).toISOString().slice(0, 10))

// sad...
const localGoal = ref(JSON.parse(JSON.stringify(goal)))

const emit = defineEmits(["closeModal"])
type goalSchema = InferType<typeof goalFormValidation>
const putGoal = (event: FormSubmitEvent<goalSchema>) => {
  const operationType = goal.id ? "update" : "create"
  balanceStore.initGoal(event.data, operationType)
  emit("closeModal")
}

</script>

<style scoped>

</style>