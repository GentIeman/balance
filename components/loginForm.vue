<template>
  <UForm
    :state="user"
    @submit="onAuth('login', $event)"
    :schema="loginFormValidation"
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
      Sign In
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import {loginFormValidation} from "~/utils/schemes"
import {UButton, UForm, UFormGroup, UInput} from "#components"
import type {FormSubmitEvent} from "#ui/types"
import {type InferType} from "yup"
import {useAuthStore} from "~/store/authStore"
import {useRouter} from "vue-router"
import type {IAuthFormProps, IUser} from "~/utils/interfaces"
const authStore = useAuthStore()
const router = useRouter()
const authUser = useStrapiUser()

const {state} = defineProps<IAuthFormProps>()
const user = ref<IUser>(state)

const isShowPassword = ref<boolean>(false)
const togglePasswordIcon = computed(() => isShowPassword.value ? "i-heroicons-eye-20-solid" : "i-heroicons-eye-slash-20-solid")

type loginSchema = InferType<typeof loginFormValidation>
const onAuth = async (type: string, event: FormSubmitEvent<loginSchema>) => {
  await authStore.auth(type, event.data)
  if (authUser.value) router.push("/home")
}
</script>