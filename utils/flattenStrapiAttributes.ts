// @ts-ignore
import type {Strapi4ResponseData} from "@nuxtjs/strapi/dist/runtime/types"

export default function <T>(object: T[]): T[] {
    return object.map((item: Strapi4ResponseData<T>): T => {
        const {attributes, id}: Strapi4ResponseData<T> = item
        return {id, ...attributes}
    })
}