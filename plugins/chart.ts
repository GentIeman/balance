import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js"
import annotationPlugin from "chartjs-plugin-annotation"
import zoomPlugin from "chartjs-plugin-zoom"
export default defineNuxtPlugin(() => {
    Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin, zoomPlugin)
})