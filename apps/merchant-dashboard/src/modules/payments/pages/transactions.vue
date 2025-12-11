<template>
  <PageContentWrapper
    :pagingData="tablePaging"
    pageDescription="All Transactions"
    :pageKeys="{ green: 'Successful', yellow: 'Pending', red: 'Failed' }"
    @updatePage="(currentPage) => (page = currentPage)"
  >
    <template #pageOptions>
      <div
        class="relative flex items-center gap-4 mb-6 sm:flex-wrap sm:flex-row-reverse top-4 sm:static"
        v-if="!isLoading"
      >
        <div class="flex items-center justify-between w-full gap-4">
          <div
            class="relative w-48 text-sm font-semibold text-teal-800 border rounded-md cursor-pointer filter-select bg-grey-50/80"
          >
            <select
              v-model="selectedMethod"
              class="w-full p-4 bg-transparent appearance-none focus:outline-none"
            >
              <option value="">Payment Method</option>
              <option
                v-for="(method, index) in paymentMethods"
                :value="method.toLowerCase()"
                :key="index"
              >
                {{ method }}
              </option>
            </select>
            <div
              class="absolute text-[16px] text-teal-800 -translate-y-1/2 pointer-events-none icon icon-caret-down right-4 top-1/2"
            ></div>
          </div>

          <div
            class="relative w-48 text-sm font-semibold text-teal-800 border rounded-md cursor-pointer filter-select bg-grey-50/80"
          >
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
        </div>

        <div class="flex items-center w-full gap-4">
          <DatePicker
            filterSize="lg"
            :activePeriod="activePeriod"
            @onFilterSelected="processFilterSelection"
          />
          <button
            @click="exportToExcel"
            class="w-48 p-4 text-sm font-semibold text-teal-800 transition-all duration-200 border rounded-md export-btn sm:w-1/2 hover:bg-teal-50"
          >
            Export
          </button>
        </div>
      </div>
    </template>

    <template #pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No transactions yet!',
          description:
            'No transactions have been initiated on your account yet.',
        }"
      >
        <TableContainerBody
          v-for="(payload, index) in tableBody"
          :key="index"
          :tableHeader="tableHeader"
          :tableData="payload"
          :on-table-clicked="() => openTransactionLog(payload)"
        />
      </TableContainer>
    </template>
  </PageContentWrapper>
    <teleport to="body" v-if="showTransactionDetailsModal">
    <TransactionDetailsModal
      @closeTriggered="toggleTransactionDetailsModal"
      :transaction="selectedTransaction"
    />
  </teleport>
</template>

<script setup lang="ts">
import * as XLSX from "xlsx";
import { ref, h, computed, onMounted, watch } from "vue";
import { TableHeaderType } from "@packages/models";
import { useDate, useString, useEvents } from "@packages/hooks";
import { usePaymentStore } from "@/modules/payments/store";
import { DatePicker } from "@packages/uikit";
import TransactionDetailsModal from "@/modules/payments/modals/transaction-details-modal.vue";
import {
  TableContainer,
  TableContainerBody,
  TableDoubleColumn,
  PageContentWrapper,
} from "@packages/uikit";

const { formatNumber, getStatus, capitalizeFirstLetter } = useString();
const { processAPIRequest } = useEvents();
const { getTransactions, getAllTransactions } = usePaymentStore();

const isLoading = ref(true);
const selectedMethod = ref("");
const selectedStatus = ref("");
const activePeriod = ref<[Date, Date] | null>(null);
const page = ref(1);
const selectedTransaction = ref(null);
const showTransactionDetailsModal = ref(false);

const filters = computed(
  () => `?page=${page.value}&method=${selectedMethod.value}&status=${selectedStatus.value}&from=${activePeriod.value ? activePeriod.value[0].toISOString().split("T")[0] : ""}&to=${activePeriod.value ? activePeriod.value[1].toISOString().split("T")[0] : ""}`
);

const statusOptions = ["Successful", "Pending", "Failed"];
const paymentMethods = ["Card", "Mobilemoney"];

const tableHeader = ref<TableHeaderType[]>([
  { title: "Transaction Date", slug: "date_created" },
  { title: "Customer Details", slug: "customer_details" },
  { title: "Amount", slug: "amount" },
  { title: "Payment Method", slug: "payment_details" },
  { title: "Status", slug: "status" },
  { title: "Reason", slug: "reason_for_failure" },
  { title: "Transaction Reference", slug: "reference" },
]);

const tableBody = ref<any[]>([]);
const tableBodyRaw = ref<any[]>([]);
const tablePaging = ref<any>({});

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

const openTransactionLog = (row: any) => {
  selectedTransaction.value = row.raw;
  toggleTransactionDetailsModal();
};

const toggleTransactionDetailsModal = () => {
  showTransactionDetailsModal.value = !showTransactionDetailsModal.value;
};

const fetchPaymentTransactions = async (filters: string) => {
  isLoading.value = true;
  tablePaging.value.current_page = page;
  const response = await processAPIRequest({
    action: getTransactions,
    payload: { filters, page: page.value },
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
      const createdDate = new Date(data.created_at);

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
        payment_details: capitalizeFirstLetter(data.method),
        status: getStatus(data.status, data.status),
        reason_for_failure: capitalizeFirstLetter(
          (data.reason_for_failure || "-").toString().toLowerCase()
        ),

        reference: data.reference,
        raw: {
          date_created: `${getTransactionDate(data.created_at)} - ${useDate.formatTime(data.created_at)}`,
          raw_date: createdDate,
          customer_details: `${customerName} (${customerEmail})`,
          amount: formatNumber(data.amount),
          payment_details: capitalizeFirstLetter(data.method),
          status: data.status,
          reference: data.reference,
        },
      };
    });

    tableBodyRaw.value = tableBody.value.map((tx) => tx.raw);
    tablePaging.value = response.pagination[0] || {};
  }
};

const fetchAllTransactions = async () => {
  let page = 1;
  let all: any[] = [];
  let totalPages = 1;

  do {
    const response = await processAPIRequest({
      action: getAllTransactions,
      payload: { page },
      showAlert: false,
    });

    if (response?.code !== 200) break;

    const mapped = response.data.map((data: any) => {
      const customerName = data.customer
        ? `${data.customer.firstname} ${data.customer.lastname}`
        : "No customer info";
      const customerEmail = data.customer ? data.customer.email : "";

      return {
        date_created: `${getTransactionDate(data.created_at)} - ${useDate.formatTime(data.created_at)}`,
        raw_date: new Date(data.created_at),
        customer_details: `${customerName} (${customerEmail})`,
        amount: formatNumber(data.amount),
        payment_details: capitalizeFirstLetter(data.method),
        status: data.status,
        reason_for_failure: capitalizeFirstLetter(
          (data.reason_for_failure || "-").toString().toLowerCase()
        ),

        reference: data.reference,
        currency: data.currency,
      };
    });

    all.push(...mapped);

    totalPages = response.pagination[0]?.total_pages ?? 1;
    page++;
  } while (page <= totalPages);

  return all;
};

const exportToExcel = async () => {
  const allTransactions = await fetchAllTransactions();

  if (!allTransactions || allTransactions.length === 0) return;

    const filtered = allTransactions.filter((tx) => {
    const method = tx.payment_details.toLowerCase();
    const status = tx.status.toLowerCase();
    const date = tx.raw_date ? new Date(tx.raw_date) : null;

    const matchesMethod = selectedMethod.value
      ? method === selectedMethod.value.toLowerCase()
      : true;
    const matchesStatus = selectedStatus.value
      ? status === selectedStatus.value
      : true;
    const matchesDate = date ? isWithinRange(date, activePeriod.value) : true;

    return matchesMethod && matchesStatus && matchesDate;
  });

  const cleanData = filtered.map((tx) => ({
    "Date Created": tx.date_created,
    "Customer Details": tx.customer_details,
    Currency: tx.currency,
    Amount: tx.amount,
    "Payment Method": tx.payment_details,
    Status: tx.status,
    Reason: tx.reason_for_failure || "-",
    Reference: tx.reference,
  }));

  const worksheet = XLSX.utils.json_to_sheet(cleanData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
  XLSX.writeFile(workbook, "All_Merchant_Transactions.xlsx");
};

watch([selectedMethod, selectedStatus, activePeriod], () => {
  page.value = 1;
});

watch(filters, (newFilters) => {
  fetchPaymentTransactions(newFilters);
});

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
