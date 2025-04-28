<template>
  <Bar :data="chartData" :options="chartOptions" />
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
  LinearScale
);

const chartData = {
  labels: ["January", "February", "March"], // Ensure this is defined
  datasets: [
    {
      //   label: "Dataset 1",
      data: [65, 59, 80],
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  scales: {
    x: {
      display: false, // Hides the x-axis
    },
    y: {
      display: false, // Hides the y-axis
    },
  },
  plugins: {
    legend: {
      display: false, // Hides the legend (if you want to hide it too)
    },
  },
};
</script>
