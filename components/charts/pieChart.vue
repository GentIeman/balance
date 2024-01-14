<template>
  <Pie
    :data="generatePieChart(props.data, props.config)"
    :options="options"
  />
</template>

<script setup lang="ts">
import {Pie} from "vue-chartjs"
import type {IChart} from "~/utils/interfaces"

const props = defineProps<{
  data: any[],
  options: object,
  config: IPieChartConfig,
}>()


interface IPieChartConfig {
  label: string,
  dataKey: string,
  backgroundColor: string
}

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
const options = computed(() => props.options)

</script>

<style scoped>

</style>