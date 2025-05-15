<template>
  <div
    class="bg-grey-100 py-4 text-grey-600 rounded-full flex gap-8 text-lg justify-center items-center"
  >
    <ul v-for="(step, index) in steps" :key="index">
      <li class="flex items-center gap-3">
        <div
          class="bg-neutral-10 border border-grey-200 w-10 h-10 rounded-full p-4 flex justify-center items-center"
        >
          {{ step.step }}
        </div>
        <p>{{ step.label }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const steps = ref([
  { step: 1, label: "Profile" },
  { step: 2, label: "Director" },
  { step: 3, label: "UBO" },
  { step: 4, label: "Documents" },
]);
</script>

<style scoped></style>
