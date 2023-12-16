<template>
  <div class="flex justify-center items-center bg-gray-100 h-screen">
    <UContainer class="flex flex-col gap-5 lg:px-[100px] sm:px-[50px] py-[50px] w-[500px] m-0 bg-white rounded-[20px]">
      <h1 class="w-full text-2xl text-zinc-800 font-semibold">
        {{ contentByRouterType("up", ["Hello", "Welcome Back"]) }}
      </h1>
      <LoginForm
        v-if="contentByRouterType('in', [true, false])"
        :state="user"
      />
      <RegisterForm
        v-else
        :state="user"
      />
      <UDivider :ui="{ border: { size: { horizontal: 'border-t-2' } } }" />
      <p class="text-gray-600">
        {{ contentByRouterType("up", ["Have you been here before?", "Not registered yet?"]) }}
        <ULink
          :to="{path: `sign-${contentByRouterType('up', ['in', 'up'])}`}"
          active-class="text-cyan-500 font-semibold"
          inactive-class="text-cyan-500 font-semibold"
        >
          {{ contentByRouterType("up", ["Sign in", "Sign up"]) }}
        </ULink>
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
import {UDivider, ULink, UNotification, UContainer} from "#components"
import type {IUser} from "~/utils/interfaces"
import {useRoute} from "vue-router"
import LoginForm from "~/components/loginForm.vue"
import RegisterForm from "~/components/registerForm.vue"
import {useAuthStore} from "~/store/authStore"
const authStore = useAuthStore()
const route = useRoute()

definePageMeta({
  middleware: ["sign"]
})

const user = reactive<IUser>({
  email: "",
  username: "",
  password: "",
  salary: 10,
  pensionYear: null
})

const serverErrorDescription = ref<string>()
const isShowErrorNotification = ref<boolean>(false)

watch(authStore.$state, () => {
  if (authStore.$state.errors !== null) {
      serverErrorDescription.value = authStore.$state.errors.message
      isShowErrorNotification.value = true
  }
})
const contentByRouterType = (conditionParam: string, elements: any[]): string => route.params.type == conditionParam ? elements[0] : elements[1]
</script>