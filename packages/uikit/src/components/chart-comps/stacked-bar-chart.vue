<template>
  <div :style="{ height: height + 'px', position: 'relative' }">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from "vue";
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
  data: {
    type: Array,
    default: () => [
      { month: "Jan", successful: 300, failed: 50 },
      { month: "Feb", successful: 650, failed: 120 },
      { month: "Mar", successful: 900, failed: 180 },
      { month: "Apr", successful: 650, failed: 220 },
      { month: "May", successful: 650, failed: 130 },
      { month: "Jun", successful: 750, failed: 140 },
      { month: "Jul", successful: 800, failed: 160 },
      { month: "Aug", successful: 680, failed: 150 },
      { month: "Sep", successful: 820, failed: 170 },
      { month: "Oct", successful: 700, failed: 140 },
      { month: "Nov", successful: 750, failed: 130 },
      { month: "Dec", successful: 820, failed: 160 },
    ],
  },
  labels: {
    type: Array,
    default: () => [
      "Number of Successful transactions",
      "Number of Failed transactions",
    ],
  },
  height: {
    type: Number,
    default: 500,
  },
});

const chartData = computed(() => {
  const labels = props.data.map((item) => item.month);
  const successfulData = props.data.map((item) => item.successful);
  const failedData = props.data.map((item) => item.failed);

  return {
    labels,
    datasets: [
      {
        label: props.labels[1],
        data: failedData,
        backgroundColor: "#de7d99",
        borderRadius: 4,
        borderWidth: 0,
        barThickness: 12,
      },
      {
        label: props.labels[0],
        data: successfulData,
        backgroundColor: "#3ab75d",
        borderRadius: 4,
        borderWidth: 0,
        barThickness: 12,
      },
    ],
  };
});

const chartOptions = {
  indexAxis: undefined,
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      display: true,
      stacked: true,
      grid: {
        display: false,
      },
      ticks: {
        color: "#c6c9c9",
        font: {
          size: 12,
        },
      },
    },
    y: {
      display: true,
      stacked: true,
      grid: {
        display: true,
      },
      ticks: {
        color: "#c6c9c9",
        font: {
          size: 12,
        },
        callback: function (value) {
          return value;
        },
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        boxWidth: 12,
        boxHeight: 12,
        usePointStyle: false,
        color: "#525857",
        font: {
          size: 12,
          weight: 500,
        },
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      titleFont: {
        size: 12,
        weight: "bold",
      },
      bodyFont: {
        size: 12,
      },
      borderColor: "#ddd",
      borderWidth: 1,
    },
  },
};
</script>
