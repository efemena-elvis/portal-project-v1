<template>
  <div
    class="relative text-sm font-semibold text-teal-800 h-12 w-[200px] border rounded-lg cursor-pointer filter-select bg-white"
  >
    <select
      :value="modelValue"
      class="bg-transparent appearance-none focus:outline-none w-full h-full px-4"
      @change="
        $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
      "
    >
      <option value="">{{ placeholder }}</option>
      <option
        v-for="(opt, index) in normalizedOptions"
        :key="index"
        :value="opt.value"
      >
        {{ opt.name }}
      </option>
    </select>
    <div
      :class="[
        'absolute pointer-events-none icon icon-caret-down text-[16px] text-teal-800 -translate-y-1/2 right-4 top-1/2',
      ]"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Option {
  value: string;
  name: string;
}

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  options?: (string | Option)[];
  width?: string;
  size?: "lg" | "sm";
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const normalizedOptions = computed<Option[]>(() => {
  if (!props.options) return [];
  return props.options.map((opt) => {
    if (typeof opt === "string") {
      return { value: opt.toLowerCase(), name: opt };
    }
    return opt;
  });
});
</script>
