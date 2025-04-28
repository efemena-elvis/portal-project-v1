<template>
  <div class="border">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
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
  PointElement
);

// Props for the chart data and options
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

// Set up the chart data
const chartData = computed(() => ({
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Successful",
      borderColor: "#4caf50",
      backgroundColor: "#4caf50",
      data: props.data[0],
      fill: false,
      tension: 0.4, // smooth curve
    },
    {
      label: "Failed",
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
      display: false,
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    x: {
      title: {
        display: true,
      },
    },
    y: {
      display: false, // Disable y-axis numbers and labels
      title: {
        display: false,
      },
      ticks: {
        display: false, // Remove y-axis ticks and labels
      },
      beginAtZero: true,
    },
  },
});
</script>
