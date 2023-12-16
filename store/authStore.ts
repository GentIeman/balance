import { defineStore } from "pinia"
import {useStrapiAuth} from "#imports"
import type {IAuthState} from "~/utils/interfaces"

export const useAuthStore = defineStore("authStore", {
    state: (): IAuthState => ({
        errors: null
    }),
    actions: {
        async auth<T>(type: string, payload: T) {
            this.errors = null
            try {
                if (type == "login") {
                    await useStrapiAuth().login({identifier: payload.email, password: payload.password})
                } else {
                    await useStrapiAuth().register({email: payload.email, password: payload.password, username: payload.username, salary: payload.salary, pensionYear: new Date(`${payload.pensionYear}`)})
                }
            } catch (err: any) {
                this.errors = err.error
            }
        }
    },
})