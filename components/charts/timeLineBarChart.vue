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
  localeDateOptions: object
  locales: string
}>()

const generateBarChartByTimeLine = (payload: { [key: string]: any }[], config: IBarChartConfig): IChart => {
  const dataMap: { [key: string]: number } = {}

  payload.forEach((item: any) => {
    const date: Date = new Date(item[config.structure.dateKey])

    const key = date.toLocaleDateString(props.locales, props.localeDateOptions ?? null)

    dataMap[key] = (dataMap[key] || 0) + item[config.structure.contentKey]
  })

  const intervals = Array.from({length: config.days ? config.days : config.months || 0}, (_, i) => {
    const currentDate = new Date()
    if (config.days) {
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
        label: config.label,
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