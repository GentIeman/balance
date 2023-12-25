<template>
  <div class="flex justify-center items-center bg-gray-100 h-screen">
    <UContainer class="flex flex-col gap-5 lg:px-[100px] sm:px-[50px] py-[50px] w-[500px] m-0 bg-white rounded-[20px]">
      <h1 class="w-full text-2xl text-zinc-800 font-semibold">
        {{ isLogin ? "Welcome back" : "Hello" }}
      </h1>
      <LoginForm
        v-if="isLogin"
        :state="user"
      />
      <RegisterForm
        v-if="!isLogin"
        :state="user"
      />
      <UDivider :ui="{ border: { size: { horizontal: 'border-t-2' } } }" />
      <p class="text-gray-600">
        {{ isLogin ? "Not registered yet?" : "Have you been here before?" }}
        <UButton
          @click="isLogin = !isLogin"
          variant="link"
          class="sm:px-0"
        >
          {{ isLogin ? "Sign up" : "Sign in" }}
        </UButton>
      </p>
    </UContainer>
    <UNotification
      class="absolute top-[90px] bottom-auto max-w-[500px]"
      color="rose"
      @close="isShowErrorNotification = false"
      v-if="isShowErrorNotification"
      id="3"
      :timeout="3000"
      :description="serverErrorDescription"
      title="Notification"
    />
  </div>
</template>
<script setup lang="ts">
import {UDivider, UButton, UNotification, UContainer} from "#components"
import type {IUser} from "~/utils/interfaces"
import LoginForm from "~/components/forms/loginForm.vue"
import RegisterForm from "~/components/forms/registerForm.vue"
import {useAuthStore} from "~/store/authStore"
const authStore = useAuthStore()

definePageMeta({
  layout: "sign"
})

const user = reactive<IUser>({
  email: "",
  username: "",
  password: "",
  salary: 10,
  pensionYear: null
})

const isLogin = ref<boolean>(true)

const serverErrorDescription = ref<string>()
const isShowErrorNotification = ref<boolean>(false)

watch(authStore.$state, () => {
  if (authStore.$state.errors !== null) {
      serverErrorDescription.value = authStore.$state.errors.message
      isShowErrorNotification.value = true
  }
})

useSeoMeta({
  title: () =>  `Sign ${isLogin.value == true ? "in" : "up"}`
})
</script>