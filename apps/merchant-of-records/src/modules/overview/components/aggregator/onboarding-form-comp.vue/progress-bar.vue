<template>
  <div
    class="bg-grey-100 py-4 rounded-full flex gap-8 text-lg justify-center items-center my-2"
  >
    <ul v-for="(step, index) in steps" :key="index">
      <li
        class="flex items-center gap-3"
        :class="
          isActiveStep === step.label ? 'text-green-500' : 'text-grey-600'
        "
      >
        <div
          class="border border-grey-200 w-10 h-10 rounded-full p-4 flex justify-center items-center"
          :class="
            isActiveStep === step.label
              ? 'bg-green-500 text-neutral-10'
              : 'bg-neutral-10 text-grey-600'
          "
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

const props = defineProps(["isActiveStep"]);
</script>

<style scoped></style>
