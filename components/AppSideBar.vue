<template>
  <aside class="sticky inset-0 flex flex-col gap-5 h-screen w-[300px] lg:px-[22px] sm:px-[22px] py-[20px] rounded-r-[20px] shadow-[2px_0px_4px_0px_rgba(0,0,0,0.10)] bg-white">
    <Logo />
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
      <h2 class="sm:p-1 text-zinc-800 text-lg font-semibold leading-none">
        Menu
      </h2>
      <ul class="flex-col justify-center items-start gap-2.5 inline-flex">
        <li class="w-full">
          <ULink
            to="/"
            class="block sm:p-1 hover:bg-primary-50 rounded-md"
            active-class="text-cyan-500 text-base font-medium leading-snug"
            inactive-class="text-slate-500 text-base font-medium leading-snug"
          >
            Dashboard
          </ULink>
        </li>
        <li class="w-full">
          <ULink
            to="/expenses"
            class="block sm:p-1 hover:bg-primary-50 rounded-md"
            active-class="text-cyan-500 text-base font-medium leading-snug"
            inactive-class="text-slate-500 text-base font-medium leading-snug"
          >
            Expenses
          </ULink>
        </li>
        <li class="w-full">
          <ULink
            to="/savings"
            class="block sm:p-1 hover:bg-primary-50 rounded-md"
            active-class="text-cyan-500 text-base font-medium leading-snug"
            inactive-class="text-slate-500 text-base font-medium leading-snug"
          >
            Savings
          </ULink>
        </li>
        <li
          v-if="user.pensionYear != null"
          class="w-full"
        >
          <ULink
            to="/pension"
            class="block sm:p-1 hover:bg-primary-50 rounded-md"
            active-class="text-cyan-500 text-base font-medium leading-snug"
            inactive-class="text-slate-500 text-base font-medium leading-snug"
          >
            Pension
          </ULink>
        </li>
      </ul>
    </div>
    <div class="h-full" />
    <UButton
      icon="i-heroicons-arrow-left-on-rectangle"
      size="sm"
      block
      color="primary"
      variant="outline"
      @click="signOut()"
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
import {useAuthStore} from "~/store/authStore"
import {useBalanceStore} from "~/store/balanceStore"
import expenseForm from "~/components/forms/expenseForm.vue"
const authStore = useAuthStore()
const user = authStore.user
const router = useRouter()

const isShowExpenseForm = ref<boolean>(false)

const balanceStore = useBalanceStore()
const categories = computed(() => balanceStore.getCategories())

const signOut = () => {
  authStore.auth("logout", null)
  router.push("/sign")
}
</script>

<style scoped>

</style>