<template>
  <div class="border">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, computed, h } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

// Register the required components for Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
);

// Props for the chart data and options
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  dataLabels: { type: Array, required: true },
  labels: {
    type: Array,
    required: true,
  },
});

// Set up the chart data
const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.dataLabels[0],
      borderColor: "#4caf50",
      backgroundColor: "#4caf50",
      data: props.data[0],
      fill: false,
      tension: 0.4, // smooth curve
    },
    {
      label: props.dataLabels[1],
      borderColor: "#f44336",
      backgroundColor: "#f44336",
      data: props.data[1],
      fill: false,
      tension: 0.4, // smooth curve
    },
  ],
}));

// Set up the chart options
const chartOptions = ref({
  responsive: true,

  plugins: {
    legend: {
      display: true,
      backgroundColor: "#fff",
      position: "top",
      labels: {
        boxWidth: 5,
        boxHeight: 5,
        usePointStyle: true,
        pointStyle: "circle",
        color: "#c6c9c9",
      },
    },
    tooltip: {
      mode: "index",
      intersect: true,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
      },
      grid: {
        display: false,
      },
      ticks: {
        color: "#c6c9c9",
      },
    },

    y: {
      display: true,
      title: {
        display: true,
      },
      grid: {
        display: false, // Remove y-axis grid lines
      },
      ticks: {
        display: true,

        color: "#c6c9c9",
      },
      beginAtZero: true,
    },
  },
});
</script>
