<template>
  <div :style="{ height: height + 'px', position: 'relative' }">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      { country: "Ghana", amount: 3200 },
      { country: "Nigeria", amount: 5600 },
      { country: "Zambia", amount: 1800 },
      { country: "Tanzania", amount: 1400 },
      { country: "South Africa", amount: 1000 },
    ],
  },
  labels: {
    type: Array,
    default: () => [],
  },
  backgroundColors: {
    type: Array,
    default: () => [
      "#eea41a", // Yellow - Ghana
      "#3ab75d", // Green - Nigeria
      "#d6341b", // Red - Zambia
      "#24acee", // Teal - Tanzania
      "#f44336", // Red - South Africa
    ],
  },
  height: {
    type: Number,
    default: 500,
  },
});

const chartData = computed(() => {
  const labels = props.data.map((item) => item.country);
  const amounts = props.data.map((item) => item.amount);

  return {
    labels,
    datasets: [
      {
        label: "Total transaction amount",
        data: amounts,
        backgroundColor: props.backgroundColors,
        borderColor: "#fff",
        borderWidth: 2,
        radius: "60%",
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "85%",
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        boxWidth: 12,
        boxHeight: 12,
        usePointStyle: true,
        color: "#525857",
        font: {
          size: 12,
          weight: 500,
        },
        padding: 15,
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
      callbacks: {
        label: function (context) {
          const value = context.parsed || 0;
          return context.label + ": " + value + "%";
        },
      },
    },
  },
};
</script>
