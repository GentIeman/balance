<template>
  <UContainer class="flex w-full h-100 sm:p-5 bg-white rounded-2xl shadow justify-between items-center">
    <p class="text-zinc-800 text-3em font-normal leading-none">
      Set new saving for yourself, to do this, click
    </p>
    <UButton
      icon="i-heroicons-plus"
      size="sm"
      @click="showSavingForm({})"
    >
      New saving
    </UButton>
  </UContainer>
  <div class="grid gap-5">
    <div class="responsive-grid">
      <UCard
        class="w-full"
        v-for="item in savingList"
        :key="item.id"
      >
        <template #header>
          <header class="flex items-center justify-between">
            <p class="text-zinc-800 text-lg font-semibold leading-tight">
              {{ item.title }}
              <UIcon
                v-if="item.item >= item.totalAmount"
                name="i-heroicons-check-badge-solid"
                class="text-green-600 text-lg"
              />
            </p>
            <AppDropDown
              :action-labels="['edit', 'delete']"
              :items="item"
              @click="handleExpenseEvent($event)"
            />
          </header>
        </template>
        <div class="flex flex-col items-end gap-2">
          <UProgress
            indicator
            :value="calcProgress(item.currentAmount, item.totalAmount)"
          />
          <p class="text-black text-opacity-80 text-xs font-normal">
            {{ item.currentAmount ?? 0 }} / {{ item.totalAmount }}
          </p>
        </div>
        <ul class="flex flex-col gap-2">
          <li class="text-gray-800 text-lg font-semibold">
            Details
          </li>
          <li class="text-black text-sm font-normal">
            End date: <time>{{ new Date(item.endDate).toLocaleDateString() }}</time>
          </li>
        </ul>
      </UCard>
    </div>
    <UPagination
      class="justify-end"
      v-model="page"
      :page-count="5"
      :total="sortedSavings.length"
    />
  </div>
  <UModal
    @submit.capture="isShowSavingForm = false"
    v-model="isShowSavingForm"
  >
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900">
            {{ saving.id ? "Edit" : "Create" }} saving
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isShowSavingForm = false"
          />
        </div>
      </template>
      <AppForm
        @submit="initSaving($event.data)"
        dir="saving"
        :state="saving"
        :type="saving.id ? 'Edit' : 'Create'"
      />
    </UCard>
  </UModal>
  <UModal
    @submit.capture="isShowDeleteSavingForm = false"
    v-model="isShowDeleteSavingForm"
  >
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Delete saving
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isShowDeleteSavingForm = false"
          />
        </div>
      </template>
      <AppDeleteForm
        item="saving"
        @close="isShowDeleteSavingForm = $event"
        @submit="deleteSaving(saving)"
      />
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import {UContainer, UButton, UCard, UProgress, UModal, UIcon, UPagination} from "#components"
import AppDropDown from "~/components/AppDropDown.vue"
import {useSavingStore} from "~/store/savingStore"
import calcProgress from "~/utils/calcProgress"
import AppDeleteForm from "~/components/AppDeleteForm.vue"
import AppForm from "~/components/AppForm.vue"

const savingStore = useSavingStore()
const {fetchUserSavings, deleteSaving, initSaving} = savingStore
const {savingList} = storeToRefs(savingStore)
const sortedSavings = computed(() => savingList.value.slice((page.value - 1) * 5, (page.value) * 5))

const saving = ref<ISaving | object>({})
const page = ref(1)
const isShowSavingForm = ref<boolean>(false)
const isShowDeleteSavingForm = ref<boolean>(false)

const showSavingForm = (item: object) => {
  saving.value = item
  isShowSavingForm.value = true
}

const handleExpenseEvent = (event: {data: object, type: string}) => {
  saving.value = event.data
  if (event.type == 'edit') {
    isShowSavingForm.value = true
  } else {
    isShowDeleteSavingForm.value = true
  }
}

onBeforeMount(async () => {
  await fetchUserSavings()
})

definePageMeta({
  middleware: ["auth"]
})

useSeoMeta({
  title: "Savings",
  description: "Set goals for the future"
})
</script>

<style scoped>
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
</style>