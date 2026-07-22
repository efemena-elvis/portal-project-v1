<template>
  <div class="progress-row">
    <span>{{ label }}</span>
    <div class="progress-track">
      <span class="progress-fill" :style="{ width: value + '%' }" />
    </div>
    <span v-if="complete" class="complete-dot icon icon-tick-circle" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  complete: { type: Boolean, default: false },
});
</script>

<style scoped lang="scss">
.progress-row {
  @apply grid grid-cols-[86px_1fr_18px] items-center gap-3 text-sm font-semibold text-grey-800;
}

.progress-track {
  @apply h-2 ml-4 overflow-hidden rounded-full border border-blue-400 bg-white;
}

.progress-fill {
  @apply block h-full rounded-full bg-teal-500;
}

.complete-dot {
  @apply text-base text-blue-400;
}
</style>
