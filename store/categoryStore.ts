import {defineStore} from "pinia"
import type {ICategory, IUser} from "~/utils/interfaces"

interface ICategoryState {
    categories: ICategory[]
}

export const useCategoryStore = defineStore("categoryStore", {
    state: (): ICategoryState => ({
        categories: []
    }),
    getters: {
        getCategoriesCount: (state: ICategoryState): number => state.categories.length,
        getReverseCategories: (state: ICategoryState): object[] => state.categories.reverse(),
        getCategoryById: (state: ICategoryState) => (id: number | undefined) => {
            return state.categories.find((category: ICategory): boolean => category.id == id)
        }
    },
    actions: {
        async fetchUserCategories(): Promise<void> {
            const {findOne} = useStrapi()
            const user = useStrapiUser<IUser>()

            try {
                // @ts-ignore
                const {categories} = await findOne("users", user.value.id, {
                    populate: "categories"
                })
                this.categories = categories
            } catch (error) {
                console.error("Error fetching user categories:", error)
            }
        },
        async initCategory(category: ICategory): Promise<void> {
            const {create, update} = useStrapi()
            const user = useStrapiUser<IUser>()
            const {data: initializedCategory} = await (
                category.id == undefined
                    ? create("categories", {...category, user: user.value.id})
                    : update("categories", category.id, {...category})
            )
            const existingCategoryIndex: number = this.categories.findIndex((existingCategory: ICategory): boolean => existingCategory.id === initializedCategory.attributes.id)
            existingCategoryIndex === -1
                ? this.categories.push(initializedCategory.attributes)
                : (this.categories[existingCategoryIndex] = initializedCategory.attributes)
        },
        async deleteCategory(category: ICategory): Promise<void> {
            const {delete: _delete} = useStrapi()
            await _delete("categories", category.id)
            this.categories.splice(this.categories.findIndex((findCategory: ICategory): boolean => findCategory.id === category.id), 1)
        },
    }
})