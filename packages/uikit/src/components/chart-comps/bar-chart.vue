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
  labels: ["Mon", " Tue", "Wed", "Thur", "Fri", "Sat", "Sun"], // Ensure this is defined
  datasets: [
    {
      //   label: "Dataset 1",
      data: [10, 20, 30, 50, 50, 60, 70], 
      backgroundColor: "#A8C5DA",
      borderRadius: 10,
      borderWidth: 0,
     
    
    },
  ],
};

const chartOptions = {
  scales: {
    x: {
      display: true, 
  
      grid: {
        display: false, // Hides the grid lines
      },
       ticks: {
        color: "#c6c9c9", // Gray-700
      },
    },
    y: {
      display: true, // Hides the y-axis

      grid: {
        display: false, // Hides the grid lines
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
