<template>
  <div class="review-actions">
    <button
      class="review-button review-button--reject"
      type="button"
      :disabled="actionsDisabled || rejectDisabled"
      @click="$emit('reject', section)"
    >
      {{ rejectLabel }}
    </button>
    <button
      class="review-button review-button--approve"
      type="button"
      :disabled="actionsDisabled || approveDisabled"
      @click="$emit('approve', section)"
    >
      {{ approveLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  section: { type: String, required: true },
  actionsDisabled: { type: Boolean, default: false },
  rejectDisabled: { type: Boolean, default: false },
  rejectLabel: { type: String, default: "Reject" },
  approveDisabled: { type: Boolean, default: false },
  approveLabel: { type: String, default: "Approve" },
});

defineEmits<{
  reject: [section: string];
  approve: [section: string];
}>();
</script>

<style scoped lang="scss">
.review-actions {
  @apply mt-8 flex items-center gap-6;
}

.review-button {
  @apply h-9 min-w-[74px] rounded-lg border bg-white px-4 text-sm font-bold transition;
}

.review-button--reject {
  @apply border-red-500 text-red-500 hover:bg-pink-50;

  &:disabled {
    @apply cursor-not-allowed border-grey-300 text-grey-500 hover:bg-white;
  }
}

.review-button--approve {
  @apply border-green-500 text-green-500 hover:bg-green-50;

  &:disabled {
    @apply cursor-not-allowed border-grey-300 text-grey-500 hover:bg-white;
  }
}
</style>
