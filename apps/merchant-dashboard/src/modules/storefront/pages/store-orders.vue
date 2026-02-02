<template>
  <div class="pb-10 strorefront-order-page">
    <!-- TOP AREA -->
    <div class="top-area">
      <div class="top-area--left">
        <div class="form-input-block">
          <div class="icon icon-search-normal"></div>

          <input
            type="search"
            class="form-control form-input"
            placeholder="Search orders..."
          />
        </div>
      </div>
    </div>

    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No orders yet',
        description:
          'You haven\'t received any orders on this storefront yet. This is where you\'ll be able to manage all pending orders',
      }"
    >
      <TableContainerBody
        v-for="(payload, index) in tableBody"
        :key="index"
        :tableHeader="tableHeader"
        :tableData="payload"
      />
    </TableContainer>
  </div>

  <teleport to="body" v-if="showViewProductDetailsModal">
    <ViewProductDetailsModal
      :orderId="productOrderDetails.id"
      @closeTriggered="toggleViewProductDetailsModal"
    />
  </teleport>

  <teleport to="body" v-if="showUpdateOrdersModal">
    <UpdateOrdersModal
      :orderDetails="productOrderDetails"
      @closeTriggered="toggleUpdateOrdersModal"
      @reloadStoreOrders="fetchAllStoreOrders"
    />
  </teleport>
</template>

<script lang="ts" setup>
import { h, ref, reactive, computed } from "vue";
import { useRoute} from "vue-router";
import { TableHeaderType } from "@packages/models";
import { useStorefrontStore } from "@/modules/storefront/store";
import {useEvents, useDate,  useString, useAppVariant} from "@packages/hooks";
import UpdateOrdersModal from "@/modules/storefront/modals/update-orders-modal.vue";
import ViewProductDetailsModal from "@/modules/storefront/modals/view-product-details-modal.vue";
import {TableDoubleColumn, TableActionBtn,TableContainerBody, TableContainer} from "@packages/uikit"


const { getBoldTableText, getStatus, formatNumber } = useString();

const route = useRoute();;

const { getStoreOrders } = useStorefrontStore();
const { processAPIRequest } = useEvents();
const appVariant = ref<string>(useAppVariant());

const isLoading = ref<boolean>(true);


const getDateOrdered = (date: string) => {
  let { w2, m4, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m4}, ${y1}`;
};

const tableHeader = ref<TableHeaderType[]>([
  { title: "S/N", slug: "counter" },
  { title: "Order Date", slug: "date_created" },
  { title: "Customer Details", slug: "customer" },
  { title: "Order Details", slug: "order" },
  { title: "Payment", slug: "payment_status" },
  { title: "Order Status", slug: "order_status" },
  { title: "", slug: "action" },
]);

const tableBody = reactive<any[]>([]);
const tablePaging = ref<any>({});

const productOrderDetails = ref<any>({});

const showUpdateOrdersModal = ref(false);
const showViewProductDetailsModal = ref(false);

const currency = computed(() => {
  return appVariant.value === "alexpay" ? "GHS" : "ZMW";
});

const toggleUpdateOrdersModal = () => {
  showUpdateOrdersModal.value = !showUpdateOrdersModal.value;
};

const toggleViewProductDetailsModal = () => {
  showViewProductDetailsModal.value = !showViewProductDetailsModal.value;
};

const renderStatusColor = (status: string) => {
  const pending = [
    "pending",
    "preparing order",
    "ready for pickup",
    "awaiting pickup by carrier",
    "out for delivery",
  ];

  if (pending.includes(status.toLowerCase())) return "pending";
  else if (status.toLowerCase() === "delivered") return "success";
  else return "failed";
};

const renderOrderQuantity = (order: any) => {
  const quantity = order.order_details.reduce(
    (acc: any, item: any) => acc + item.quantity,
    0
  );
  return `Total Quantity: ${quantity < 1 ? 1 : quantity}`;
};

const fetchAllStoreOrders = async () => {
  const response = await processAPIRequest({
    action: getStoreOrders,
    payload: { storefrontId: route.params.storeId },
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.length = 0;

    tableBody.push(
      ...response.data.orders.map((data: any, index: number) => ({
        counter: `${index + 1}`,
        date_created: getDateOrdered(data.created_at),
        customer: h(TableDoubleColumn, {
          entry: {
            primaryText: `${data.customer_details.firstname} ${data.customer_details.lastname}`,
            secondaryText: data.customer_details.email,
          },
        }),
        order: h(TableDoubleColumn, {
          entry: {
            primaryText: getBoldTableText(`${currency.value}${formatNumber(data.amount)}`),
            secondaryText: renderOrderQuantity(data),
          },
        }),
        payment_status: h(TableDoubleColumn, {
          entry: {
            primaryText: `<span class='text-green-600'>Paid</span>`,
            secondaryText: `Order no: ${data.order_number || "N/A"}`,
          },
        }),
        order_status: `${getStatus(renderStatusColor(data.status), data.status)}`,
        action: h(TableActionBtn, {
          showPrimaryBtn: true,
          showSecondaryBtn: true,
          primaryBtnText: "Manage",
          showSecondaryText: true,
          secondaryBtnIcon: "",
          secondaryBtnText: "View",
          isSecondaryActionDelete: false,
          onManageClick: () => {
            productOrderDetails.value = data;
            toggleUpdateOrdersModal();
          },
          onDeleteClick: () => {
            productOrderDetails.value = data;
            toggleViewProductDetailsModal();
          },
        }),
      }))
    );

    tablePaging.value = response.pagination[0];
  }
};

fetchAllStoreOrders();
</script>

<style lang="scss" scoped>
.strorefront-order-page {
  .top-area {
    @apply flex justify-between items-center gap-x-3 mb-11;

    &--left {
      @apply flex flex-col justify-center items-start gap-y-0.5 w-[30%];

      .section-title {
        @apply font-semibold text-base sm:text-[15.5px] text-grey-700;
      }

      .section-description {
        @apply text-grey-600/85 text-[12.5px];
      }
    }

    &--right {
      @apply flex justify-end items-center gap-x-3 sm:hidden;
    }
  }

  .form-input-block {
    @apply relative w-full;

    .form-input {
      @apply w-full text-grey-600 text-[13.5px] placeholder:text-[13.5px] py-[12.5px] pl-10 pr-4 border-grey-300 hover:border-green-400/80 focus:border-green-400;
    }

    .icon {
      @apply z-10 text-[15px] absolute top-1/2 left-4 transform -translate-y-1/2 text-grey-600;
    }
  }

  .button-actions {
    @apply w-full;

    .btn {
      @apply w-max h-[46px] py-3 sm:py-3 px-7 text-grey-800/80 border text-[13px];
    }

    .btn-primary {
      @apply text-neutral-10;
    }
  }
}
</style>
