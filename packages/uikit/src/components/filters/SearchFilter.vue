<template>
  <div class="relative w-[260px] h-12">
    <div
      :class="[
        'absolute left-4 top-1/2 -translate-y-1/2 icon icon-search-normal text-grey-500',
      ]"
    ></div>
    <input
      :value="modelValue"
      type="search"
      :class="[
        'w-full rounded-lg border border-grey-200 bg-white shadow-sm outline-none transition duration-200 ease-in-out h-full pl-11 pr-4 py-4 text-sm font-medium text-grey-900 focus:outline-none',
      ]"
      :placeholder="placeholder"
      aria-label="placeholder"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  placeholder?: string;
  size?: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>
