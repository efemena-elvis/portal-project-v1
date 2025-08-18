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
      <div class="mt-6 modal-cover-body">
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
      <div class="flex justify-between mb-1 -mt-2 modal-cover-footer gap-x-4">
        <button
          class="w-1/2 btn btn-sm btn-secondary"
          @click="$emit('closeTriggered')"
        >
          Cancel
        </button>

        <button
          class="w-1/2 btn btn-sm btn-alert"
          ref="deleteBtnRef"
          @click="props.handleProductDelete"
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
const props = defineProps({
  handleProductDelete: {
    type: Function,
    required: true,
  },
});

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
