<!-- eslint-disable vue/multi-word-component-names, vue/valid-define-props, dot-notation -->
<template>
  <section class="transactions-panel">
    <div class="filters-row">
      <div class="search-field">
        <span class="icon icon-search-normal"></span>
        <input v-model="searchQuery" type="search" placeholder="Search" />
      </div>

      <label class="filter-select">
        <select v-model="selectedPaymentMethod">
          <option value="">Payment method</option>
          <option
            v-for="method in paymentMethodOptions"
            :key="method"
            :value="method"
          >
            {{ method }}
          </option>
        </select>
        <span class="icon icon-caret-down"></span>
      </label>

      <label class="filter-select">
        <select v-model="selectedStatus">
          <option value="">Status</option>
          <option v-for="status in statusOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
        <span class="icon icon-caret-down"></span>
      </label>

      <DatePicker
        filterSize="lg"
        :activePeriod="activePeriod"
        @onFilterSelected="processFilterSelection"
      />

      <button class="export-button" type="button" @click="exportToExcel">
        Export
      </button>
    </div>

    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="filteredTableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No transactions yet',
        description: 'This merchant has no transactions at the moment.',
      }"
    >
      <TableContainerBody
        v-for="(payload, index) in filteredTableBody"
        :key="index"
        :tableHeader="tableHeader"
        :tableData="payload"
      />
    </TableContainer>
  </section>
</template>

<script setup lang="ts">
/* eslint-disable vue/valid-define-props, dot-notation */
import { computed, defineProps, ref, withDefaults } from "vue";
import { TableHeaderType } from "@packages/models";
import { useDate, useString } from "@packages/hooks";
import {
  DatePicker,
  TableContainer,
  TableContainerBody,
} from "@packages/uikit";
import * as XLSX from "xlsx";

interface MerchantTransaction {
  date: string;
  rawDate: Date | null;
  email: string;
  paymentMethod: string;
  amount: string;
  rawStatus: string;
}

const props = withDefaults(
  defineProps<{
    merchantId?: string;
    merchantDetails?: Record<string, any> | null;
  }>(),
  {
    merchantId: "",
    merchantDetails: null,
  },
);

const { getStatus, formatNumber } = useString();

const isLoading = ref(false);
const searchQuery = ref("");
const selectedPaymentMethod = ref("");
const selectedStatus = ref("");
const activePeriod = ref<[Date, Date] | null>(null);

const paymentMethodOptions = ["Card", "Momo", "Bank Transfer"];
const statusOptions = ["Successful", "Pending", "Failed"];

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date", slug: "date" },
  { title: "Email", slug: "email" },
  { title: "Payment Method", slug: "payment_method" },
  { title: "Amount", slug: "amount" },
  { title: "Status", slug: "status" },
]);

const fallbackTransactions: MerchantTransaction[] = [
  {
    date: "Today",
    rawDate: new Date(),
    email: "business@email.com",
    paymentMethod: "Card",
    amount: "N10,500",
    rawStatus: "Successful",
  },
  {
    date: "Yesterday",
    rawDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    email: "admin@digitalworld.com",
    paymentMethod: "Momo",
    amount: "N10,500",
    rawStatus: "Successful",
  },
  {
    date: "August 5, 2024",
    rawDate: new Date("2024-08-05"),
    email: "support@innovatehub.com",
    paymentMethod: "Card",
    amount: "N10,500",
    rawStatus: "Failed",
  },
];

const normalizeTransaction = (
  transaction: Record<string, any>,
): MerchantTransaction => {
  const createdAt =
    transaction.created_at || transaction.date_created || transaction.date;
  const rawDate = createdAt ? new Date(createdAt) : null;
  const amount = transaction.amount
    ? `${transaction.currency || "NGN"} ${formatNumber(transaction.amount)}`
    : transaction.amount_text || transaction.amount || "N10,500";
  const status = transaction.status || transaction.rawStatus || "Successful";

  return {
    date: transaction.date_label || transaction.date || formatDate(createdAt),
    rawDate,
    email: transaction.email || transaction["customer_email"] || "-",
    paymentMethod:
      transaction["payment_method"] || transaction.paymentMethod || "Card",
    amount,
    rawStatus: status,
  };
};

const formatDate = (date?: string) => {
  if (!date) return "-";

  const { m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${m3} ${d3}, ${y1}`;
};

const sourceTransactions = computed<MerchantTransaction[]>(() => {
  const transactions =
    props.merchantDetails?.transactions ||
    props.merchantDetails?.transaction_history ||
    [];

  return transactions.length
    ? transactions.map((transaction: Record<string, any>) =>
        normalizeTransaction(transaction),
      )
    : fallbackTransactions;
});

const isWithinRange = (date: Date | null, range: [Date, Date] | null) => {
  if (!date || !range) return true;

  const start = new Date(range[0]);
  start.setHours(0, 0, 0, 0);
  const end = new Date(range[1]);
  end.setHours(23, 59, 59, 999);

  return date >= start && date <= end;
};

const filteredRows = computed<MerchantTransaction[]>(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return sourceTransactions.value.filter((transaction) => {
    const matchesSearch = query
      ? [
          transaction.date,
          transaction.email,
          transaction.paymentMethod,
          transaction.amount,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      : true;
    const matchesMethod = selectedPaymentMethod.value
      ? transaction.paymentMethod.toLowerCase() ===
        selectedPaymentMethod.value.toLowerCase()
      : true;
    const matchesStatus = selectedStatus.value
      ? transaction.rawStatus.toLowerCase() ===
        selectedStatus.value.toLowerCase()
      : true;
    const matchesDate = isWithinRange(transaction.rawDate, activePeriod.value);

    return matchesSearch && matchesMethod && matchesStatus && matchesDate;
  });
});

const filteredTableBody = computed(() =>
  filteredRows.value.map((transaction) => ({
    date: transaction.date,
    email: transaction.email,
    payment_method: transaction.paymentMethod,
    amount: transaction.amount,
    status: getStatus(
      transaction.rawStatus.toLowerCase(),
      transaction.rawStatus,
    ),
  })),
);

const processFilterSelection = (
  selectedRange: [Date | string, Date | string] | null,
) => {
  if (selectedRange && selectedRange.length === 2) {
    activePeriod.value = [
      new Date(selectedRange[0]),
      new Date(selectedRange[1]),
    ];
    return;
  }

  activePeriod.value = null;
};

const exportToExcel = () => {
  const cleanData = filteredRows.value.map((transaction) => ({
    Date: transaction.date,
    Email: transaction.email,
    "Payment Method": transaction.paymentMethod,
    Amount: transaction.amount,
    Status: transaction.rawStatus,
  }));

  const worksheet = XLSX.utils.json_to_sheet(cleanData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Merchant Transactions");
  XLSX.writeFile(workbook, `Merchant_${props.merchantId}_Transactions.xlsx`);
};
</script>

<style scoped lang="scss">
.transactions-panel {
  @apply flex flex-col gap-5;
}

.filters-row {
  @apply flex flex-wrap items-center gap-5;
}

.search-field {
  @apply relative w-[260px] md:w-full;

  .icon {
    @apply absolute left-4 top-1/2 -translate-y-1/2 text-grey-500;
  }

  input {
    @apply h-11 w-full rounded-lg border border-grey-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-grey-900 outline-none transition focus:border-teal-800;
  }
}

.filter-select {
  @apply relative inline-flex h-11 min-w-[170px] items-center rounded-lg bg-grey-100 text-sm font-bold text-grey-900 md:w-full;

  select {
    @apply h-full w-full appearance-none bg-transparent px-4 pr-10 outline-none;
  }

  .icon {
    @apply pointer-events-none absolute right-4 text-xs text-grey-700;
  }
}

.export-button {
  @apply ml-auto h-10 rounded-lg border border-grey-700 bg-white px-6 text-sm font-bold text-grey-900 transition hover:border-teal-800 hover:text-teal-800 md:ml-0;
}

:deep(tbody tr td:last-child) {
  text-align: left;
}
</style>
