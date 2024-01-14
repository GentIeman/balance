<template>
  <Bar
    :data="generateBarChartByTime(props.data, props.config, props.interval)"
    :options="options"
  />
</template>

<script setup lang="ts">
import {Bar} from "vue-chartjs"
import type {IChart, IBarChartConfig} from "~/utils/interfaces"

const props = defineProps<{
  data: any[],
  options: object,
  config: IBarChartConfig,
  interval: string
}>()

const generateBarChartByTime = (payload: { [key: string]: any }[], config: IBarChartConfig, interval: string): IChart => {
  const dataMap: { [key: string]: number } = {}

  payload.forEach((item) => {
    const date: Date = new Date(item[config.structure.dateKey])
    const key = interval === "day"
        ? date.toLocaleDateString()
        : date.toLocaleDateString("en-US", { year: "numeric", month: "long" })

    dataMap[key] = (dataMap[key] || 0) + item[config.structure.contentKey]
  })

  const lastIntervals: Date[] = Array.from({ length: interval === "day" ? config.days : config.months }, (_, i) => {
    const currentDate: Date = new Date()

    if (interval === "day") {
      currentDate.setDate(currentDate.getDate() - i)
    } else {
      currentDate.setMonth(currentDate.getMonth() - i)
    }

    return currentDate
  }).reverse()

  const data = lastIntervals.map((interval: Date) => dataMap[interval.toLocaleDateString()] || 0)

  return {
    labels: lastIntervals,
    datasets: [
      {
        label: config.chartLabel,
        backgroundColor: config.backgroundColor,
        data: data,
      },
    ],
  }
}
const options = computed(() => props.options)

</script>

<style scoped>

</style>