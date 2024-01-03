<template>
  <aside class="sticky inset-0 flex flex-col gap-5 h-screen w-[300px] lg:px-[22px] sm:px-[22px] py-[20px] rounded-r-[20px] shadow-[2px_0px_4px_0px_rgba(0,0,0,0.10)] bg-white">
    <Logo
      class="w-full"
      :width="204"
      :height="59"
    />
    <UButton
      variant="ghost"
      class="flex flex-col items-start solid-zinc-800 text-[20px] font-semibold"
    >
      {{ user?.username }}
      <span class="text-black text-opacity-50 text-sm font-normal">{{ user?.email }}</span>
    </UButton>
    <UButton
      block
      class="w-full"
      @click="isShowExpenseForm = true"
      v-if="categories.length > 0"
    >
      Add expense
    </UButton>
    <div
      class="flex flex-col w-full gap-3"
    >
      <ul class="flex-col justify-center items-start gap-2.5 inline-flex">
        <li class="w-full">
          <h2 class="sm:p-1 text-zinc-800 text-lg font-semibold leading-none">
            Menu
          </h2>
        </li>
        <template
          v-for="(link, index) in links"
          :key="index"
        >
          <li
            class="w-full"
            v-if="link.name !== 'Pension' || (link.name === 'Pension' && user?.pensionYear)"
          >
            <ULink
              :to="{path: link.to}"
              class="block sm:p-1 hover:bg-primary-50 rounded-md"
              active-class="text-cyan-500 text-base font-medium leading-snug"
              inactive-class="text-slate-500 text-base font-medium leading-snug"
            >
              {{ link.name }}
            </ULink>
          </li>
        </template>
      </ul>
    </div>
    <div class="h-full" />
    <UButton
      icon="i-heroicons-arrow-left-on-rectangle"
      size="sm"
      block
      color="primary"
      variant="outline"
      @click="logout()"
      trailing
    >
      Log out
    </UButton>
    <UModal
      prevent-close
      v-model="isShowExpenseForm"
    >
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Create expense
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isShowExpenseForm = false"
            />
          </div>
        </template>
        <expenseForm
          :expense="{}"
          @close-modal="isShowExpenseForm = false"
        />
      </UCard>
    </UModal>
  </aside>
</template>

<script setup lang="ts">
import {AppLogo as Logo, UButton, ULink, UModal, UCard} from "#components"
import expenseForm from "~/components/forms/expenseForm.vue"
import {useCategoryStore} from "~/store/categoryStore"
import type {IUser} from "~/utils/interfaces"

const categoryStore = useCategoryStore()
const user = useStrapiUser<IUser>()
const {categories} = storeToRefs(categoryStore)
const router = useRouter()
const isShowExpenseForm = ref<boolean>(false)

const links = [
  {to: "/", name: "Dashboard"},
  {to: "/expenses", name: "Expenses"},
  {to: "/pension", name: "Pension"},
  {to: "/savings", name: "Savings"},
]

const logout = () => {
  const {logout} = useStrapiAuth()
  logout()
  router.push("/sign")
}
</script>

<style scoped>

</style>