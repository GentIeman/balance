<template>
  <div class="flex justify-center items-center bg-gray-100 h-screen">
    <UContainer class="flex flex-col gap-5 lg:px-[100px] sm:px-[50px] py-[50px] w-[500px] m-0 bg-white rounded-[20px]">
      <h1 class="w-full text-2xl text-zinc-800 font-semibold">
        {{ contentByRouterType("up", ["Hello", "Welcome Back"]) }}
      </h1>
      <UForm
        :state="user"
        @submit="onAuth(contentByRouterType('up', ['register', 'login']), $event)"
        :schema="formValidationSchema"
        class="flex flex-col gap-5 h-full"
      >
        <UFormGroup
          name="email"
          size="sm"
          label="Email"
          required
        >
          <UInput
            v-model="user.email"
            type="email"
            placeholder="you@example.com"
          />
        </UFormGroup>
        <UFormGroup
          v-if="route.params.type != 'in'"
          name="username"
          size="sm"
          label="Username"
          required
        >
          <UInput
            v-model="user.username"
            type="text"
            placeholder="username"
          />
        </UFormGroup>
        <UFormGroup
          v-if="route.params.type != 'in'"
          name="salary"
          size="sm"
          label="Salary"
          required
        >
          <UInput
            v-model="user.salary"
            type="number"
            @change="user.salary = $event.target.value == '' ? 1 : user.salary"
            placeholder="1000"
          />
        </UFormGroup>
        <UFormGroup
          v-if="route.params.type != 'in'"
          name="pensionYear"
          size="sm"
          label="Penstion date"
          hint="Optional"
        >
          <UInput
            v-model="user.pensionYear"
            type="number"
            @change="user.pensionYear = $event.target.value == '' ? currentYear : user.pensionYear"
            :placeholder="`${currentYear}`"
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
                :icon="togglePasswordIcon"
                @click="isShowPassword = !isShowPassword"
                :padded="false"
              />
            </template>
          </UInput>
        </UFormGroup>
        <UButton
          type="submit"
          class="flex justify-center w-full"
        >
          {{ contentByRouterType("up", ["Sign up", "Sign in"]) }}
        </UButton>
      </UForm>
      <UDivider :ui="{ border: { size: { horizontal: 'border-t-2' } } }" />
      <p class="text-gray-600">
        {{ contentByRouterType("up", ["Have you been here before?", "Not registered yet?"]) }}
        <ULink
          :to="{path: `sign-${route.params.type == 'up' ? 'in': 'up'}`}"
          active-class="text-cyan-500 font-semibold"
          inactive-class="text-cyan-500 font-semibold"
        >
          {{ contentByRouterType("up", ["Sign in", "Sign up"]) }}
        </ULink>
      </p>
    </UContainer>
  </div>
</template>
<script setup lang="ts">
import { type InferType } from "yup"
import type { FormSubmitEvent } from "#ui/types"
import {UForm, UContainer, UFormGroup, UInput, UButton, UDivider, ULink} from "#components"
import type {IUser} from "~/utils/interfaces"
import {formValidationSchema} from "~/utils/schemes"
import {useRoute} from "vue-router"

const route = useRoute()
const { login, register} = useStrapiAuth()

const user = reactive<IUser>({
  email: "",
  username: "",
  password: "",
  salary: 10,
  pensionYear: new Date().getFullYear()
})

const isShowPassword = ref<boolean>(false)

const currentYear: number = new Date().getFullYear()

const togglePasswordIcon = computed(() => isShowPassword.value ? "i-heroicons-eye-20-solid" : "i-heroicons-eye-slash-20-solid")

const contentByRouterType = (conditionParam: string, elements: string[]): string => route.params.type == conditionParam ? elements[0] : elements[1]
</script>