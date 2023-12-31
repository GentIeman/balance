import {defineStore} from "pinia"
import type {IAuthState, IUser} from "~/utils/interfaces"

export const useAuthStore = defineStore("authStore", {
    state: (): IAuthState => ({
        user: {},
    }),
    actions: {
        async login(payload: IUser) {
            const {login} = useStrapiAuth()
            await login({
                identifier: payload.email,
                password: payload.password
            })
            this.user = useStrapiUser()
        },
        async register(payload: IUser) {
            const {register} = useStrapiAuth()
            await register({
                    email: payload.email,
                    password: payload.password,
                    username: payload.username,
                    // @ts-ignore
                    salary: payload.salary,
                    // @ts-ignore
                    pensionYear: new Date(payload.pensionYear)
                })
            this.user = useStrapiUser()
        },
        logout() {
            const {logout} = useStrapiAuth()
            logout()
        },
    },
})