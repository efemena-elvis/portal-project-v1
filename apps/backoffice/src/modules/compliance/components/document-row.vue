<template>
  <div :class="['document-row', compact && 'document-row--compact']">
    <p>{{ label }}</p>
    <div class="document-file" @click="$emit('view', { label, filename })">
      <span class="pdf-icon">PDF</span>
      <span>{{ filename }}</span>
    </div>
    <ReviewActions
      section="Business Information"
      @approve="(section: string) => openActionModal('approve', section)"
      @reject="(section: string) => openActionModal('reject', section)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ReviewActions from './review-actions.vue';

const showActionModal = ref(false);
const activeAction = ref("");
const activeSection = ref("");

const openActionModal = (action: string, section: string) => {
  activeAction.value = action;
  activeSection.value = section;
  showActionModal.value = true;
};

defineProps({
  label: { type: String, required: true },
  filename: { type: String, required: true },
  compact: { type: Boolean, default: false },
});

defineEmits<{
  view: [payload: { label: string; filename: string }];
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
  @apply flex items-center gap-4 text-sm font-medium text-grey-800 cursor-pointer transition-colors hover:text-teal-700;
}

.pdf-icon {
  @apply inline-flex h-4 w-5 items-center justify-center rounded-sm bg-red-500 text-[7px] font-bold text-white;
}
</style>
