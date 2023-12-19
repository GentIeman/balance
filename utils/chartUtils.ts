import type {IBarChartConfig, IChart, IPieChartConfig} from "~/utils/interfaces"

export const generateDaysBar = (payload: object[], config: IBarChartConfig): IChart => {
    const daily: { [key: string]: number } = {}

    payload.forEach(item => {
        const date = new Date(item[config.structure.date]).toLocaleDateString()
        daily[date] = (daily[date] || 0) + item[config.structure.content]
    })

    const lastDays = Array.from({ length: config.days }, (_, i) => {
        const currentDate = new Date()
        currentDate.setDate(currentDate.getDate() - i)
        return currentDate.toLocaleDateString()
    }).reverse()

    const data = lastDays.map(day => daily[day] || 0)

    return {
        labels: lastDays,
        datasets: [
            {
                label: config.chartLabel,
                backgroundColor: config.backgroundColor,
                data: data
            },
        ],
    }
}

export const generatePieChart = (payload: object[], config: IPieChartConfig): IChart => {
    console.log(config)
    const labels = payload.map(item => item[config.label])
    const backgroundColor = payload.map(item => item[config.colorKey])
    const data = payload.map(item => item[config.dataKey])
    return {
        labels: labels,
        datasets: [
            {
                backgroundColor: backgroundColor,
                data: data
            },
        ],
    }
}