<template>
  <ModalDialog :place_side="true" @closeModal="$emit('closeTriggered')">
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">Order Information</div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body mt-2">
        <!-- CUSTOMER DETAILS -->
        <div class="display-block">
          <div class="title-row mb-5">Customer Details</div>

          <div class="item-row">
            <div class="item-row--left">Fullname</div>
            <div class="item-row--right">{{ customerDetails.fullname }}</div>
          </div>

          <div class="item-row">
            <div class="item-row--left">Email</div>
            <div class="item-row--right">{{ customerDetails.email }}</div>
          </div>

          <div class="item-row">
            <div class="item-row--left">Phone Number</div>
            <div class="item-row--right">{{ customerDetails.phone }}</div>
          </div>

          <div class="item-row">
            <div class="item-row--left">House Address</div>
            <div class="item-row--right">{{ customerDetails.address }}</div>
          </div>
        </div>

        <!-- PRODUCT DETAILS -->
        <div class="product-block">
          <div class="title-row mb-3">Product Details</div>

          <ProductOrderItem
            :product="product"
            v-for="(product, index) in productDetails"
            :key="index"
          />
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
import { ref, computed } from "vue";
import {ModalDialog} from "@packages/uikit";
import {useEvents} from "@packages/hooks";
import ProductOrderItem from "@/modules/storefront/modals/product-order-item.vue";
import { useStorefrontStore } from "@/modules/storefront/store";

const emits = defineEmits(["closeTriggered"]);

const props = defineProps({
  orderId: {
    type: String,
    default: "1",
  },
});

const { processAPIRequest } = useEvents();
const { viewOrderDetails } = useStorefrontStore();

const isLoading = ref<boolean>(false);

const customerDetails = ref({
  fullname: "",
  email: "",
  phone: "",
  address: "",
});
const productDetails = ref([]);

const fetchOrderDetails = async () => {
  const response = await processAPIRequest({
    action: viewOrderDetails,
    payload: { orderId: props.orderId },
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    const { address, customer_details, order_details } = response.data;

    customerDetails.value.fullname = `${customer_details.firstname} ${customer_details.lastname}`;
    customerDetails.value.email = customer_details.email;
    customerDetails.value.phone = customer_details.phone_number;
    customerDetails.value.address = address;

    productDetails.value = order_details.map((item: any) => {
      return {
        ...item.product,
        quantity: item.quantity,
      };
    });
  }
};

fetchOrderDetails();
</script>

<style lang="scss" scoped>
.modal-cover-body {
  @apply h-4/5 py-7;

  .title-row {
    @apply font-medium text-neutral-700 text-[15px];
  }

  .display-block {
    @apply bg-grey-100/60 rounded-lg p-4 mb-10;

    .item-row {
      @apply flex justify-between items-center gap-x-2 pb-2 mb-3 text-[13.5px] border-b border-b-grey-200/75 last-of-type:border-b-0 last-of-type:mb-0 last-of-type:pb-0.5;

      &--left {
        @apply text-left text-grey-600;
      }

      &--right {
        @apply text-right text-grey-700 font-medium;
      }
    }
  }
}
</style>
