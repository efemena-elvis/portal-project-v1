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
            { title: 'All Customers', slug: 'all-customers', active: false },
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
          title: 'No customers yet',
          description:
            'We haven\'t collected payment from any customer on this account yet. Add a customer to get started',
        
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
    <ManageCustomerModal
      @closeTriggered="toggleManageCustomerModal"
      @reloadStoreCustomers="fetchStoreCustomers"
      :currentCustomerData="currentCustomerData"
    />
  </teleport>
</template>

<script setup lang="ts">
import { ref, h, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { TableHeaderType } from "@packages/models";
import { useStoreStore } from "../store";
import { useDate, useString, useEvents, useStorage } from "@packages/hooks";
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
const { getStorage } = useStorage();

const { formatNumber, getStatus, notAvailable, capitalizeFirstLetter } =
  useString();

const { getStoreCustomers } = useStoreStore() as {
  getStoreCustomers: any;
};

const activeStore = ref<any>(getStorage({
  storage_name: "activeStore",
  storage_type: "object",
}));

const { processAPIRequest } = useEvents();
const route = useRoute();

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

const tablePaging = ref<any>({});

const getDateAdded = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const showManageCustomerModal = ref<boolean>(false);

const currentCustomerData = ref<any>(null);

const toggleManageCustomerModal = () => {
  showManageCustomerModal.value = !showManageCustomerModal.value;
};

const fetchStoreCustomers = async () => {
  const response = await processAPIRequest({
    action: getStoreCustomers,
    payload: { store_id: activeStore.value?.id || "" },
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    const allCustomers = response.data.customers;

    let filteredCustomers = allCustomers;
    if (route.query.filter === "blacklisted-customers") {
      filteredCustomers = allCustomers.filter(
        (item: any) => item.status === "blacklisted"
      );
    }

    tableBody.value = filteredCustomers.map((data: any) => {
      return {
        date_created: getDateAdded(data.created_at),
        full_name: `${data.firstname} ${data.lastname}`,
        customer_email: data.email,
        phone_number: data.phone_number
          ? "+" + data.phone_number
          : notAvailable("No phone number"),
        status: getStatus(
          data.status.toLowerCase() === "active" ? "success" : "failed",
          capitalizeFirstLetter(data.status)
        ),
        action: h(TableActionBtn, {
          showPrimaryBtn: true,
          showSecondaryBtn: false,
          primaryBtnText: "Manage",
          onManageClick: () => {
            currentCustomerData.value = data;
            toggleManageCustomerModal();
          },
        }),
      };
    });

    customersSummary.value = response?.data;
    tablePaging.value = response.pagination[0];
  }
};

watch(
  () => activeStore.value?.id,
  (id) => {
    if (id) {
      fetchStoreCustomers();
    }
  },
  { immediate: true }
);

watch(
  () => route.query.filter,
  () => {
    if (activeStore.value?.id) {
      fetchStoreCustomers();
    }
  }
);
</script>
