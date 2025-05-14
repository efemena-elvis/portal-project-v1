<template>
  <div
    class="flex justify-center flex-col mx-auto w-[30%] md:w-[60%] sm:w-[80%]"
  >
    <h1
      class="text-grey-900 font-semibold text-[28px] md:text-2xl leading-[32px] mb-2.5"
    >
      {{ props.title }}
    </h1>
    <p
      class="text-grey-800/90 text-[14.75px] md:text-[14.5px] leading-[22px] md:leading-[22px] mb-7"
    >
      {{ props.description }}
    </p>
    <slot/>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

</script>

<style scoped></style>
