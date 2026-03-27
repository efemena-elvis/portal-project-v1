<template>
  <PageContentWrapper>
    <!-- <template v-slot:pageOptions>
      <button class="btn btn-xs btn-primary !pl-4">
        <div class="icon icon-add"></div>
        Create Order
      </button>
    </template> -->

    <template v-slot:pageContent>
      <!-- CARD INFO ROW -->
      <div class="mt-4 mb-8">
        <MetricInfoCard
          :metric-items="[
            {
              titleText: 'Order Value',
              valueText: `ZMW ${ordersSummary?.total_amount}`,
            },
            {
              titleText: 'Total Orders',
              valueText: ordersSummary?.total_orders,
            },

            {
              titleText: 'Completed Orders',
              valueText: ordersSummary?.completed_orders,
            },
            {
              titleText: 'Pending Orders',
              valueText: ordersSummary?.pending_orders,
            },
          ]"
        />
      </div>

      <div class="flex items-center justify-between mb-3 gap-x-4">
        <!-- STATUS FILTER CARD -->
        <StatusFilterCard
          :status-items="[
            { title: 'All Orders', slug: 'all-orders', active: false },
            {
              title: 'Completed Orders',
              slug: 'completed-orders',
              active: false,
            },
            { title: 'Pending Orders', slug: 'pending-orders', active: false },
          ]"
        />

        <DateFilterCard />
      </div>

      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No Orders yet',
          description:
            'You haven\'t received any orders on this store yet. Add a product to get started',
        }"
        @onActionClicked="() => router.push('/products/create?redirect=orders')"
      >
        <TableContainerBody
          v-for="(payload, index) in tableBody"
          :key="index"
          :tableHeader="tableHeader"
          :tableData="payload"
        />
      </TableContainer>
    </template>
  </PageContentWrapper>

  <teleport to="body" v-if="showManageOrdersModal">
    <ManageOrdersModal
      :productOrderDetails="productOrderDetails"
      @closeTriggered="toggleManageOrdersModal"
      @reloadStoreOrders="fetchStoreOrders"
    />
  </teleport>

  <teleport to="body" v-if="showViewOrdersModal">
    <ViewOrdersModal
      :orderDetails="{}"
      @closeTriggered="toggleViewOrdersModal"
      :productOrderDetails="productOrderDetails"
    />
  </teleport>
</template>

<script setup lang="ts">
import { ref, h, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { TableHeaderType } from "@packages/models";
import { useStoreStore } from "../store";
import { useDate, useString, useEvents, useStorage } from "@packages/hooks";
import ManageOrdersModal from "@/modules/storefront/modals/manage-orders-modal.vue";
import ViewOrdersModal from "@/modules/storefront/modals/view-orders-modal.vue";

import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
  TableActionBtn,
  TableDoubleColumn,
  MetricInfoCard,
  StatusFilterCard,
  DateFilterCard,
} from "@packages/uikit";

type Store = { id: string; [key: string]: any };
type OrdersSummary = { total_orders?: number; [key: string]: any };
const router = useRouter();
const route = useRoute();
const { getStorage } = useStorage();

const { formatNumber, getStatus, getBoldTableText, notAvailable } = useString();

const { getStoreOrders } = useStoreStore() as {
  getStoreOrders: any;
};

const activeStore = ref<any>(
  getStorage({
    storage_name: "activeStore",
    storage_type: "object",
  }),
);

const { processAPIRequest } = useEvents();

const ordersSummary = ref<OrdersSummary>({});

const tableHeader = ref<TableHeaderType[]>([
  { title: "#", slug: "counter" },
  { title: "Order Date", slug: "date_created" },
  { title: "Customer Details", slug: "customer" },
  { title: "Order Details", slug: "order" },
  { title: "Payment", slug: "payment_method" },
  { title: "Order Status", slug: "order_status" },
  { title: "Action", slug: "action" },
]);

const tableBody = ref<any[]>([]);

const tablePaging = ref<any>({});
const productOrderDetails = ref<any>({});
const isLoading = ref<boolean>(false);

const showManageOrdersModal = ref<boolean>(false);
const showViewOrdersModal = ref<boolean>(false);

const getDateAdded = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const renderOrderQuantity = (order: any) => {
  const quantity = order.order_details.reduce(
    (acc: any, item: any) => acc + item.quantity,
    0,
  );
  return `Total Quantity: ${quantity < 1 ? 1 : quantity}`;
};
const toggleManageOrdersModal = () => {
  showManageOrdersModal.value = !showManageOrdersModal.value;
};

const toggleViewOrdersModal = () => {
  showViewOrdersModal.value = !showViewOrdersModal.value;
};

const fetchStoreOrders = async () => {
  isLoading.value = true;
  const response = await processAPIRequest({
    action: getStoreOrders,
    payload: { store_id: activeStore.value?.id },
    showAlert: false,
  });

  if (response.code === 200) {
    let allOrders = response?.data.orders;

    const filter = route.query.filter;

    if (filter === "completed-orders") {
      allOrders = allOrders.filter(
        (order: any) => order.status?.toLowerCase() === "completed",
      );
    } else if (filter === "pending-orders") {
      allOrders = allOrders.filter(
        (order: any) => order.status?.toLowerCase() === "pending",
      );
    }

    tableBody.value = allOrders.map((data: any) => ({
      date_created: getDateAdded(data.created_at),
      customer: h(TableDoubleColumn, {
        entry: {
          primaryText: `${data.customer_details.firstname} ${data.customer_details.lastname}`,
          secondaryText: `${data.customer_details.email}`,
        },
      }),
      order: h(TableDoubleColumn, {
        entry: {
          primaryText: getBoldTableText(
            `${data.currency} ${formatNumber(data.amount)}`,
          ),
          secondaryText: renderOrderQuantity({
            order_details: data.order_details.map((item: any) => ({
              quantity: item.quantity,
            })),
          }),
        },
      }),
      phone_number: data.phone_number
        ? "+" + data.phone_number
        : notAvailable("No phone number"),
      payment_method: data.payment_method,
      order_status: getStatus(
        data.status.toLowerCase() === "completed"
          ? "success"
          : data.status.toLowerCase() === "pending"
            ? "pending"
            : "failed",
        data.status,
      ),
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
          toggleManageOrdersModal();
        },
        onDeleteClick: () => {
          productOrderDetails.value = data;
          toggleViewOrdersModal();
        },
      }),
    }));

    isLoading.value = false;

    ordersSummary.value = response?.data || {};

    tablePaging.value = response?.pagination?.[0] || {};
  }
};

watch(
  () => activeStore.value?.id,
  (id) => {
    if (id) {
      fetchStoreOrders();
    }
  },
  { immediate: true },
);

watch(
  () => route.query.filter,
  () => {
    fetchStoreOrders();
  },

  { immediate: true },
);
</script>
