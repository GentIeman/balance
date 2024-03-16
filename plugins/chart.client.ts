import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement } from "chart.js"
import annotationPlugin from "chartjs-plugin-annotation"
import zoomPlugin from "chartjs-plugin-zoom"
export default defineNuxtPlugin(() => {
    Chart.register(CategoryScale, LinearScale, ArcElement, PointElement, LineElement, BarElement, Title, Tooltip, Legend, annotationPlugin, zoomPlugin)
})