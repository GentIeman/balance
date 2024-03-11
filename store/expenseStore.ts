import {defineStore} from "pinia"

interface IBalanceState {
    categories: ICategory[]
    expenses: IExpense[],
}

export const useExpenseStore = defineStore("expenseStore", {
    state: (): IBalanceState => ({
        categories: [],
        expenses: [],
    }),
    getters: {
        expenseList: (state: IBalanceState) => state.expenses,
        getExpensesCount: (state: IBalanceState) => state.expenses.length,
        getExpenseById: (state: IBalanceState) => (id: number) => {
            return state.expenses.find((expense: IExpense): boolean => expense.id == id)
        }
    },
    actions: {
        async fetchUserExpenses(): Promise<void> {
            this.expenses = []
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
                this.expenses = expenses
            } catch (error) {
                console.error("Error fetching user expenses:", error)
            }
        },
        async initItem<T extends { id: number, data: object }>(payload: T, contentType: string, storeArrayName?: string): Promise<void> {
            const {create, update} = useStrapi()
            const user = useStrapiUser<IUser>()
            const {data: initializedItem} = await (
                payload.id == undefined
                    ? create(contentType, {...payload.data, user: user.value.id})
                    : update(contentType, payload.id, {...payload.data})
            )

            const storeArray = (this as any)[contentType ?? storeArrayName]

            const existingItemIndex: number = storeArray.findIndex(
                (existingItem: T): boolean => existingItem.id === initializedItem.attributes.id
            )

            existingItemIndex === -1
                ? storeArray.push(initializedItem.attributes)
                : storeArray[existingItemIndex] = initializedItem.attributes
        },
        async deleteItem<T extends { id: number }>(payload: T, contentType: string) {
            const {delete: _delete} = useStrapi()
            const targetArray = (this as any)[contentType]

            await _delete(contentType, payload.id)
            targetArray.splice(targetArray.findIndex((findItem: T): boolean => findItem.id === payload.id), 1)
        }
    }
})