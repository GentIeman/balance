import {defineStore} from "pinia"
// @ts-ignore
import type {Strapi4ResponseData, Strapi4ResponseMany} from "@nuxtjs/strapi/dist/runtime/types"
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
            const limit = state.userCategoryLimits.find((item: ICategoryLimit): boolean => item.category.id === id)?.limit
            return limit && limit > 0 ? limit : null
        },
        categoryTotalExpenseById: () => (id: number): number => {
            const {expenseList} = useExpenseStore()

            return expenseList
                .filter((expense: IExpense): boolean => expense.categories.id === id)
                .reduce((total: number, expense: IExpense) => total + expense.amount, 0)
        },
        categoryByExpense(state: ICategoryState): ICategory[] {
            const {expenseList} = useExpenseStore()

            return state.categories.map((category: ICategory) => {
                const limit: number | null = this.categoryLimitById(category.id)
                const totalExpenses: number = this.categoryTotalExpenseById(category.id)
                return {...category, limit, totalExpenses}
            }).filter((category: ICategory) => {
                return expenseList.some((expense: IExpense): boolean => expense.categories.id === category.id)
            })
        },
        categoryById: (state: ICategoryState) => (id: number): ICategory | undefined => {
            return state.categories.find((category: ICategory): boolean => category.id == id)
        },
        mapExpensesToCategories: (state) => {
            const {expenseList} = useExpenseStore()
            return expenseList.map((expense) => {
                const category: ICategory | undefined = state.categories.find(
                    (category: ICategory): boolean => expense.categories?.id === category.id
                )
                return {...expense, category: category?.title || "Unknown"}
            })
        },
        categoryStatus(state: ICategoryState): object {
            return state.categories
                .map((category: ICategory) => ({
                    ...category,
                    status: (this.categoryTotalExpenseById(category.id) || 0) > (this.categoryLimitById(category.id) ?? 0) ? "Warn" : "Good"
                }))
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
                const response: Strapi4ResponseData<ICategoryLimit> = await findOne("users", user.value.id, {
                    populate: {
                        category_limits: {
                            fields: ["limit"],
                            populate: {
                                category: {fields: ["id"]}
                            }
                        }
                    }
                })

                this.userCategoryLimits = response.category_limits
            } catch (error) {
                console.error("Error fetching user limits:", error)
            }
        },
        async setLimit(payload: { data: ICategory }): Promise<void> {
            const category: ICategory = payload.data
            const {create, update} = useStrapi()
            const user = useStrapiUser<IUser>()
            const {data: initializedCategory} = await (
                category.id == undefined
                    ? create("category-limits", {...category, user: user.value.id})
                    : update("category-limits", category.id, {...category})
            )
            const existingCategoryIndex: number = this.categories.findIndex(
                (existingCategory: ICategory): boolean => existingCategory.id === initializedCategory.attributes.id
            )

            existingCategoryIndex === -1
                ? this.categories.push(initializedCategory.attributes)
                : this.categories[existingCategoryIndex] = initializedCategory.attributes
        }
    }
})