<template>
  <PageContentWrapper>
       <template #pageOptions v-if="tableBody.length > 0 && !isLoading">
      <div class="relative w-48 text-sm font-semibold text-teal-800 border rounded-md cursor-pointer sm:w-1/2 bg-grey-50/80 ">
        <select
          v-model="selectedStatus"
          class="w-full p-4 bg-transparent appearance-none focus:outline-none"
        >
          <option value="">Status</option>
          <option
            v-for="(status, index) in statusOptions"
            :value="status.toLowerCase()"
            :key="index"
          >
            {{ status }}
          </option>
        </select>
        <div
          class="absolute text-[16px] text-teal-800 -translate-y-1/2 pointer-events-none icon icon-caret-down right-4 top-1/2"
        ></div>
      </div>

          <DatePicker  
          filterSize="lg"
          :activePeriod="activePeriod"
          @onFilterSelected="processFilterSelection"/>

    </template>

    <template v-slot:pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="filteredTableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No customers yet',
          description:
            'We haven\'t collected payment from any customer on this account yet. This is where you\'ll be able to see all customers you\'ve collected payment from.',
        }"
      >
        <TableContainerBody
          v-for="(payload, index) in filteredTableBody"
          :key="index"
          :tableHeader="tableHeader"
          :tableData="payload"
        />
      </TableContainer>
    </template>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h} from "vue";
import { TableHeaderType } from "@packages/models";
import { usePaymentStore } from "../store";
import { useDate, useString, useEvents } from "@packages/hooks";
import { DatePicker } from "@packages/uikit";

import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
  TableDoubleColumn
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
const statusOptions = ["Active", "Blacklisted"];

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});

const getDateAdded = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const normalizeDate = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const isWithinRange = (date: Date, range: [Date, Date] | null): boolean => {
  if (!range || !range[0] || !range[1]) return true;

  const start = normalizeDate(new Date(range[0]));
  const end = new Date(range[1]);
  end.setHours(23, 59, 59, 999); 

  const target = new Date(date);
  return target >= start && target <= end;
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

const fetchCustomers = async () => {
  const response = await processAPIRequest({
    action: getCustomers,
    payload: {},
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

    tablePaging.value = response.pagination[0] || {};
  }
};

const filteredTableBody = computed(() => {
  return tableBody.value.filter((tx) => {
    const rawDate = tx.raw.raw_date ? new Date(tx.raw.raw_date) : null;
    const matchesStatus = selectedStatus.value
      ? tx.raw.raw_status?.toLowerCase() === selectedStatus.value.toLowerCase()
      : true;
    const matchesDate = rawDate ? isWithinRange(rawDate, activePeriod.value) : true;
    return matchesStatus && matchesDate;
  });
});


onMounted(() => {
  fetchCustomers();
});
</script>
