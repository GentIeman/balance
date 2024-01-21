<template>
  <Bar
    :data="chartData"
    :options="chartOptions"
  />
</template>

<script setup lang="ts">
import {Bar} from "vue-chartjs"
import type {IChart, IBarChartConfig} from "~/utils/interfaces"

const props = defineProps<{
  data: any[],
  options: object,
  config: IBarChartConfig,
  interval: string,
  localeDateOptions: object
  locales: string
}>()

const generateBarChartByTimeLine = (payload: { [key: string]: any }[], config: IBarChartConfig, interval: string): IChart => {
  const dataMap: { [key: string]: number } = {}

  payload.forEach((item: any) => {
    const date: Date = new Date(item[config.structure.dateKey])

    const key = interval === "day"
        ? date.toLocaleDateString(props.locales)
        : date.toLocaleDateString(props.locales, props.localeDateOptions ?? null)

    dataMap[key] = (dataMap[key] || 0) + item[config.structure.contentKey]
  })

  const intervals = Array.from({length: interval === "day" ? config.days || 0 : config.months || 0}, (_, i) => {
    const currentDate = new Date()
    if (interval == "day") {
      currentDate.setDate(currentDate.getDate() - i)
    } else {
      currentDate.setMonth(currentDate.getMonth() - i)
    }
    return currentDate.toLocaleDateString(props.locales, props.localeDateOptions ?? null)
  }).reverse()

  const data = intervals.map((interval) => dataMap[interval] || 0)

  return {
    labels: intervals,
    datasets: [
      {
        label: config.chartLabel,
        backgroundColor: config.backgroundColor,
        data: data,
      },
    ],
  }
}

const chartData = computed(() => generateBarChartByTimeLine(props.data, props.config, props.interval))
const chartOptions = computed(() => props.options)

</script>

<style scoped>

</style>