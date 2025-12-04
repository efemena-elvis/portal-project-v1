<template>
  <PageContentWrapper
    :pagingData="tablePaging"
    pageDescription="All Customers"
   @updatePage="(currentPage) => (page = currentPage)"
  >
    <template #pageOptions v-if="!isLoading">
      <div
        class="relative w-48 text-sm font-semibold text-teal-800 border rounded-md cursor-pointer sm:w-1/2 bg-grey-50/80"
      >
        <select
          v-model="selectedStatus"
          class="w-full p-4 bg-transparent appearance-none focus:outline-none"
        >
          <option value="">Status</option>
          <option
            v-for="(status, index) in statusOptions"
            :value="status.value.toLowerCase()"
            :key="index"
          >
            {{ status.key }}
          </option>
        </select>
        <div
          class="absolute text-[16px] text-teal-800 -translate-y-1/2 pointer-events-none icon icon-caret-down right-4 top-1/2"
        ></div>
      </div>

      <DatePicker
        filterSize="lg"
        :activePeriod="activePeriod"
        @onFilterSelected="processFilterSelection"
      />
    </template>

    <template v-slot:pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No customers yet',
          description:
            'We haven\'t collected payment from any customer on this account yet. This is where you\'ll be able to see all customers you\'ve collected payment from.',
        }"
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
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h, watch } from "vue";
import { TableHeaderType } from "@packages/models";
import { usePaymentStore } from "../store";
import { useDate, useString, useEvents } from "@packages/hooks";
import { DatePicker } from "@packages/uikit";

import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
  TableDoubleColumn,
} from "@packages/uikit";

const { formatNumber, getStatus, notAvailable } = useString();
const { getCustomers } = usePaymentStore();
const { processAPIRequest } = useEvents();

const isLoading = ref(true);
const selectedStatus = ref("");
const activePeriod = ref<[Date, Date] | null>(null);
const tableHeader = ref<TableHeaderType[]>([
  { title: "Added On", slug: "date_created" },
  { title: "Full Name", slug: "full_name" },
  { title: "Customer Email", slug: "customer_email" },
  { title: "Phone Number", slug: "phone_number" },
  { title: "Status", slug: "status" },
]);
const statusOptions = [{key:"Active", value:"false"}, {key:"Blacklisted", value:"true"}];

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});
const page = ref<number>(1);

const filters = computed(
  () =>
    `?page=${page.value}&blacklisted=${selectedStatus.value}&from=${activePeriod.value ? activePeriod.value[0].toISOString().split("T")[0] : ""}&to=${activePeriod.value ? activePeriod.value[1].toISOString().split("T")[0] : ""}`
);

const getDateAdded = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const processFilterSelection = (
  selectedRange: [Date | string, Date | string]
) => {
  if (selectedRange && selectedRange.length === 2) {
    const normalizedRange: [Date, Date] = [
      new Date(selectedRange[0]),
      new Date(selectedRange[1]),
    ];
    activePeriod.value = normalizedRange;
  } else {
    activePeriod.value = null;
  }
};

const fetchCustomers = async (filters: string) => {
  isLoading.value = true;
  tablePaging.value.current_page = page;
  const response = await processAPIRequest({
    action: getCustomers,
    payload: { filters, page: page.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.value = response.data.map((data: any) => {
      const customerName = data.customer
        ? `${data.customer.firstname} ${data.customer.lastname}`
        : "No customer info";
      const customerEmail = data.customer ? data.customer.email : "";
      const createdDate = new Date(Date.parse(data.created_at));

      return {
        date_created: h(TableDoubleColumn, {
          entry: {
            primaryText: getDateAdded(data.created_at),
            secondaryText: useDate.formatTime(data.created_at),
          },
        }),
        full_name: `${data.firstname} ${data.lastname}`,
        customer_email: data.email,
        phone_number: data.phone_number
          ? "+" + data.phone_number
          : notAvailable("No phone number"),
        status: getStatus(
          data.blacklisted ? "danger" : "success",
          data.blacklisted ? "Blacklisted" : "Active"
        ),
        raw: {
          customer_details: `${customerName} (${customerEmail})`,
          raw_date: createdDate,
          raw_status: data.blacklisted ? "blacklisted" : "active",
        },
      };
    });

    tablePaging.value = response.pagination[0];
  }
};

watch(activePeriod, () => {
  page.value = 1;
});

watch(filters, (newFilters) => {
  fetchCustomers(newFilters);
});

onMounted(fetchCustomers);
</script>
