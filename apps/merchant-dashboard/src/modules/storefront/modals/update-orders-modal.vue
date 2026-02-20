<template>
  <ModalDialog @closeModal="$emit('closeTriggered')">
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">Update Order Status</div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body mt-0.5">
        <div class="text-[13.5px] leading-6 text-grey-800/75 mb-8">
          Easily manage your order workflow by updating the current status of
          the selected order.
        </div>

        <!-- STOREFRONT ORDER STATUS -->
        <SelectFieldInput
          labelId="productOrders"
          labelTitle="What's the status of the order?"
          inputPlaceholder="Select status"
          :inputValue="orderStatus"
          :selectData="orderStatusOptions"
          isRequired
          @onSelectionChange="orderStatus = $event"
        />
      </div>
    </template>

    <!-- MODAL COVER FOOTER -->
    <template #modal-cover-footer>
      <div class="modal-cover-footer -mt-2">
        <button
          class="btn btn-primary w-full"
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
import {SelectFieldInput, ModalDialog} from "@packages/uikit";
import {useEvents} from "@packages/hooks";
import { orderStatuses } from "@packages/constants";
import { useStorefrontStore } from "@/modules/storefront/store";



interface IStatus {
    id: number;
    name: string;
    description: string
}

const emits = defineEmits(["closeTriggered", "reloadStoreOrders"]);


const props = defineProps({
  orderDetails: {
    type: Object,
    required: true,
  },
});

const { processAPIRequest } = useEvents();
const { updateOrderStatus } = useStorefrontStore();

const orderStatusOptions = computed(() => {
  return orderStatuses.map((status: IStatus) => {
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
    id: props.orderDetails.id,
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

<style lang="scss" scoped></style>
