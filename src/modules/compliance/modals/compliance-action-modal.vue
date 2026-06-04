<template>
  <ModalDialog @closeModal="$emit('closeTriggered')" place_center>
    <template #modal-cover-header>
      <div class="modal-cover-header" />
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body">
        <div class="modal-title">
          {{ action === "approve" ? "Approve" : "Reject" }} {{ section }}
        </div>

        <div class="modal-description">
          Are you sure you want to {{ action }} the {{ section }}?
        </div>

        <div class="modal-actions">
          <button
            class="btn btn-sm cancel-btn"
            @click="$emit('closeTriggered')"
          >
            Cancel
          </button>

          <button
            class="btn btn-sm action-btn"
            :class="action === 'approve' ? 'approve-btn' : 'reject-btn'"
            ref="actionBtnRef"
            @click="$emit('confirmed', { action, section })"
          >
            {{ action === "approve" ? "Approve" : "Reject" }}
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
import { ref } from "vue";
import { ModalDialog } from "@packages/uikit";

defineProps({
  action: { type: String, required: true },
  section: { type: String, required: true },
});

defineEmits<{
  closeTriggered: [];
  confirmed: [payload: { action: string; section: string }];
}>();

const actionBtnRef = ref(null);
</script>

<style lang="scss" scoped>
.modal-cover-body {
  .modal-title {
    @apply text-grey-900 text-[22px] sm:text-xl font-semibold mb-6;
  }

  .modal-description {
    @apply text-grey-600 text-[14.75px] sm:text-[13.5px] mb-8;
  }

  .modal-actions {
    @apply flex flex-nowrap justify-start items-center gap-x-3;

    .btn {
      @apply rounded-xl w-1/2;
    }

    .cancel-btn {
      @apply border border-grey-600 text-grey-600 hover:bg-grey-600 hover:text-neutral-10;
    }

    .action-btn {
      @apply border text-white;
    }

    .approve-btn {
      @apply bg-green-500 border-green-500 hover:bg-green-600;
    }

    .reject-btn {
      @apply bg-red-500 border-red-500 hover:bg-red-600;
    }
  }
}
</style>
