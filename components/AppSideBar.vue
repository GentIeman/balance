<template>
  <UContainer class="flex flex-col gap-5 h-screen w-[300px] lg:px-[22px] sm:px-[22px] py-[30px] rounded-r-[20px] shadow-[2px_0px_4px_0px_rgba(0,0,0,0.10)] bg-white">
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
    >
      Add expense
    </UButton>
    <div class="flex flex-col w-full gap-3">
      <h2 class="text-zinc-800 text-lg font-bold] leading-none">
        Menu
      </h2>
      <ul class="flex-col justify-center items-start gap-2.5 inline-flex">
        <li
          class="w-full"
          v-for="(link, i) in links"
          :key="i"
        >
          <ULink
            :to="{path: link.to}"
            active-class="text-cyan-500 text-base font-medium leading-snug"
            inactive-class="text-slate-500 text-base font-medium leading-snug"
          >
            {{ link.title }}
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
  </UContainer>
</template>

<script setup lang="ts">
import {UContainer, AppLogo as Logo, UButton, ULink} from "#components"
import {useAuthStore} from "~/store/authStore"
import {useBalanceStore} from "~/store/balanceStore"
const authStore = useAuthStore()
const user = authStore.user
const router = useRouter()

const balanceStore = useBalanceStore()

const signOut = () => {
  authStore.auth("logout", null)
  router.push("/sign")
}

const links = [
  {to: '/', title: 'Dashboard'},
  // {to: '/', title: 'Expenses'},
  // {to: '/', title: 'Pension'},
  // {to: '/', title: 'Savings'},
]

</script>

<style scoped>

</style>