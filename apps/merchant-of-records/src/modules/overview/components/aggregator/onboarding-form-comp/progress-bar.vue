<template> 
  <div class="flex gap-4 w-[20%] lg:w-[5%] md:justify-center mdLg:justify-center md:max-w-2xl mdLg:max-w-2xl mdLg:mx-auto md:mx-auto">
    <div class="flex flex-col md:flex-row mdLg:flex-row md:p-4 mdLg:p-4 mdLg:-mt-8 p-2 my-4 text-lg rounded-full bg-teal-50 gap-7 h-fit justify-center md:-mt-8">
      <div
        v-for="(step, index) in props.steps"
        :key="index"
        class="cursor-pointer"
        @click="$emit('stepChanged', step.label)"
      >
        <div
          class="flex items-center justify-center w-8 h-8 p-4 rounded-full"
          :class="props.isActiveStep === step.label ? 'bg-green-500' : 'bg-gray-400'"
        >
          <span
            class="text-white mb-[0.8px] hidden md:block mdLg:block lg:hidden"
            :class="props.isActiveStep === step.label ? 'font-bold' : ''"
          >
            {{ step.step }}
          </span>
      </div>
      </div>
    </div>

    <div class="flex flex-col gap-10 mt-8 md:hidden mdLg:hidden lg:hidden ">
      <div
        v-for="(step, index) in props.steps"
        :key="index"
        class="text-sm font-semibold cursor-pointer"
        :class="props.isActiveStep === step.label ? 'text-green-500' : 'text-gray-900'"
        @click="$emit('stepChanged', step.label)"
      >
        {{ step.label }}
        <span class="ml-2 text-sm text-grey-400" v-if="step.optional">Optional</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["isActiveStep", "steps"]);

const emit = defineEmits<{
  (e: "stepChanged", value: string): void;
}>();
</script>

<style scoped></style>
