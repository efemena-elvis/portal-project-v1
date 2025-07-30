<template>
  <PageContentWrapper>
    <!-- <template v-slot:pageOptions>
      <button class="btn btn-xs btn-primary !pl-4">
        <div class="icon icon-add"></div>
        Add Customer
      </button>
    </template> -->

    <template v-slot:pageContent>
      <!-- CARD INFO ROW -->
      <div class="mt-4 mb-8">
        <MetricInfoCard
          :metric-items="[
            {
              titleText: 'Total Customers',
              valueText: customersSummary?.total,
            },
            {
              titleText: 'Active Customers',
              valueText: customersSummary?.active_customers,
            },
            {
              titleText: 'Blacklisted Customers',
              valueText: customersSummary?.blacklisted_customers,
            },
          ]"
        />
      </div>

      <div class="flex items-center justify-between mb-3 gap-x-4">
        <!-- STATUS FILTER CARD -->
        <StatusFilterCard
          :status-items="[
            { title: 'All Customers', slug: 'all-orders', active: false },
            {
              title: 'Blacklisted Customers',
              slug: 'blacklisted-customers',
              active: false,
            },
          ]"
        />

        <DateFilterCard />
      </div>

      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'Add a new customer',
          description:
            'We haven\'t collected payment from any customer on this account yet. Add a customer to get started',
          actionText: 'Add a Product',
        }"
        @onActionClicked="
          () => router.push('/products/create?redirect=customers')
        "
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

  <teleport to="body" v-if="showManageCustomerModal">
    <ManageCustomerModal @closeTriggered="toggleManageCustomerModal" />
  </teleport>
</template>

<script setup lang="ts">
import { ref, h, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { TableHeaderType } from "@packages/models";
import { useStoreStore } from "../store";
import { useDate, useString, useEvents } from "@packages/hooks";
import ManageCustomerModal from "@/modules/storefront/modals/manage-customer-modal.vue";

import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
  TableActionBtn,
  MetricInfoCard,
  StatusFilterCard,
  DateFilterCard,
} from "@packages/uikit";

type Store = { id: string; [key: string]: any };
type CustomersSummary = { total_orders?: number; [key: string]: any };

const router = useRouter();

const { formatNumber, getStatus, notAvailable, capitalizeFirstLetter } = useString();

const { activeStore, getStoreCustomers } = useStoreStore() as {
  activeStore: Store | null;
  getStoreCustomers: any;
};
const { processAPIRequest } = useEvents();

const isLoading = ref(false);
const customersSummary = ref<CustomersSummary>({});

const tableHeader = ref<TableHeaderType[]>([
  { title: "Created On", slug: "date_created" },
  { title: "Full Name", slug: "full_name" },
  { title: "Customer Email", slug: "customer_email" },
  { title: "Phone Number", slug: "phone_number" },
  { title: "Status", slug: "status" },
  { title: "Action", slug: "action" },
]);
const tableBody = ref<any[]>([]);
// const tableBody = reactive<any[]>([
//   {
//     date_created: "22nd July, 2024",
//     customer_email: "elvis@vesicash.com",
//     full_name: "Efemena Elvis",
//     phone_number: "+234 813 117 7703",
//     status: getStatus("success", "Whitelisted"),
//     action: h(TableActionBtn, {
//       showPrimaryBtn: true,
//       showSecondaryBtn: false,
//       primaryBtnText: "Manage",
//       onManageClick: () => {
//         // handleManageCustomer(data);
//         toggleManageCustomerModal();
//       },
//     }),
//   },
// ]);
const tablePaging = ref<any>({});

const getDateAdded = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const showManageCustomerModal = ref<boolean>(false);

const toggleManageCustomerModal = () => {
  showManageCustomerModal.value = !showManageCustomerModal.value;
};

const fetchStoreCustomers = async () => {
  const response = await processAPIRequest({
    action: getStoreCustomers,
    payload: { store_id: activeStore?.id || "" },
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
tableBody.value = response?.data.customers.map((data: any) => {
  return {
    date_created: getDateAdded(data.created_at),
    full_name: `${data.firstname} ${data.lastname}`,
    customer_email: data.email,
    phone_number: data.phone_number
      ? "+" + data.phone_number
      : notAvailable("No phone number"),
    status: getStatus(
       data.status === "active" ? "success" : "blacklisted", capitalizeFirstLetter(data.status)
    ),
    action: h(TableActionBtn, {
      showPrimaryBtn: true,
      showSecondaryBtn: false,
      primaryBtnText: "Manage",
      onManageClick: () => {
        toggleManageCustomerModal();
      },
    }),
  };
});


    customersSummary.value = response?.data;
    tablePaging.value = response.pagination[0];
  }
};

const handleManageCustomer = (data: any) => {
  // Logic to manage customer
  console.log("Manage Customer:", data);
};

const handleBlacklistCustomer = (data: any) => {
  // Logic to blacklist customer
  console.log("Blacklist Customer:", data);
};

watch(
  () => activeStore?.id,
  (id) => {
    if (id) {
      fetchStoreCustomers();
    }
  },
  { immediate: true }
);
</script>
