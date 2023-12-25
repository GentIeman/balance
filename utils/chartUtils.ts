import type {IBarChartConfig, IChart, IPieChartConfig} from "~/utils/interfaces"
import {getRandomColor} from "~/utils/tools"

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

export const generateMonthBar = (payload: object[], config: IBarChartConfig): IChart => {
    const monthly: { [key: string]: number } = {}

    payload.forEach(item => {
        const date = new Date(item[config.structure.date])
        const monthYear = `${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`
        monthly[monthYear] = (monthly[monthYear] || 0) + item[config.structure.content]
    })

    const lastMonths = Array.from({ length: config.months }, (_, i) => {
        const currentDate = new Date()
        currentDate.setMonth(currentDate.getMonth() - i)
        return currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    }).reverse()

    const data = lastMonths.map(month => monthly[month] || 0)

    return {
        labels: lastMonths,
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

export const generateLineChart = (data: object[], label: string, pointsKey: string, pointKey: string, pointStyle: string, pointRadius: number) => {
    const datasets: object[] = []
    let labelsSet: object[] = []
    const annotations: object = {}

    data.forEach((item, i) => {

        const points = item[pointsKey]
        const aggregatedPoints = points.reduce((acc, point) => ({
            ...acc,
            [new Date(point.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })]: point[pointKey],
        }), {})


        datasets.push({
            label: item[label],
            backgroundColor: getRandomColor(),
            data: Object.values(aggregatedPoints),
            pointStyle: pointStyle,
            pointRadius: pointRadius,
        })

        const monthLabel = new Date(item.endDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        labelsSet = new Set([...labelsSet, ...Object.keys(aggregatedPoints), monthLabel])
    })

    const labels = Array.from(labelsSet).sort((a, b) => new Date(a) - new Date(b))

    data.forEach((item, i) => {
        const monthLabel = new Date(item.endDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        annotations[`point${i + 1}`] = {
            type: "point",
            xValue: labels.indexOf(monthLabel),
            yValue: item.totalAmount,
            backgroundColor: datasets[i].backgroundColor,
        }
    })

    return { datasets, annotations, labels }
}