<template>
  <div class="flex gap-4 w-[20%]">
    <div
      class="bg-teal-50 rounded-full flex flex-col gap-7 p-2 text-lg my-2 h-fit"
    >
      <div
        v-for="(step, index) in props.steps"
        :key="index"
        class="cursor-pointer"
        @click="$emit('stepChanged', step.label)"
      >
       
          <div
            class="w-8 h-8 rounded-full p-4 flex justify-center items-center"
            :class="
              props.isActiveStep === step.label
                ? 'bg-green-500'
                : 'bg-gray-400'
            "
          ></div>
       
      </div>
    </div>
    <div class="flex flex-col gap-10 mt-6">
      <div
        v-for="(step, index) in props.steps"
        :key="index"
        class="text-sm font-semibold"
          :class="props.isActiveStep === step.label ? 'text-green-500' : 'text-gray-900'"
      >
        {{ step.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from "vue";



const props = defineProps(["isActiveStep", "steps"]);

defineEmits<{
  (e: "stepChanged", label: string): void;
}>();
</script>

<style scoped></style>
