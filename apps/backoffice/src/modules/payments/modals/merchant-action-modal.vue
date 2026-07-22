<!-- eslint-disable vue/valid-define-props, vue/valid-define-emits -->
<template>
  <ModalDialog @closeModal="$emit('closeTriggered')" place_center>
    <template #modal-cover-header>
      <div class="modal-cover-header" />
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body">
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>

        <div class="modal-actions">
          <button
            class="btn cancel-btn"
            type="button"
            @click="$emit('closeTriggered')"
          >
            Cancel
          </button>
          <button
            class="btn action-btn"
            :class="buttonToneClass"
            type="button"
            @click="$emit('confirmed')"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </template>

    <template #modal-cover-footer>
      <div class="modal-cover-footer" />
    </template>
  </ModalDialog>
</template>

<script setup lang="ts">
/* eslint-disable vue/valid-define-props, vue/valid-define-emits */
import { computed, defineEmits, defineProps, withDefaults } from "vue";
import { ModalDialog } from "@packages/uikit";

const props = withDefaults(
  defineProps<{
    action: string;
    title?: string;
    description?: string;
    confirmText?: string;
    tone?: "success" | "danger";
  }>(),
  {
    title: "",
    description: "",
    confirmText: "Confirm",
    tone: "success",
  },
);

defineEmits<{
  closeTriggered: [];
  confirmed: [];
}>();

const fallbackTitle = computed(() => {
  const words = props.action.split("-").filter(Boolean).join(" ");
  return words ? words[0].toUpperCase() + words.slice(1) : "Confirm action";
});

const title = computed(() => props.title || fallbackTitle.value);
const description = computed(
  () => props.description || "Are you sure you want to continue?",
);
const confirmText = computed(() => props.confirmText);
const buttonToneClass = computed(() =>
  props.tone === "danger" ? "action-btn--danger" : "action-btn--success",
);
</script>

<style scoped lang="scss">
.modal-cover-body {
  @apply flex flex-col gap-5;

  h2 {
    @apply text-xl font-bold text-grey-900;
  }

  p {
    @apply text-sm leading-6 text-grey-600;
  }
}

.modal-actions {
  @apply mt-3 flex items-center gap-3;
}

.btn {
  @apply h-11 w-1/2 rounded-lg border text-sm font-bold transition;
}

.cancel-btn {
  @apply border-grey-500 text-grey-700 hover:bg-grey-50;
}

.action-btn {
  @apply text-white;
}

.action-btn--success {
  @apply border-green-500 bg-green-500 hover:bg-green-600;
}

.action-btn--danger {
  @apply border-red-500 bg-red-500 hover:bg-red-600;
}
</style>
