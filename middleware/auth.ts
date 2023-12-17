import {useAuthStore} from "~/store/authStore"

export default defineNuxtRouteMiddleware(() => {
    const authStore = useAuthStore()
    const user = authStore.user
    if (!user) return navigateTo("sign")
})