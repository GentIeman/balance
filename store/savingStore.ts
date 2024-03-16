import {defineStore} from "pinia"

interface ISavingStore {
    savings: ISaving[],
}

export const useSavingStore = defineStore("savingStore", {
    state: (): ISavingStore => ({
        savings: [],
    }),
    getters: {
        savingList: (state: ISavingStore) => state.savings,
        savingCount: (state: ISavingStore) => state.savings.length,
        sortedSavingsByPercent: (state) => {
            const sortedSavings = [...state.savings]

            return sortedSavings.sort(
                (a, b) => Math.abs(b.currentAmount - a.totalAmount) - Math.abs(a.currentAmount - b.totalAmount)
            )
        }
    },
    actions: {
        async fetchUserSavings(): Promise<void> {
            this.$reset()
            const {findOne} = useStrapi()
            const user = useStrapiUser<IUser>()

            try {
                // @ts-ignore
                const {savings} = await findOne("users", user.value.id, {
                    populate: "savings"
                })

                this.savings = savings
            } catch (error) {
                console.error("Error fetching user savings:", error)
            }
        },
        async initSaving(payload: IExpense): Promise<void> {
            const {create, update} = useStrapi()
            const user = useStrapiUser<IUser>()

            try {
                const {data: initializedSaving} = await (
                    payload.id == undefined
                        ? create<ISaving>("savings", {...payload, user: user.value.id})
                        : update<ISaving>("savings", payload.id, {...payload})
                )

                const existingSavingIndex: number = this.savings.findIndex(
                    (existingSaving: ISaving): boolean => existingSaving.id === initializedSaving.id
                )

                existingSavingIndex === -1
                    ? this.savings.push({id: initializedSaving.id, ...initializedSaving.attributes})
                    : this.savings[existingSavingIndex] = {id: initializedSaving.id, ...initializedSaving.attributes}
            } catch (error) {
                console.error("Error init saving", error)
            }
        },
        async deleteSaving(payload: ISaving) {
            const {delete: _delete} = useStrapi()

            await _delete("savings", payload.id)
            this.savings.splice(this.savings.findIndex((findItem: ISaving): boolean => findItem.id === payload.id), 1)
        }
    }
})