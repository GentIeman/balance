import {defineStore} from "pinia"

interface IExpensesStore {
    expenses: IExpense[],
}

export const useExpenseStore = defineStore("expenseStore", {
    state: (): IExpensesStore => ({
        expenses: [],
    }),
    getters: {
        expenseList: (state: IExpensesStore) => state.expenses,
        expensesCount: (state: IExpensesStore) => state.expenses.length
    },
    actions: {
        async fetchUserExpenses(): Promise<void> {
            this.$reset()
            const {findOne} = useStrapi()
            const user = useStrapiUser<IUser>()

            try {
                // @ts-ignore
                const {expenses} = await findOne("users", user.value.id, {
                    populate: {
                        expenses: {
                            populate: {
                                categories: {fields: ["id"]}
                            }
                        }
                    }
                })
                for (const expense of expenses) {
                    this.expenses.push({...expense, categories: expense.categories.id})
                }
            } catch (error) {
                console.error("Error fetching user expenses:", error)
            }
        },
        async initExpense(payload: IExpense): Promise<void> {
            const {create, update} = useStrapi()
            const user = useStrapiUser<IUser>()

            try {
                const {data: initializedExpense} = await (
                    payload.id == undefined
                        ? create<IExpense>("expenses", {...payload, user: user.value.id})
                        : update<IExpense>("expenses", payload.id, {...payload})
                )

                const existingExpenseIndex: number = this.expenses.findIndex(
                    (existingExpense: IExpense): boolean => existingExpense.id === initializedExpense.id
                )

                existingExpenseIndex === -1
                    ? this.expenses.push({id: initializedExpense.id, ...initializedExpense.attributes, categories: payload.categories})
                    : this.expenses[existingExpenseIndex] = {id: initializedExpense.id, ...initializedExpense.attributes, categories: payload.categories}
            } catch (error) {
                console.error("Error init expense", error)
            }
        },
        async deleteExpense(payload: IExpense) {
            const {delete: _delete} = useStrapi()

            await _delete("expenses", payload.id)
            this.expenses.splice(this.expenses.findIndex((findItem: IExpense): boolean => findItem.id === payload.id), 1)
        }
    }
})