<template>
  <ModalDialog @closeModal="$emit('closeTriggered')" place_center>
    <template #modal-cover-header>
      <div class="px-8 pt-8" />
    </template>

    <template #modal-cover-body>
      <div class="delete-modal-body">
        <h2>Remove team member</h2>
        <p>
          Are you sure you want to remove
          <strong>{{ member?.name }}</strong> from your team?
        </p>

        <div class="delete-modal-actions">
          <button
            class="btn cancel-btn"
            type="button"
            @click="$emit('closeTriggered')"
          >
            Cancel
          </button>
          <button
            class="btn delete-btn"
            type="button"
            @click="$emit('memberDeleted')"
          >
            Remove
          </button>
        </div>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { ModalDialog } from "@packages/uikit";

defineProps<{
  member: { name: string; email: string } | null;
}>();

defineEmits<{
  closeTriggered: [];
  memberDeleted: [];
}>();
</script>

<style scoped lang="scss">
.delete-modal-body {
  @apply flex flex-col gap-5 px-8 pb-8 sm:px-5 sm:pb-6;

  h2 {
    @apply text-xl font-bold text-grey-900;
  }

  p {
    @apply text-sm leading-6 text-grey-600;
  }
}

.delete-modal-actions {
  @apply mt-3 flex gap-3 w-full;
}

.btn {
  @apply h-11  border text-sm font-bold transition;
}

.cancel-btn {
  @apply border-grey-500 text-grey-700 hover:bg-grey-50;
}

.delete-btn {
  @apply border-red-500 bg-red-500 text-white hover:bg-red-600;
}
</style>
