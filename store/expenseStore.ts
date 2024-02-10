import {defineStore} from "pinia"
import type {ICategory, IExpense, IUser} from "~/utils/interfaces"
import {useCategoryStore} from "~/store/categoryStore"

interface IExpenseState {
    expenses: IExpense[]
}

export const useExpenseStore = defineStore("expenseStore", {
    state: (): IExpenseState => ({
        expenses: []
    }),
    getters: {
        getExpensesCount: (state: IExpenseState) => state.expenses.length,
        getExpenseById: (state: IExpenseState) => (id: number) => {
            return state.expenses.find((expense: IExpense): boolean => expense.id == id)
        },
        getTotalCategoryExpenses: (state: IExpenseState) => (id?: number) => {
            const categoryStore = useCategoryStore()
            const {categories, getCategoryById} = categoryStore

            const foundCategory: ICategory | undefined = getCategoryById(id)

            return categories.map((category: ICategory): object => ({
                categoryTitle: foundCategory ? foundCategory.title : category.title,
                totalExpenses: state.expenses.reduce((acc: number, expense: IExpense): number => {
                    return expense.categories?.id === category.id ? acc + expense.amount : acc
                }, 0)
            }))
        }
    },
    actions: {
        async fetchUserExpenses(): Promise<void> {
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
                console.error("Error fetching user categories:", error)
            }
        },
        async initExpense(expense: IExpense): Promise<void> {
            const {create, update} = useStrapi()
            const user = useStrapiUser<IUser>()
            const {data: initializedExpense} = await (
                expense.id == undefined
                    ? create("expenses", {...expense, user: user.value.id})
                    : update("expenses", expense.id, {...expense})
            )
            const existingExpenseIndex: number = this.expenses.findIndex((existingExpense: IExpense): boolean => existingExpense.id === initializedExpense.attributes.id)

            existingExpenseIndex === -1
                ? this.expenses.push(initializedExpense.attributes)
                : (this.expenses[existingExpenseIndex] = initializedExpense.attributes)
        },
        async initItem<T extends { id: number }>(payload: T, contentType: string): Promise<void> {
            const {create, update} = useStrapi()
            const user = useStrapiUser<IUser>()
            const {data: initializedItem} = await (
                payload.id == undefined
                    ? create(contentType, {...payload, user: user.value.id})
                    : update(contentType, payload.id, {...payload})
            )

            const targetArray = (this as any)[contentType]
            
            const existingItemIndex: number = targetArray.findIndex(
                (existingItem: T): boolean => existingItem.id === initializedItem.attributes.id
            )

            existingItemIndex === -1
                ? targetArray.push(initializedItem.attributes)
                : targetArray[existingItemIndex] = initializedItem.attributes
        },
        async deleteItem<T extends { id: number }>(payload: T, contentType: string) {
            const {delete: _delete} = useStrapi()
            const targetArray = (this as any)[contentType]

            await _delete(contentType, payload.id)
            targetArray.splice(targetArray.findIndex((findItem: T): boolean => findItem.id === payload.id), 1)
        },
        async deleteExpense(expense: IExpense): Promise<void> {
            const {delete: _delete} = useStrapi()
            await _delete("categories", expense.id)
            this.expenses.splice(this.expenses.findIndex((findExpense: IExpense): boolean => findExpense.id === expense.id), 1)
        },
    }
})