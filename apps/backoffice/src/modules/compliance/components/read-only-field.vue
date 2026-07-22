<template>
  <label class="readonly-field">
    <span>{{ label }}</span>
    <div class="readonly-control">
      <slot name="prefix" />
      <input :value="value" readonly />
    </div>
  </label>
</template>

<script setup lang="ts">
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
});
</script>

<style scoped lang="scss">
.readonly-field {
  @apply flex flex-col gap-2 text-sm font-bold text-grey-900;
}

.readonly-control {
  @apply flex h-10 items-center overflow-hidden rounded-lg border border-grey-300 bg-grey-50;

  input {
    @apply h-full min-w-0 flex-1 bg-transparent px-4 text-sm font-medium text-grey-800 outline-none;
  }
}
</style>
