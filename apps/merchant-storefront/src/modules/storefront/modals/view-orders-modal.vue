<template>
  <ModalDialog place_side @closeModal="$emit('closeTriggered')">
    <!-- MODAL COVER HEADER -->
    <template #modal-cover-header>
      <div class="modal-cover-header">
        <div class="modal-cover-title">Order Details</div>
      </div>
    </template>

    <template #modal-cover-body>
      <div class="modal-cover-body mt-3">
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
import { ref, computed, PropType } from "vue";
import { useRoute } from "vue-router";
import { useEvents } from "@packages/hooks";
import { ModalDialog } from "@packages/uikit";
import ProductOrderItem from "@/modules/storefront/components/product-order-item.vue";
import { useStoreStore } from "../store";

const emits = defineEmits(["closeTriggered"]);

const props = defineProps({
  productOrderDetails: {
    type: Object,
    default: () => ({}),
  },
});

const route = useRoute();
const { processAPIRequest } = useEvents();

const { viewOrderDetails } = useStoreStore();

const customerDetails = ref({
  fullname: "Efemena Elvis",
  email: "efemena.elvis@gmail.com",
  phone: "+2608109922210",
  address: "House 24b South-west avenue.",
});

const productDetails = ref([
  {
    id: 1,
    name: "White Sneakers",
    category: "Footwear",
    image:
      "https://pictures-nigeria.jijistatic.net/156572924_NjIwLTY5NC03YzA0OGY4ODAw.webp",
    amount: 300,
    quantity: 2,
  },
  {
    id: 2,
    name: "Black Sneakers",
    category: "Footwear",
    image: "https://tellme.ng/wp-content/uploads/2024/05/BLACK-22-1.jpeg.webp",
    amount: 200,
    quantity: 1,
  },
  {
    id: 3,
    name: "Blue Sneakers",
    category: "Footwear",
    image:
      "https://media.istockphoto.com/id/1249496770/photo/running-shoes.jpg?s=612x612&w=0&k=20&c=b4MahNlk4LH6H1ksJApfnlQ5ZPM3KGhI5i_yqhGD9c4=",
    amount: 150,
    quantity: 1,
  },
]);

const fetchOrderDetails = async () => {
    const response = await processAPIRequest({
      action: viewOrderDetails,
      payload: { id: props.productOrderDetails.id },
      showAlert: false,
    });
 
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
  @apply h-[90%] py-7;

  .title-row {
    @apply font-semibold text-grey-800 text-[15px];
  }

  .display-block {
    @apply bg-grey-100/30 border border-grey-200/55 rounded-[10px] p-4 mb-10;

    .item-row {
      @apply flex justify-between items-center gap-x-2 pb-3 pt-2 mb-3 text-[13.5px] border-b border-b-grey-200/75 last-of-type:border-b-0 last-of-type:mb-0 last-of-type:pb-1;

      &--left {
        @apply text-left text-grey-600;
      }

      &--right {
        @apply text-right text-grey-800 font-semibold;
      }
    }
  }
}
</style>
