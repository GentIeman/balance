import {defineStore} from "pinia"
import type {ICategory, IExpense, IGoal} from "~/utils/interfaces"
import {useAuthStore} from "~/store/authStore"
import {getRandomColor} from "~/utils/tools"
import {calcProgress} from "~/utils/tools"

export const useBalanceStore = defineStore("balanceStore", {
    state: () => ({
        categories: [],
        savings: [],
        expenses: [],
    }),
    getters: {
        getCategories: (state) => (id?: number) => {
            if (id) return state.categories.some((category: ICategory) => category.id == id)
            return state.categories
        },
        getReverseCategories: (state) => {
            return state.categories.reverse()
        },
        getCategoriesExpenses: (state) => {
            return state.expenses
        },
        getSavings: (state) => {
            return state.savings
        },
        getTotalCategoryExpenses: (state) => (selectedCategory?: ICategory) => {
            const categoriesToCalculate = selectedCategory ? [selectedCategory] : state.categories

            const updatedCategories = categoriesToCalculate.map((category) => ({
                ...category,
                totalExpenses: category.expenses.reduce((acc, expense) => acc + expense.amount, 0),
            }))

            return selectedCategory ? updatedCategories[0].totalExpenses : updatedCategories
        },
        getSortedSavingsByPercent: (state) => {
            const sortedSavings = [...state.savings]

            return sortedSavings.sort((a, b) => calcProgress(b.currentAmount, b.totalAmount) - calcProgress(a.currentAmount, a.totalAmount))
        }
    },
    actions: {
        async fetchUserCategories(userId: number) {
            this.categories = []
            this.expenses = []
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
                this.expenses.push(...this.parseCategoriesExpenses(category))
            }
        },
        parseCategoriesExpenses: (category: ICategory) => {
            return category.expenses.map((expense) => ({
                ...expense,
                category: category.title,
                localeDate: new Date(expense.createdAt).toLocaleDateString()
            }))
        },
        async fetchUserSavings(userId: number) {
            this.savings = []
            const {findOne} = useStrapi()

            const response = await findOne("users", userId, {
                populate: {
                    savings: {
                        populate: "*"
                    },
                }
            })
            for (const saving of response.savings) {
                saving.endDate = new Date(saving.endDate).toLocaleDateString()
                this.savings.push(saving)
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
        async initGoal(payload: IGoal, type: string) {
            const {create, update} = useStrapi()
            const authStore = useAuthStore()
            const user = authStore.user
            let goal = null
            switch (type) {
                case "create":
                    goal = await create("savings", {
                        title: payload.title,
                        totalAmount: payload.totalAmount,
                        currentAmount: payload.currentAmount,
                        endDate: new Date(payload.endDate).toISOString().slice(0, 10),
                        user: user.id
                    })
                    await this.updateSavingsHistories(goal.data)
                    await this.fetchUserSavings(user.id)
                    break
                case "update":
                    goal = await update("savings", payload.id, {
                        title: payload.title,
                        totalAmount: payload.totalAmount,
                        currentAmount: payload.currentAmount,
                        endDate: new Date(payload.endDate).toISOString().slice(0, 10),
                    })
                    await this.updateSavingsHistories(goal.data)
                    await this.fetchUserSavings(user.id)
                    break
            }
        },
        async deleteGoal(goal: IGoal) {
            const authStore = useAuthStore()
            const user = authStore.user
            const { delete: _delete } = useStrapi()
            await _delete("savings", goal.id)
            await this.fetchUserSavings(user.id)
        },
        async updateSavingsHistories(saving: IGoal) {
            const {create} = useStrapi()
            await create("saving-histories", {
                transactionAmount: saving.attributes.currentAmount,
                saving: saving.id
            })
        },
        clearCache() {
            this.categories = []
            this.savings = []
            this.expenses = []
        }
    },
})