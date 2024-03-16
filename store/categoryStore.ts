import {defineStore} from "pinia"
// @ts-ignore
import type {Strapi4ResponseMany} from "@nuxtjs/strapi/dist/runtime/types"
import {useExpenseStore} from "~/store/expenseStore"

interface ICategoryState {
    categories: ICategory[],
    userCategoryLimits: ICategoryLimit[]
}

export const useCategoryStore = defineStore("categoryStore", {
    state: (): ICategoryState => ({
        categories: [],
        userCategoryLimits: [],
    }),
    getters: {
        categoryList: (state: ICategoryState) => state.categories,
        categoriesCount: (state: ICategoryState) => state.categories.length,
        categoryLimitById: (state: ICategoryState) => (id: number): number | null => {
            const limit = state.userCategoryLimits.find((item: ICategoryLimit): boolean => item.category === id)?.limit
            return limit && limit > 0 ? limit : null
        },
        categoryTotalExpenseById: () => (id: number): number => {
            const {expenseList} = useExpenseStore()

            return expenseList
                .filter((expense: IExpense): boolean => expense.categories === id)
                .reduce((total: number, expense: IExpense) => total + expense.amount, 0)
        },
        categoryByExpense(state: ICategoryState): ICategory[] {
            const {expenseList} = useExpenseStore()

            return state.categories.map((category: ICategory) => {
                const limit: number | null = this.categoryLimitById(category.id)
                const totalExpenses: number = this.categoryTotalExpenseById(category.id)
                return {...category, limit, totalExpenses}
            }).filter((category: ICategory) => {
                return expenseList.some((expense: IExpense): boolean => expense.categories === category.id)
            })
        },
        categoryById: (state: ICategoryState) => (id: number): ICategory | undefined => {
            return state.categories.find((category: ICategory): boolean => category.id == id)
        },
        mapExpensesToCategories: (state) => {
            const {expenseList} = useExpenseStore()
            return expenseList.map((expense) => {
                const category: ICategory | undefined = state.categories.find(
                    (category: ICategory): boolean => expense.categories === category.id
                )
                return {...expense, category: category?.title || "Unknown"}
            })
        }
    },
    actions: {
        async fetchAllCategories(): Promise<void> {
            this.$reset()
            const {find} = useStrapi()

            try {
                const {data: categories}: Strapi4ResponseMany<ICategory> = await find("categories", {
                    fields: ["id", "title", "color", "createdAt"]
                })
                this.categories = flattenStrapiAttributes<ICategory>(categories)
            } catch (error) {
                console.error("Error fetching categories", error)
            }
        },
        async fetchUserCategoryLimits(): Promise<void> {
            await this.fetchAllCategories()
            const {findOne} = useStrapi()
            const user = useStrapiUser<IUser>()

            try {
                // @ts-ignore
                const {category_limits} = await findOne("users", user.value.id, {
                    populate: {
                        category_limits: {
                            fields: ["limit"],
                            populate: {
                                category: {fields: ["id"]}
                            }
                        }
                    }
                })

                for (const limit of category_limits) {
                    this.userCategoryLimits.push({...limit, category: limit.category.id})
                }
            } catch (error) {
                console.error("Error fetching user limits:", error)
            }
        },
        async setLimit(payload: ICategoryLimit ): Promise<void> {
            const {create, update} = useStrapi()
            const user = useStrapiUser<IUser>()

            const existingLimitIndex: number = this.userCategoryLimits.findIndex(
                (limit: ICategoryLimit): boolean => limit.category === payload.category
            )

            const existingLimit: ICategoryLimit | undefined = this.userCategoryLimits[existingLimitIndex]

            try {
                const {data: initializedLimit} = await (
                    existingLimit?.id == undefined
                        ? create<ICategoryLimit>("category-limits", {...payload, user: user.value.id})
                        : update<ICategoryLimit>("category-limits", existingLimit.id, {...payload})
                )

                existingLimitIndex === -1
                    ? this.userCategoryLimits.push({...initializedLimit.attributes, category: payload.category })
                    : this.userCategoryLimits[existingLimitIndex] = {...initializedLimit.attributes, category: payload.category}
            } catch (error) {
                console.error("Error set limit:", error)
            }
        }
    }
})