<template>
  <PageContentWrapper
   
  >
    <template #pageOptions>
    <div class="flex items-center gap-4 mb-4" v-if="tableBody.length > 0 && !isLoading">
      <div class="relative w-52">
        <select
          v-model="selectedMethod"
          class="w-full p-4 text-sm font-semibold text-teal-800 border rounded-md appearance-none cursor-pointer focus:outline-none"
        >
          <option value="">Payment Method</option>
          <option v-for="(method, index) in paymentMethods" :value="method" :key="index">
            {{ method }}
          </option>
        </select>
        <div
          class="absolute text-[16px] text-teal-800 -translate-y-1/2 pointer-events-none icon icon-caret-down right-4 top-1/2"
        ></div>
      </div>

      <div class="relative w-36">
        <select
          v-model="selectedStatus"
          class="w-full p-4 text-sm font-semibold text-teal-800 border rounded-md appearance-none cursor-pointer focus:outline-none"
        >
          <option value="">Status</option>
          <option v-for="(status, index) in statusOptions" :value="status.toLowerCase()" :key="index">
            {{ status }}
          </option>
        </select>
        <div
          class="absolute text-[16px] text-teal-800 -translate-y-1/2 pointer-events-none icon icon-caret-down right-4 top-1/2"
        ></div>
      </div>
    </div>
</template>
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="filteredTableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No transaction yet',
        description: 'We haven\'t received any payment on this account yet. This is where you\'ll be able to see all your collected transactions',
      }"
    >
      <TableContainerBody
        v-for="(payload, index) in filteredTableBody"
        :key="index"
        :tableHeader="tableHeader"
        :tableData="payload"
      />
    </TableContainer>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import * as XLSX from "xlsx";
import { ref, h, computed, onMounted } from "vue";
import { TableHeaderType } from "@packages/models";
import { useDate, useString, useEvents } from "@packages/hooks";
import { usePaymentStore } from "@/modules/payments/store";
import { DatePicker } from "@packages/uikit";
import {
  TableContainer,
  TableContainerBody,
  TableDoubleColumn,
  PageContentWrapper,
} from "@packages/uikit";

const { formatNumber, getStatus, capitalizeFirstLetter } = useString();
const { processAPIRequest } = useEvents();
const { getTransactions } = usePaymentStore();

const isLoading = ref(true);
const selectedMethod = ref("");
const selectedStatus = ref("");
const activePeriod = ref<[Date, Date] | null>(null);

const statusOptions = ["Successful", "Pending", "Failed"];
const paymentMethods = ["Card", "Mobilemoney"];

const tableHeader = ref<TableHeaderType[]>([
  { title: "Transaction Date", slug: "date_created" },
  { title: "Customer Details", slug: "customer_details" },
  { title: "Amount", slug: "amount" },
  { title: "Payment Method", slug: "payment_details" },
  { title: "Status", slug: "status" },
  { title: "Transaction Reference", slug: "reference" },
]);

const tableBody = ref<any[]>([]);
const tableBodyRaw = ref<any[]>([]);

const getTransactionDate = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
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

const fetchPaymentTransactions = async () => {
  const response = await processAPIRequest({
    action: getTransactions,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code === 200) {
    tableBody.value = response.data.map((data: any) => {
      const formattedAmount = `${formatNumber(data.amount)}`;
      const chargeAmount = `Charge: ${data.currency} ${formatNumber(data.charge)}`;
      const customerName = data.customer
        ? `${data.customer.firstname} ${data.customer.lastname}`
        : "No customer info";
      const customerEmail = data.customer ? data.customer.email : "";
      const createdDate = new Date(data.created_at);

      return {
        date_created: getTransactionDate(data.created_at),
        customer_details: h(TableDoubleColumn, {
          entry: { primaryText: customerName, secondaryText: customerEmail },
        }),
        amount: h(TableDoubleColumn, {
          entry: { primaryText: formattedAmount, secondaryText: chargeAmount },
        }),
        payment_details: capitalizeFirstLetter(data.method),
        status: getStatus(data.status, data.status),
        reference: data.reference,
        raw: {
          date_created: getTransactionDate(data.created_at),
          raw_date: createdDate,
          customer_details: `${customerName} (${customerEmail})`,
          amount: `${formattedAmount}`,
          payment_details: capitalizeFirstLetter(data.method),
          status: data.status,
          reference: data.reference,
        },
      };
    });
    tableBodyRaw.value = tableBody.value.map((tx) => tx.raw);
  }
};

const filteredTableBody = computed(() => {
  return tableBody.value.filter((tx) => {
    const method = tx.raw?.payment_details?.toLowerCase();
    const status = tx.raw?.status?.toLowerCase();
    const rawDate = tx.raw?.raw_date ? new Date(tx.raw.raw_date) : null;

    const matchesMethod = selectedMethod.value
      ? method === selectedMethod.value.toLowerCase()
      : true;

    const matchesStatus = selectedStatus.value
      ? status === selectedStatus.value
      : true;

    const matchesDate = rawDate
      ? isWithinRange(rawDate, activePeriod.value)
      : true;

    return matchesMethod && matchesStatus && matchesDate;
  });
});

const exportToExcel = () => {
  const dataToExport = filteredTableBody.value.map((tx) => tx.raw);
  const cleanData = dataToExport.map((tx) => ({
    "Date Created": tx.date_created,
    "Customer Details": tx.customer_details || "-",
    Amount: tx.amount || "-",
    "Payment Method": tx.payment_details,
    Status: tx.status,
    Reference: tx.reference,
  }));
  const worksheet = XLSX.utils.json_to_sheet(cleanData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Merchant Transactions");
  XLSX.writeFile(workbook, "Merchant_Transactions.xlsx");
};

onMounted(fetchPaymentTransactions);
</script>

<style lang="scss" scoped>
.export-btn {
  @apply transition-colors duration-200;
  @media (max-width: 640px) {
    @apply w-1/2;
  }
}

.filter-select {
  @media (max-width: 640px) {
    @apply w-full;
  }
}
</style>
