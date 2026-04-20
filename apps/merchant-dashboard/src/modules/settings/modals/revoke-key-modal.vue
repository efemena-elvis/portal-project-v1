<template>
  <ModalDialog @closeModal="$emit('closeTriggered')">
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <div class="modal-cover-header"></div>
    </template>

    <template #modal-cover-body>
       <div>
          <div class="modal-cover-body">
            <div class="modal-title">Revoke Publishable Key</div>
            <div class="modal-description">
              Are you sure you want to revoke the current publishable key? This
              action cannot be undone.
            </div>

            <div class="modal-actions">
              <button class="btn btn-sm cancel-btn" @click="$emit('closeTriggered')">
                Cancel
              </button>
              <button
                class="btn btn-sm delete-btn"
                ref="revokeKeyBtnRef"
                @click="handleConfirmRevokePublishableKey"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template #modal-cover-footer>
      <div class="modal-cover-footer"></div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ModalDialog } from "@packages/uikit";
import { useEvents } from "@packages/hooks";
import { useSettingsStore } from "@/modules/settings/store";

const emits = defineEmits(["closeTriggered", "reloadPublishableKeys"]);

const props = defineProps<{
  keyData: {
    id: string;
    key: string;
    [key: string]: any;
  };
}>();

const { processAPIRequest } = useEvents();
const { revokePublishableKey } = useSettingsStore();

const revokeKeyBtnRef = ref(null);

const handleConfirmRevokePublishableKey = async () => {
  const response = await processAPIRequest({
    action: revokePublishableKey,
    btnRef: revokeKeyBtnRef,
    payload: {
      key_id: props.keyData.id,
    },
    btnText: "Revoke Publishable Key",
    alertHandler: {
      200: {
        message: "Publishable key revoked successfully",
        type: "success",
      },
      400: {
        message: "Failed to revoke publishable key",
        type: "error",
      },
    },
  });
  if (response.code === 200) {
    emits("closeTriggered");
    emits("reloadPublishableKeys");
  }
};


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

    .delete-btn {
      @apply bg-red-500 text-neutral-10 hover:bg-red-600;
    }
  }
}
</style>
