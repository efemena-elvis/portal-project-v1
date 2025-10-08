<template>
  <PageContentWrapper>
    <template #pageOptions>
      <div class="button-row">
        <div class="flex items-center gap-3 mr-12">
          <select
            v-model="selectedMethod"
            class="p-3 text-sm border rounded-md cursor-pointer focus:outline-none bg-grey-50/80"
          >
            <option value=""  class="bg-white rounded-md">Payment Method</option>
            <option
             class="bg-white rounded-md"
              v-for="(method, index) in paymentMethods"
              :value="method"
              :key="index"
            >
              {{ method }}
            </option>
          </select>

          <select
            v-model="selectedStatus"
            class="p-3 text-sm border rounded-md cursor-pointer focus:outline-none bg-grey-50/80 w-[120px]"
          >
            <option value="">Status</option>
            <option
            class="bg-white rounded-md"
              v-for="(status, index) in statusOptions"
              :value="status"
              :key="index"
            >
              {{ status }}
            </option>
          </select>

          <div class="relative">
            <div
              class="flex justify-between items-center gap-x-2 p-3 border rounded-md bg-grey-50/80 cursor-pointer text-sm w-[120px]"
              @click="showDropdown = !showDropdown"
            >
              <span>{{ activePeriod }}</span>
              <span
                class="icon-calendar transition-transform duration-200"
                
              ></span>
            </div>

            <div
              v-if="showDropdown"
              class="absolute z-10 mt-1 bg-white border rounded-md shadow-md w-full"
            >
              <div
                v-for="(period, index) in periodList"
                :key="index"
                @click="processFilterSelection(period); showDropdown = false"
                class="px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50"
              >
                {{ period }}
              </div>
            </div>
          </div>
        </div>

        <button @click="exportToExcel" class="btn btn-secondary">Export</button>
      </div>
    </template>

    <template #pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="filteredTableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No transactions yet!',
          description:
            'No transactions have been initiated on your account yet.',
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
import * as XLSX from "xlsx";
import { ref, h, computed, onMounted } from "vue";
import { TableHeaderType } from "@packages/models";
import { useDate, useString, useEvents } from "@packages/hooks";
import { usePaymentStore } from "@/modules/payments/store";
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
const iod = ref("This month");
const showDropdown = ref(false);

const periodList = ref([
  "Today",
  "Last 7 days",
  "This month",
  "Last month",
  "All time",
]);

const statusOptions = ["Successful", "Failed"];
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
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const normalize = (val: string) => val?.trim().toLowerCase() || "";

const isWithinPeriod = (date: Date, period: string): boolean => {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  switch (period) {
    case "Today":
      return date >= startOfToday;
    case "Last 7 days":
      return date >= sevenDaysAgo;
    case "This month":
      return date >= startOfMonth;
    case "Last month":
      return date >= startOfLastMonth && date <= endOfLastMonth;
    case "All time":
    default:
      return true;
  }
};

const processFilterSelection = (selectedPeriod: string) => {
  activePeriod.value = selectedPeriod;
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
      const chargeAmount = `Charge: ${data.currency} ${formatNumber(
        data.charge
      )}`;
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
          amount: `${formattedAmount} (${chargeAmount})`,
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
    const method = normalize(tx.raw?.payment_details);
    const status = normalize(tx.raw?.status);
    const rawDate = tx.raw?.raw_date ? new Date(tx.raw.raw_date) : null;
    const matchesMethod = selectedMethod.value
      ? tx.raw.payment_details.toLowerCase() ===
        selectedMethod.value.toLowerCase()
      : true;
    const matchesStatus = selectedStatus.value
      ? tx.raw.status.toLowerCase() === selectedStatus.value.toLowerCase()
      : true;
    const matchesDate = rawDate
      ? isWithinPeriod(rawDate, activePeriod.value)
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
  XLSX.writeFile(workbook, "transactions.xlsx");
};

onMounted(fetchPaymentTransactions);
</script>

<style lang="scss" scoped>
.button-row {
  @apply flex justify-between items-center gap-x-2;
  .btn {
    @apply py-2.5 px-5 h-10;
  }
}
</style>
