export default defineNuxtRouteMiddleware((to, from) => {
    if (to.params.type != "up" && to.params.type != "in") return navigateTo("/sign-in")
})