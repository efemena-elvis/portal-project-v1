<template>
  <div class="flex gap-4 w-[20%]">
    <div
      class="flex flex-col p-2 my-2 text-lg rounded-full bg-teal-50 gap-7 h-fit"
    >
      <div
        v-for="(step, index) in props.steps"
        :key="index"
        class="cursor-pointer"
        @click="$emit('stepChanged', step.label)"
      >
       
          <div
            class="flex items-center justify-center w-8 h-8 p-4 rounded-full"
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
        <span class="ml-2 text-sm text-grey-400" v-if = "step.optional">Optional</span>
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
