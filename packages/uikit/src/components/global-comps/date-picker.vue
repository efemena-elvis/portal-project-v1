<template>
  <div class="overview-filter">
    <VueDatePicker
      v-model="dateRange"
      range
      format="dd MMM yyyy"
      placeholder="Date Range"
      :enable-time-picker="false"
      @update:model-value="handleDateChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const dateRange = ref<[Date, Date] | null>(null);

interface IFilterType {
  filterSize: string;
  activePeriod: [Date, Date] | null;
  modelValue?: [Date, Date] | null;
}

const props = withDefaults(defineProps<IFilterType>(), {
  filterSize: "sm",
  activePeriod: null,
  modelValue: null,
});

const emits = defineEmits<{
  (e: "onFilterSelected", value: [Date, Date] | null): void;
  (e: "update:modelValue", value: [Date, Date] | null): void;
}>();

const handleDateChange = (value: [Date, Date] | null) => {
  dateRange.value = value;

  if (value && value.length === 2) {
    emits("onFilterSelected", value);
    emits("update:modelValue", value);
  } else {
    emits("onFilterSelected", null);
    emits("update:modelValue", null);
  }
};

watch(
  () => props.activePeriod ?? props.modelValue,
  (newVal) => {
    dateRange.value = newVal;
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.overview-filter {
  @apply relative  min-w-max sm:w-1/2 md:w-full;

  :deep(.dp__input) {
    @apply p-4 border border-gray-300 relative rounded-md text-sm font-semibold text-teal-800 bg-white cursor-pointer transition duration-200 ease-in-out focus:outline-none w-[300px] h-12 py-4 px-6;
  }

  :deep(.dp__input::placeholder) {
    @apply text-teal-800 font-bold relative left-4;
  }

  :deep(.dp__menu) {
    @apply border border-gray-200 shadow-lg rounded-lg bg-white text-gray-800;
  }

  :deep(.dp__range_start),
  :deep(.dp__range_end) {
    @apply bg-teal-600 text-white;
  }

  :deep(.dp__cell_inner:hover) {
    @apply bg-teal-50 text-teal-700;
  }

  :deep(.dp__today) {
    @apply border border-teal-500;
  }

  :deep(.dp__icon) {
    @apply text-teal-800;
  }
}
</style>
