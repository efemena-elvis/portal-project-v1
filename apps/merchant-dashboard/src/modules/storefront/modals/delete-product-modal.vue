<template>
  <ModalDialog @closeModal="$emit('closeTriggered')">
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <div class="modal-cover-header"></div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body">
        <div class="modal-title">Delete Product</div>

        <div class="modal-description">
          You are about to delete
          <span class="font-semibold">{{ productData?.name || "name" }}</span>
          product item. Do you wish to continue?
        </div>

        <div class="modal-actions">
          <button
            class="btn btn-sm cancel-btn"
            @click="$emit('closeTriggered')"
          >
            Cancel
          </button>

          <button
            class="btn btn-sm delete-btn"
            ref="deleteProductBtnRef"
            @click="handleProductDelete"
          >
            Delete
          </button>
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
import {ModalDialog} from "@packages/uikit";
import {useEvents} from "@packages/hooks";
import { useStorefrontStore } from "@/modules/storefront/store";

const emits = defineEmits(["closeTriggered", "reloadStoreProducts"]);

const props = defineProps({
  productData: {
    type: Object,
    required: true,
  },
});

const { processAPIRequest } = useEvents();
const { deleteStoreProduct } = useStorefrontStore();

const deleteProductBtnRef = ref(null);

const handleProductDelete = async () => {
  const response = await processAPIRequest({
    action: deleteStoreProduct,
    payload: { productId: props.productData.id },
    btnRef: deleteProductBtnRef,
    btnText: "Delete",
    alertHandler: {
      200: {
        message: "Product deleted successfully",
        description: "You are being redirected to your product dashboard",
        type: "success",
      },

      400: {
        message: "Product deletion failed",
        description: "An error occurred while deleting your product",
        type: "error",
      },
    },
  });

  if (response.code === 200 || response.status === 200) {
    emits("reloadStoreProducts");
    emits("closeTriggered");
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
