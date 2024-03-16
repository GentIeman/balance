export default function (arr: { [key: string]: any }[], key: string, locale: string, localeOptions?: object): { [key: string]: any }[] {
    return arr.map((item: { [key: string]: any }) => {
        const date: Date = new Date(item[key])
        if (!isNaN(date.getTime())) item[key] = date.toLocaleDateString(locale, localeOptions)
        return item
    })
}