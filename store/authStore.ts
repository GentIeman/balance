import { defineStore } from "pinia"
import type {IAuthState} from "~/utils/interfaces"

export const useAuthStore = defineStore("authStore", {
    state: (): IAuthState => ({
        user: {},
        errors: null
    }),
    actions: {
        async auth(type: string, payload: object | null) {
            const {login, register, logout} = useStrapiAuth()
            this.errors = null
            try {
                switch (type) {
                    case "login" :
                        await login({identifier: payload.email, password: payload.password})
                        this.user = useStrapiUser()
                        break
                    case "register":
                        await register({email: payload.email, password: payload.password, username: payload.username, salary: payload.salary, pensionYear: new Date(`${payload.pensionYear}`)})
                        this.user = useStrapiUser()
                        break
                    case "logout":
                        logout()
                        this.user = {}
                        break
                }
            } catch (err: any) {
                this.errors = err.error
            }
        }
    },
})