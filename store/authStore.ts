import {defineStore} from "pinia"
import type {IAuthState, IUser} from "~/utils/interfaces"

export const useAuthStore = defineStore("authStore", {
    state: (): IAuthState => ({
        user: undefined,
    }),
    actions: {
        async login(payload: IUser) {
            const {login} = useStrapiAuth()
            await login({
                identifier: payload.email,
                password: payload.password
            })
            // @ts-ignore
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
            // @ts-ignore
            this.user = useStrapiUser()
        },
        logout() {
            const {logout} = useStrapiAuth()
            logout()
        },
    },
})