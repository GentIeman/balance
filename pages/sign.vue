<template>
  <UCard class="w-[600px] rounded-md shadow border justify-start items-start">
    <template #header>
      <header class="flex place-content-center w-full px-7">
        <h2 class="w-full text-2xl text-zinc-800 font-semibold">
          {{ isLogin ? "Welcome back" : "Hello" }}
        </h2>
      </header>
    </template>
    <UContainer class="grid gap-4">
      <AppForm
        @submit="onAuth($event)"
        :dir="isLogin ? 'login' : 'register'"
        :state="user"
        :type="isLogin ? 'Sign in' : 'Sign up'"
      />
      <UContainer class="w-full lg:px-0 sm:px-0">
        <UDivider />
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
    </UContainer>
  </UCard>
  <UNotification
    class="absolute top-[90px] bottom-auto max-w-[500px]"
    color="rose"
    @close="isNotification = false"
    v-if="isNotification"
    id="3"
    :timeout="3000"
    :description="serverErrorDescription"
    title="Notification"
  />
  <AppLoader
    v-if="isLoader"
    size="6rem"
    icon="i-heroicons-arrow-path-rounded-square"
  />
</template>
<script setup lang="ts">
import AppForm from "~/components/AppForm.vue"
import {UDivider, UButton, UNotification, UCard, UContainer} from "#components"
import AppLoader from "~/components/AppLoader.vue"

const router = useRouter()

const user = reactive<IUser>({
  email: "ilya@gmail.com",
  username: undefined,
  password: "1234567890",
  salary: undefined,
  pensionYear: undefined
})

const isLoader = ref<boolean>(false)
const isLogin = ref<boolean>(true)
const isNotification = ref<boolean>(false)

const serverErrorDescription = ref<string | null>(null)

const onAuth = async (event: IUser) => {
  const {login, register} = useStrapiAuth()
  try {
    if (isLogin.value) {
      await login({
        identifier: event.data.email,
        password: event.data.password
      })
    } else {
      await register({
        email: event.data.email,
        password: event.data.password,
        username: event.data.username,
        salary: event.data.salary,
        pensionYear: new Date(event.data.pensionYear)
      })
    }
    isLoader.value = true
    await router.push("/")

  } catch (err: any) {
    isNotification.value = true
    serverErrorDescription.value = err.error.message
  }
}

definePageMeta({layout: "sign"})

useSeoMeta({
  title: () => `Sign ${isLogin.value ? "in" : "up"}`
})
</script>