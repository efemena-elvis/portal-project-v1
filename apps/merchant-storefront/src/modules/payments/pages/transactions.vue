<template>
  <PageContentWrapper :pagingData="tablePaging" pageDescription = "All Transactions">
    <template #pageOptions>
      <div class="button-row">
        <div class="flex items-center gap-3 mr-12">
          <select
            v-model="selectedMethod"
            class="p-3 text-sm border rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-grey-50/80"
          >
            <option value="">Payment Method</option>
            <option
              v-for="(method, index) in paymentMethods"
              :value="method"
              :key="index"
            >
              {{ method }}
            </option>
          </select>

          <select
            v-model="selectedStatus"
            class="p-3 text-sm border rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-grey-50/80"
          >
            <option value="">Status</option>
            <option
              v-for="(status, index) in statusOptions"
              :value="status"
              :key="index"
            >
              {{ status }}
            </option>
          </select>

          <div
            class="flex items-center px-3 py-2 text-sm border rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-grey-50/80"
          >
            <input
              type="date"
              v-model="selectedDate"
              class="outline-none bg-grey-50/80"
            />
            <div class="icon icon-calendar text-[14px]"></div>
          </div>
        </div>

        <button @click="exportToExcel" class="btn btn-secondary">Export</button>
      </div>
    </template>

    <template v-slot:pageContent>
      <!-- CARD INFO ROW -->
      <div class="mt-4 mb-8">
        <MetricInfoCard
          :metric-items="[
            { titleText: 'Completed Transactions', valueText: '0' },
            { titleText: 'Pending Transactions', valueText: '0' },
            { titleText: 'Failed Transactions', valueText: '0' },
          ]"
        />
      </div>

      <div class="flex items-center justify-between mb-3 gap-x-4">
        <!-- STATUS FILTER CARD -->
        <StatusFilterCard
          :status-items="[
            {
              title: 'All Transactions',
              slug: 'all-transactions',
              active: false,
            },
            {
              title: 'Completed Transactions',
              slug: 'completed-transactions',
              active: false,
            },
            {
              title: 'Pending Transactions',
              slug: 'pending-transactions',
              active: false,
            },
            {
              title: 'Failed Transactions',
              slug: 'failed-transactions',
              active: false,
            },
          ]"
        />

        <DateFilterCard />
      </div>

      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="filteredTableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No transactions yet!',
          description:
            'No transactions has been initiated on your account yet. Add a product to fix that',
        }"
        @onActionClicked="
          () => router.push('/products/create?redirect=transactions')
        "
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
import * as XLSX from "xlsx";
import { ref, h, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { TableHeaderType } from "@packages/models";
import { useDate, useString, useEvents } from "@packages/hooks";
import { usePaymentStore } from "@/modules/payments/store";

import {
  TableContainer,
  TableContainerBody,
  TableDoubleColumn,
  PageContentWrapper,
  MetricInfoCard,
  StatusFilterCard,
  DateFilterCard,
} from "@packages/uikit";

const router = useRouter();
const { formatNumber, getStatus, capitalizeFirstLetter } = useString();
const { processAPIRequest } = useEvents();
const { getTransactions } = usePaymentStore();

const isLoading = ref(true);
const tableHeader = ref<TableHeaderType[]>([
  { title: "Transaction Info", slug: "info" },
  { title: "Customer Details", slug: "customer" },
  { title: "Payment Method", slug: "payment_method" },
  { title: "Amount", slug: "amount" },
  { title: "Status", slug: "status" },
  { title: "Reference", slug: "reference" },
]);

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});
const selectedMethod = ref("");
const selectedStatus = ref("");
const selectedDate = ref("");

const statusOptions = ["Successful", "Failed"];
const paymentMethods = ["Card", "Mobilemoney"];

const getTransactionDate = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const fetchPaymentTransactions = async () => {
  const response = await processAPIRequest({
    action: getTransactions,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code === 200) {
    tableBody.value = response.data.map((data: any) => {
      const formattedAmount = `${data.currency} ${formatNumber(data.amount)}`;
      const chargeAmount = `Charge: ${data.currency} ${formatNumber(data.charge)}`;
      const customerName = data.customer
        ? `${data.customer.firstname} ${data.customer.lastname}`
        : "No customer info";
      const customerEmail = data.customer ? data.customer.email : "";

      return {
       date_created: h(TableDoubleColumn, {
          entry: {
            primaryText: getTransactionDate(data.created_at),
            secondaryText: useDate.formatTime(data.created_at),
          },
        }),
        customer_details: h(TableDoubleColumn, {
          entry: { primaryText: customerName, secondaryText: customerEmail },
        }),
        amount: h(TableDoubleColumn, {
          entry: { primaryText: formattedAmount, secondaryText: chargeAmount },
        }),
        payment_method: capitalizeFirstLetter(data.method),
        status: getStatus(data.status, data.status),
        reference: data.reference,

        raw: {
          date: `${getTransactionDate(data.created_at)} - ${useDate.formatTime(data.created_at)}`,
          method: data.method,
          status: data.status,
          customer_details: `${customerName} (${customerEmail})`,
          amount: `${formattedAmount} (${chargeAmount})`,
          reference: data.reference,
          date_display: getTransactionDate(data.created_at),
        },
      };
    });

     tableBodyRaw.value = tableBody.value.map((tx) => tx.raw);
    tablePaging.value = response.pagination[0] || {};
  }
};


const filteredTableBody = computed(() => {
  return tableBody.value.filter((tx) => {
    const matchesMethod = selectedMethod.value
      ? tx.raw.method.toLowerCase() === selectedMethod.value.toLowerCase()
      : true;

    const matchesStatus = selectedStatus.value
      ? tx.raw.status.toLowerCase() === selectedStatus.value.toLowerCase()
      : true;

    const matchesDate = selectedDate.value
      ? new Date(tx.raw.date).toDateString() ===
        new Date(selectedDate.value).toDateString()
      : true;

    return matchesMethod && matchesStatus && matchesDate;
  });
});


const exportToExcel = () => {
  const dataToExport = filteredTableBody.value.map((tx) => tx.raw);

  const cleanData = dataToExport.map((tx) => ({
    "Date Created": tx.date_display,
    "Customer Details": tx.customer_details,
    "Payment Method": capitalizeFirstLetter(tx.method),
    Amount: tx.amount,
    Status: capitalizeFirstLetter(tx.status),
    Reference: tx.reference,
  }));

  const worksheet = XLSX.utils.json_to_sheet(cleanData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
  XLSX.writeFile(workbook, "transactions.xlsx");
};

onMounted(() => {
  fetchPaymentTransactions();
});
</script>

<style lang="scss" scoped>
.button-row {
  @apply flex justify-end items-center gap-x-2;

  .btn {
    @apply py-2.5 px-5 h-10;
  }
}
</style>
