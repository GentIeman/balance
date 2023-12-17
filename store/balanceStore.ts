import {defineStore} from "pinia"
import type {ICategory} from "~/utils/interfaces"

export const useBalanceStore = defineStore("balanceStore", {
    state: () => ({
        balance: {},
        categories: []
    }),
    getters: {
        getCategories: (state) => (id?: number) => {
            if (id) return state.categories.some((category: ICategory) => category.id == id)
            return state.categories
        }
    },
    actions: {
        async fetchUserCategories(userId: number) {
            const {findOne} = useStrapi()

            const response = await findOne("users", userId, {
                populate: "categories"
            })

            this.categories = response.categories
        },
        async createOrUpdateCategory(type: string, payload: ICategory) {
            const {create, update} = useStrapi()
            switch (type) {
                case "create":
                    await create('categories', {title: payload.title, budgetLimit: payload.limit, user: payload.userId})
                    // this.categories.push(payload)
                    break
                case "update":
                    await update('categories', payload.id, {title: payload.title, budgetLimit: payload.limit})
                    // this.categories.push(payload)
                    break
            }
        },
        async deleteCategory(categoryId: number) {
            const { delete: _delete } = useStrapi()
            await _delete('categories', categoryId)
        }
    },
})