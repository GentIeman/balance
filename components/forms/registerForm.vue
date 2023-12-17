<template>
  <UForm
    :state="user"
    @submit="signUp($event)"
    :schema="registerFormValidation"
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
      name="salary"
      size="sm"
      label="Salary"
      required
    >
      <UInput
        v-model="user.salary"
        type="number"
        @change="user.salary = $event.target.value == '' ? 1 : state.salary"
        placeholder="1000"
      />
    </UFormGroup>
    <UFormGroup
      name="pensionYear"
      size="sm"
      label="Penstion date"
      hint="Optional"
    >
      <UInput
        v-model="user.pensionYear"
        type="number"
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
      block
      type="submit"
    >
      Sign Up
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import {UButton, UForm, UFormGroup, UInput} from "#components"
import type {InferType} from "yup"
import {registerFormValidation} from "~/utils/schemes"
import type {FormSubmitEvent} from "#ui/types"
import {useAuthStore} from "~/store/authStore"
const authStore = useAuthStore()
import {defineProps} from "vue"
import type {IAuthFormProps, IUser} from "~/utils/interfaces"
const router = useRouter()

const {state} = defineProps<IAuthFormProps>()
const user = ref<IUser>(state)

const isShowPassword = ref<boolean>(false)
const togglePasswordIcon = computed(() => isShowPassword.value ? "i-heroicons-eye-20-solid" : "i-heroicons-eye-slash-20-solid")
const currentYear = new Date().getFullYear()

type registrationSchema = InferType<typeof registerFormValidation>
const signUp = async (event: FormSubmitEvent<registrationSchema>) => {
   await authStore.auth("register", event.data)
   router.push("/")
}
</script>