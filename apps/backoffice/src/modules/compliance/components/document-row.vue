<template>
  <div :class="['document-row', compact && 'document-row--compact']">
    <p>{{ label }}</p>
    <button
      v-if="displayType === 'file'"
      class="document-file"
      :class="{ 'document-file--disabled': !url }"
      type="button"
      :disabled="!url"
      @click="$emit('view', { label, filename, url })"
    >
      <span class="pdf-icon">PDF</span>
      <span>{{ filename }}</span>
    </button>
    <span v-else class="document-value">{{ filename }}</span>
    <ReviewActions
      section="Business Information"
      :actions-disabled="!hasDocument || reviewStatus !== 'pending'"
      :approve-disabled="isProcessing"
      :approve-label="approvalLabel"
      :reject-disabled="isProcessing"
      :reject-label="rejectionLabel"
      @approve="$emit('approve', { documentUuid, label })"
      @reject="$emit('reject', { documentUuid, label })"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ReviewActions from "./review-actions.vue";

const props = defineProps({
  label: { type: String, required: true },
  filename: { type: String, required: true },
  documentUuid: { type: String, required: true },
  hasDocument: { type: Boolean, default: true },
  reviewStatus: {
    type: String as () => "pending" | "approved" | "rejected",
    default: "pending",
  },
  isProcessing: { type: Boolean, default: false },
  url: { type: String, default: "" },
  displayType: {
    type: String as () => "file" | "text",
    default: "file",
  },
  compact: { type: Boolean, default: false },
});

const approvalLabel = computed(() => {
  if (props.reviewStatus === "approved") return "Approved";
  return props.isProcessing ? "Processing..." : "Approve";
});

const rejectionLabel = computed(() => {
  if (props.reviewStatus === "rejected") return "Rejected";
  return props.isProcessing ? "Processing..." : "Reject";
});

defineEmits<{
  view: [payload: { label: string; filename: string; url: string }];
  approve: [payload: { documentUuid: string; label: string }];
  reject: [payload: { documentUuid: string; label: string }];
}>();
</script>

<style scoped lang="scss">
.document-row {
  @apply border-b border-grey-200 pb-5 pt-1;

  & + .document-row {
    @apply pt-5;
  }

  p {
    @apply mb-4 text-sm font-bold text-grey-900;
  }
}

.document-row--compact {
  @apply mt-6 border-b-0 pb-0;
}

.document-file {
  @apply flex items-center gap-4 text-left text-sm font-medium text-grey-800 transition-colors hover:text-teal-700;
}

.document-file--disabled {
  @apply cursor-not-allowed text-grey-500 hover:text-grey-500;
}

.document-value {
  @apply text-sm font-medium text-grey-800;
}

.pdf-icon {
  @apply inline-flex h-4 w-5 items-center justify-center rounded-sm bg-red-500 text-[7px] font-bold text-white;
}
</style>
