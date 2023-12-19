import {defineStore} from "pinia"
import type {ICategory, IExpense} from "~/utils/interfaces"
import {useAuthStore} from "~/store/authStore"
import {getRandomColor} from "~/utils/tools"

export const useBalanceStore = defineStore("balanceStore", {
    state: () => ({
        categories: [],
    }),
    getters: {
        getCategories: (state) => (id?: number) => {
            if (id) return state.categories.some((category: ICategory) => category.id == id)
            return state.categories
        },
        getReverseCategories: (state) => {
            return state.categories.reverse()
        },
        getExpenses: (state) => (id?: number) => {
            if (id) return state.expenses.some((expense: IExpense) => expense.id == id)
            return state.expenses
        },
    },
    actions: {
        async fetchUserCategories(userId: number) {
            this.categories = []
            const {findOne} = useStrapi()

            const response = await findOne("users", userId, {
                populate: {
                    categories: {
                        populate: "*"
                    },
                }
            })
            for (const category of response.categories) {
                category.localeDate = new Date(category.createdAt).toLocaleDateString()
                category.color = getRandomColor()
                this.categories.push(category)
            }
        },
        async initCategory(category: ICategory, type: string) {
            const {create, update} = useStrapi()
            const authStore = useAuthStore()
            const user = authStore.user
            switch (type) {
                case "create":
                    await create("categories", {title: category.title, budgetLimit: category.budgetLimit, user: user.id})
                    await this.fetchUserCategories(user.id)
                    break
                case "update":
                    await update("categories", category.id, {title: category.title, budgetLimit: category.budgetLimit, user: user.id})
                    await this.fetchUserCategories(user.id)
                    break
            }
        },
        async deleteCategory(category: ICategory) {
            const authStore = useAuthStore()
            const user = authStore.user
            const { delete: _delete } = useStrapi()
            await _delete("categories", category.id)
            await this.fetchUserCategories(user.id)
        },
        async initExpense(expense: IExpense, type: string) {
            const {create, update} = useStrapi()
            const authStore = useAuthStore()
            const user = authStore.user
            switch (type) {
                case "create":
                    await create("expenses", {amount: expense.amount, categories: expense.categoryId})
                    await this.fetchUserCategories(user.id)
                    break
                case "update":
                    await update("expenses", expense.id, {amount: expense.amount, categories: expense.categoryId})
                    await this.fetchUserCategories(user.id)
                    break
            }
        },
        async deleteExpense(expense: IExpense) {
            const authStore = useAuthStore()
            const user = authStore.user
            const { delete: _delete } = useStrapi()
            await _delete("expenses", expense.id)
            await this.fetchUserCategories(user.id)
        },
        clearCache() {
            this.categories = []
        }
    },
})