<template>
  <ModalDialog
    @closeModal="$emit('closeTriggered')"
    :modal_style="{ size: 'modal-xs' }"
    place_center
  >
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <!-- <div class="modal-cover-header">
        <div class="modal-cover-title">Manage Customer</div>
      </div> -->
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body mt-6">
        <img src="@images/manifest.png" alt="manifest-icon" />

        <div class="title-text">Update Order Status</div>

        <div class="description-text">
          Manage your orders by updating the current status of the selected
          order.
        </div>

        <!-- STOREFRONT ORDER STATUS -->
        <div class="w-full">
          <SelectFieldInput
            labelId="productOrders"
            labelTitle=""
            inputPlaceholder="Select customer order status"
            :inputValue="orderStatus"
            :selectData="orderStatusOptions"
            :hasBottomPadding="false"
            isRequired
            @onSelectionChange="orderStatus = $event"
          />
        </div>
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template #modal-cover-footer>
      <div class="modal-cover-footer flex justify-between gap-x-4 mt-3 mb-1">
        <button
          class="btn btn-sm btn-primary w-full"
          ref="updateStatusBtnRef"
          :disabled="isActionReady"
          @click="handleUpdateOrderStatus"
        >
          Update Order Status
        </button>
      </div>
    </template>
  </ModalDialog>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useEvents } from "@packages/hooks";
import { ModalDialog, SelectFieldInput } from "@packages/uikit";
import { orderStatusList } from "@/modules/storefront/constants/storefront-order-status";
import { useStoreStore } from "../store";

const emits = defineEmits(["closeTriggered", "reloadStoreOrders"]);

const props = defineProps({
  productOrderDetails: {
    type: Object,
    required: true,
  },
});

const { processAPIRequest, pushToastAlert } = useEvents();
const { updateOrderStatus } = useStoreStore() as {
  updateOrderStatus: any;
};

const orderStatusOptions = computed(() => {
  return orderStatusList.map((status) => {
    return { value: status.name, name: status.name };
  });
});

const orderStatus = ref<string>("");

const updateStatusBtnRef = ref(null);

const isActionReady = computed(() => {
  return orderStatus.value ? false : true;
});

const getStoreOrderPayload = computed(() => {
  return {
    id: props.productOrderDetails.id,
    status: orderStatus.value,
  };
});

const handleUpdateOrderStatus = async () => {
    const response = await processAPIRequest({
      action: updateOrderStatus,
      payload: getStoreOrderPayload.value,
      btnRef: updateStatusBtnRef,
      btnText: "Update Order Status",
      alertHandler: {
        200: {
          message: "Order status updated successfully",
          description: "You are being redirected to your orders dashboard",
          type: "success",
        },
        400: {
          message: "Order status update failed",
          description: "Please provide a valid order status",
          type: "error",
        },
      },
    });
    if (response.code === 200) {
      emits("reloadStoreOrders");
      emits("closeTriggered");
    }
};
</script>

<style lang="scss" scoped>
.modal-cover-body {
  @apply flex flex-col items-center pt-6;

  img {
    @apply size-20 mb-4;
  }

  .title-text {
    @apply text-base text-grey-800 font-bold text-center mb-2.5;
  }

  .description-text {
    @apply text-sm leading-[22px] text-grey-700 text-center mb-5;
  }
}
</style>
