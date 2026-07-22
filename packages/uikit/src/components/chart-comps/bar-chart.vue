<template>
  <div :style="{ height: height + 'px', position: 'relative' }">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
);

const props = defineProps({
  height: {
    type: Number,
    default: 250,
  },
});

const chartData = {
  labels: ["Mon", " Tue", "Wed", "Thur", "Fri", "Sat", "Sun"], // Ensure this is defined
  datasets: [
    {
      //   label: "Dataset 1",
      data: [10, 20, 30, 15, 40, 35, 20],
      backgroundColor: "#de7d99",
      borderRadius: 4,
      borderWidth: 1,
      barThickness: 12,
    },
    {
      //   label: "Dataset 1",
      data: [42, 35, 90, 55, 65, 75, 85],
      backgroundColor: "#8ddca2",
      borderRadius: 4,
      borderWidth: 1,
      barThickness: 12,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      display: true,

      grid: {
        display: true, // Hides the grid lines
      },
      ticks: {
        color: "#c6c9c9", // Gray-700
      },
    },
    y: {
      display: true, // Hides the y-axis

      grid: {
        display: true, // Hides the grid lines
      },
      ticks: {
        color: "#c6c9c9", // Gray-700
      },
    },
  },

  plugins: {
    legend: {
      display: false, // Hides the legend (if you want to hide it too)
    },
  },
};
</script>
