<template>
  <Line
    :data="data"
    :options="computedOptions"
  />
</template>

<script setup lang="ts">
import {Line} from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const props = defineProps({
  datasets: {
    required: true
  },
  labels: {
    required: true
  },
  options: {
    required: true
  }
})

const data = computed(() => {
  return {
    labels: props.labels,
    datasets: props.datasets,
  }
})

const computedOptions = computed(() => props.options)
</script>

<style scoped>

</style>