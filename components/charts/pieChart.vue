<template>
  <Pie
    :data="chartData"
    :options="chartOptions"
  />
</template>

<script setup lang="ts">
import {Pie} from "vue-chartjs"
import type {IChart, IPieChartConfig} from "~/utils/interfaces"

const props = defineProps<{
  data: any[],
  options: object,
  config: IPieChartConfig,
}>()

const generatePieChart = (payload: { [key: string]: any }[], config: IPieChartConfig): IChart => {
  const labels = payload.map(item => item[config.label])
  const backgroundColor = payload.map(item => item[config.backgroundColor])
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
const chartData = computed(() => generatePieChart(props.data, props.config))
const chartOptions = computed(() => props.options)

</script>

<style scoped>

</style>