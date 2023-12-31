<template>
  <section class="flex justify-center items-center bg-gray-100 h-screen">
    <UContainer class="flex flex-col gap-5 lg:px-[100px] sm:px-[50px] py-[50px] w-[500px] m-0 bg-white rounded-[20px]">
      <h2 class="w-full text-2xl text-zinc-800 font-semibold">
        {{ isLogin ? "Welcome back" : "Hello" }}
      </h2>
      <UForm
        :state="user"
        @submit="onAuth($event)"
        :schema="formSchema"
        class="flex flex-col gap-5 h-full"
      >
        <UFormGroup
          name="email"
          size="sm"
          label="Email"
          required
        >
          <UInput
            v-model.trim="user.email"
            type="email"
            placeholder="you@example.com"
          />
        </UFormGroup>
        <UFormGroup
          v-if="!isLogin"
          description="You can use a-z, 0-9 and underscores. Min length is 4 character"
          name="username"
          size="sm"
          label="Username"
          required
        >
          <UInput
            v-model.trim="user.username"
            type="text"
            placeholder="Username"
          />
        </UFormGroup>
        <UFormGroup
          v-if="!isLogin"
          name="salary"
          size="sm"
          label="Salary"
          required
        >
          <UInput
            v-model.number="user.salary"
            type="number"
            placeholder="1000"
          />
        </UFormGroup>
        <UFormGroup
          v-if="!isLogin"
          name="pensionYear"
          size="sm"
          label="Penstion date"
          hint="Optional"
        >
          <UInput
            v-model="user.pensionYear"
            type="number"
            :placeholder="`${new Date().getFullYear()}`"
          />
        </UFormGroup>
        <UFormGroup
          name="password"
          size="sm"
          label="Password"
          required
        >
          <UInput
            v-model="user.password"
            :type="isShowPassword ? 'text' : 'password'"
            placeholder="****"
            autocomplete
            :ui="{ icon: { trailing: { pointer: '' } } }"
          >
            <template #trailing>
              <UButton
                color="gray"
                variant="link"
                size="sm"
                :icon="isShowPassword ? 'i-heroicons-eye-20-solid' : 'i-heroicons-eye-slash-20-solid'"
                @click="isShowPassword = !isShowPassword"
                :padded="false"
              />
            </template>
          </UInput>
        </UFormGroup>
        <UButton
          block
          type="submit"
        >
          {{ isLogin ? "Sign in" : "Sign up" }}
        </UButton>
      </UForm>
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
      @close="isShowNotification = false"
      v-if="isShowNotification"
      id="3"
      :timeout="3000"
      :description="serverErrorDescription"
      title="Notification"
    />
  </section>
</template>
<script setup lang="ts">
import {UDivider, UButton, UNotification, UContainer, UForm, UFormGroup, UInput} from "#components"
import type {IUser} from "~/utils/interfaces"
import {useAuthStore} from "~/store/authStore"
import {userRegistrationSchema, userLoginSchema} from "~/utils/schemes"
import {type InferType} from "yup"
import type {FormSubmitEvent} from "#ui/types/form"

const authStore = useAuthStore()
const router = useRouter()

const user = reactive<IUser>({
  email: "",
  username: undefined,
  password: "",
  salary: undefined,
  pensionYear: undefined
})

const isShowPassword = ref<boolean>(false)
const isLogin = ref<boolean>(true)

const formSchema = computed(() => isLogin.value ? userLoginSchema : userRegistrationSchema)

const serverErrorDescription = ref<string | null>(null)
const isShowNotification = ref<boolean>(false)

type FormSchema = InferType<typeof formSchema.value>
const onAuth = async (event: FormSubmitEvent<FormSchema>) => {
  try {
    if (isLogin.value) {
      await authStore.login(event.data)
    } else {
      await authStore.register(event.data)
    }
    await router.push("/")

  } catch (err: any) {
      isShowNotification.value = true
      serverErrorDescription.value = err.error.message
  }
}

definePageMeta({layout: "sign"})

useSeoMeta({
  title: () => `Sign ${isLogin.value ? "in" : "up"}`
})
</script>