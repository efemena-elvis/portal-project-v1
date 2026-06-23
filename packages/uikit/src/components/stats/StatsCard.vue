<template>
  <div
    class="flex h-[124px] w-[270px] flex-col justify-center rounded-lg bg-grey-10 px-4"
  >
    <p class="mb-4 text-base font-medium text-grey-800">{{ title }}</p>
    <strong class="text-[30px] font-bold leading-none text-grey-900">
      {{ value }}
    </strong>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string;
}>();
</script>
