<template>
  <UForm
    class="flex flex-col gap-5 h-full"
    :state="category"
    :schema="categoryFormValidation"
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
      name="limit"
      size="sm"
      label="Limit"
      required
    >
      <UInput
        v-model="category.limit"
        placeholder="1000"
        autocomplete
      />
    </UFormGroup>
    <UButton
      block
      @click="addCategory(category)"
      type="button"
    >
      Create
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import {categoryFormValidation} from "~/utils/schemes"
import {UButton, UForm, UFormGroup, UInput} from "#components"
import type {ICategory} from "~/utils/interfaces"
import {useBalanceStore} from "~/store/balanceStore"
import {useAuthStore} from "~/store/authStore"
const balanceStore = useBalanceStore()
const authStore = useAuthStore()
const user = authStore.user
const category = reactive<ICategory>({
  id: 0,
  title: "",
  limit: 0,
  userId: user.id
})

const addCategory = (category: ICategory) => {
  balanceStore.createOrUpdateCategory("create", category)
}
</script>

<style scoped>

</style>