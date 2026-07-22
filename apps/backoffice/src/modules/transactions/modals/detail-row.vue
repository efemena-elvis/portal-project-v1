<template>
  <div class="detail-row">
    <span class="detail-label">{{ label }}</span>
    <strong class="detail-value">{{ displayValue }}</strong>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    label: string;
    value?: string | number | null;
  }>(),
  {
    value: "-",
  },
);

const displayValue = computed(() => {
  if (props.value === null || props.value === undefined || props.value === "")
    return "-";
  return props.value;
});
</script>

<style scoped lang="scss">
.detail-row {
  @apply flex items-center justify-between gap-6 border-b border-grey-100 py-4 px-5 text-sm last:border-b-0;

  .detail-label {
    @apply text-grey-600 font-medium;
  }

  .detail-value {
    @apply max-w-[60%] break-words text-right font-semibold text-grey-900;
  }
}
</style>
