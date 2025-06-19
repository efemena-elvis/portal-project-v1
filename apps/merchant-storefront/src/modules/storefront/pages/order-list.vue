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
            { titleText: 'Order Value', valueText: 'ZMW 750.00' },
            { titleText: 'Total Orders', valueText: '200' },
            { titleText: 'Completed Orders', valueText: '180' },
            { titleText: 'Pending Orders', valueText: '20' },
          ]"
        />
      </div>

      <div class="mb-3 flex justify-between items-center gap-x-4">
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
          actionText: 'Add a product',
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
      :orderDetails="{}"
      @closeTriggered="toggleManageOrdersModal"
    />
  </teleport>

  <teleport to="body" v-if="showViewOrdersModal">
    <ViewOrdersModal
      :orderDetails="{}"
      @closeTriggered="toggleViewOrdersModal"
    />
  </teleport>
</template>

<script setup lang="ts">
import { ref, h, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { TableHeaderType } from "@packages/models";
import { useStoreStore } from "../store";
import { useDate, useString, useEvents } from "@packages/hooks";
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

const router = useRouter();

const { formatNumber, getStatus, getBoldTableText, notAvailable } = useString();
const { getStoreProducts } = useStoreStore();
const { processAPIRequest } = useEvents();

const renderOrderQuantity = (order: any) => {
  const quantity = order.order_details.reduce(
    (acc: any, item: any) => acc + item.quantity,
    0
  );
  return `Total Quantity: ${quantity < 1 ? 1 : quantity}`;
};

const isLoading = ref(false);

const tableHeader = ref<TableHeaderType[]>([
  { title: "#", slug: "counter" },
  { title: "Order Date", slug: "date_created" },
  { title: "Customer Details", slug: "customer" },
  { title: "Order Details", slug: "order" },
  { title: "Payment", slug: "payment_status" },
  { title: "Order Status", slug: "order_status" },
  { title: "Action", slug: "action" },
]);

const tableBody = reactive<any[]>([
  {
    counter: "1",
    date_created: "22nd July, 2024",
    customer: h(TableDoubleColumn, {
      entry: {
        primaryText: `Efemena Elvis`,
        secondaryText: `efemena.elvis@example.com`,
      },
    }),
    order: h(TableDoubleColumn, {
      entry: {
        primaryText: getBoldTableText(`ZMW ${formatNumber(750)}`),
        secondaryText: renderOrderQuantity({
          order_details: [
            { quantity: 2, product_name: "White Sneakers" },
            { quantity: 1, product_name: "Black Sneakers" },
          ],
        }),
      },
    }),
    payment_status: h(TableDoubleColumn, {
      entry: {
        primaryText: `<span class='text-green-600'>Paid</span>`,
        secondaryText: `Order no: ${"N/A"}`,
      },
    }),
    order_status: `${getStatus("success", "Completed")}`,
    action: h(TableActionBtn, {
      showPrimaryBtn: true,
      showSecondaryBtn: true,
      primaryBtnText: "Manage",
      showSecondaryText: true,
      secondaryBtnIcon: "",
      secondaryBtnText: "View",
      isSecondaryActionDelete: false,
      onManageClick: () => {
        // productOrderDetails.value = data;
        toggleManageOrdersModal();
      },
      onDeleteClick: () => {
        // productOrderDetails.value = data;
        toggleViewOrdersModal();
      },
    }),
  },
]);
const tablePaging = ref<any>({});

const getDateAdded = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const showManageOrdersModal = ref<boolean>(false);
const showViewOrdersModal = ref<boolean>(false);

const toggleManageOrdersModal = () => {
  showManageOrdersModal.value = !showManageOrdersModal.value;
};

const toggleViewOrdersModal = () => {
  showViewOrdersModal.value = !showViewOrdersModal.value;
};

const fetchProducts = async () => {
  const response = await processAPIRequest({
    action: getStoreProducts,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    response.data.map((data: any) => {
      tableBody.push({
        date_created: getDateAdded(data.created_at),
        full_name: `${data.firstname} ${data.lastname}`,
        customer_email: data.email,
        phone_number: data.phone_number
          ? "+" + data.phone_number
          : notAvailable("No phone number"),
        status: getStatus(
          data.blacklisted ? "danger" : "success",
          data.blacklisted ? "Blacklisted" : "Active"
        ),
      });
    });

    tablePaging.value = response.pagination[0];
  }
};

const handleEditProduct = (data: any) => {
  // Logic to edit product
  console.log("Edit Product:", data);
};

const handleDeleteProduct = (data: any) => {
  // Logic to delete product
  console.log("Delete Product:", data);
};

// onMounted(() => fetchProducts = async () => {());
</script>
