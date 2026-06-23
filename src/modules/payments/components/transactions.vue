<!-- eslint-disable vue/multi-word-component-names, vue/valid-define-props, dot-notation -->
<template>
  <section class="transactions-panel">
    <div class="filters-row">
      <FilterBar
        :filters="filterConfig"
        :values="filterValues"
        variant="panel"
        @change="onFilterChange"
      />

      <button
        class="btn btn-sm btn-secondary mt-8"
        type="button"
        @click="exportToExcel"
      >
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
import { computed, defineProps, ref, withDefaults, reactive } from "vue";
import { TableHeaderType } from "@packages/models";
import { useDate, useString } from "@packages/hooks";
import { FilterBar, TableContainer, TableContainerBody } from "@packages/uikit";
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

const filterValues = reactive({
  search: "",
  paymentMethod: "",
  status: "",
  period: null as [Date, Date] | null,
});

const filterConfig = [
  { type: "search" as const, key: "search", placeholder: "Search" },
  {
    type: "select" as const,
    key: "paymentMethod",
    options: ["Card", "Momo", "Bank Transfer"],
    placeholder: "Payment method",
  },
  {
    type: "select" as const,
    key: "status",
    options: ["Successful", "Pending", "Failed"],
    placeholder: "Status",
  },
  { type: "date" as const, key: "period" },
];

const onFilterChange = ({ key, value }: { key: string; value: any }) => {
  if (key === "period") {
    filterValues.period =
      value && value.length === 2
        ? [new Date(value[0]), new Date(value[1])]
        : null;
  } else {
    (filterValues as any)[key] = value;
  }
};

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date", slug: "date" },
  { title: "Email", slug: "email" },
  { title: "Payment Method", slug: "payment_method" },
  { title: "Amount", slug: "amount" },
  { title: "Status", slug: "status" },
]);

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

  return (transactions.length = transactions.map(
    (transaction: Record<string, any>) => normalizeTransaction(transaction),
  ));
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
  const query = filterValues.search.trim().toLowerCase();

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
    const matchesMethod = filterValues.paymentMethod
      ? transaction.paymentMethod.toLowerCase() ===
        filterValues.paymentMethod.toLowerCase()
      : true;
    const matchesStatus = filterValues.status
      ? transaction.rawStatus.toLowerCase() ===
        filterValues.status.toLowerCase()
      : true;
    const matchesDate = isWithinRange(transaction.rawDate, filterValues.period);

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

const downloadBlob = (filename: string, blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const toCSV = (rows: Record<string, any>[]) => {
  if (!rows || !rows.length) return "";
  const keys = Object.keys(rows[0]);
  const escape = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return s.includes(",") || s.includes("\n") || s.includes('"')
      ? '"' + s.replace(/"/g, '""') + '"'
      : s;
  };
  const header = keys.join(",");
  const lines = rows.map((r) => keys.map((k) => escape(r[k])).join(","));
  return [header, ...lines].join("\n");
};

const exportToExcel = () => {
  const cleanData = filteredRows.value.map((transaction) => ({
    Date: transaction.date,
    Email: transaction.email,
    "Payment Method": transaction.paymentMethod,
    Amount: transaction.amount,
    Status: transaction.rawStatus,
  }));

  try {
    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Merchant Transactions");
    XLSX.writeFile(workbook, `Merchant_${props.merchantId}_Transactions.xlsx`);
  } catch (err) {
    try {
      const csv = toCSV(cleanData);
      if (!csv) {
        return;
      }
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      downloadBlob(`Merchant_${props.merchantId}_Transactions.csv`, blob);
    } catch (err2) {}
  }
};
</script>

<style scoped lang="scss">
.transactions-panel {
  @apply flex flex-col gap-5;
}

.filters-row {
  @apply flex flex-wrap items-center gap-5;
}

:deep(tbody tr td:last-child) {
  text-align: left;
}
</style>
