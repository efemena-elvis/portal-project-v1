<template>
  <ModalDialog
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-xs' }"
    place_center
  >
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <!-- <div class="modal-cover-header">
        <div class="modal-cover-title">Delete Product</div>
      </div> -->
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body mt-6">
        <img src="@images/bin.png" alt="delete-icon" />

        <div class="title-text">Delete Product</div>
        <div class="description-text">
          Are you sure you want to delete this product? This action cannot be
          undone.
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template #modal-cover-footer>
      <div class="modal-cover-footer flex justify-between gap-x-4 -mt-2 mb-1">
        <button
          class="btn btn-sm btn-secondary w-1/2"
          @click="$emit('closeTriggered')"
        >
          Cancel
        </button>

        <button
          class="btn btn-sm btn-alert w-1/2"
          ref="deleteBtnRef"
          @click="handleProductDelete"
        >
          Delete Product
        </button>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useEvents } from "@packages/hooks";
import { useSettingsStore } from "@/modules/settings/store";
import { ModalDialog } from "@packages/uikit";

const emits = defineEmits(["closeTriggered"]);

const { processAPIRequest, pushToastAlert } = useEvents();

const deleteBtnRef = ref(null);

const handleProductDelete = async () => {
  //   const response = await processAPIRequest({
  //     action: updateUserPassword,
  //     payload: getPayload.value,
  //     btnRef: changePasswordBtnRef,
  //     btnText: "Change Password",
  //     alertHandler: {
  //       200: {
  //         message: "Password updated successfully",
  //         type: "success",
  //       },
  //       400: {
  //         message: "Password update failed",
  //         type: "error",
  //       },
  //     },
  //   });
  //   if (response.code === 200) {
  //     setTimeout(() => emits("closeTriggered"), 500);
  //   }
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  @apply flex flex-col items-center pt-6;

  img {
    @apply size-20 mb-6;
  }

  .title-text {
    @apply text-lg text-grey-800 font-bold text-center mb-2;
  }

  .description-text {
    @apply text-[15px] text-grey-700 text-center w-[90%] mb-6;
  }
}
</style>
