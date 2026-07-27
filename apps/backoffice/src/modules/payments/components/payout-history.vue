<template>
  <section class="payouts-panel">
    <div class="filters-row">
      <FilterBar
        :filters="filterConfig"
        :values="filterValues"
        variant="panel"
        @change="onFilterChange"
      />
    </div>

    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="filteredTableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No payout initiated yet',
        description: 'This merchant hasn\'t initiated any payout yet.',
      }"
    >
      <TableContainerBody
        v-for="(payload, index) in filteredTableBody"
        :key="index"
        :tableHeader="tableHeader"
        :tableData="payload"
      />
    </TableContainer>

    <Pagination
      v-if="tablePaging.page_count > 0"
      :pageDescription="`Page ${tablePaging.current_page} of ${tablePaging.total_pages_count}`"
      :pagingData="tablePaging"
      @page-change="onPageChange"
    />
  </section>

  <TransactionDetailModal
    v-if="showDetailModal"
    :transaction="selectedTransaction"
    @closeTriggered="showDetailModal = false"
  />
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch, onMounted, h } from "vue";
import { useString, useEvents, useDate } from "@packages/hooks";
import { TableHeaderType } from "@packages/models";
import {
  FilterBar,
  Pagination,
  TableContainer,
  TableContainerBody,
  TableDoubleColumn,
} from "@packages/uikit";
import { usePaymentStore } from "@/modules/payments/store";
import TransactionDetailModal from "@/modules/transactions/modals/transaction-detail-modal.vue";

interface PayoutRow {
  date: string;
  createdAt: string;
  amount: string;
  fee: string;
  netPayout: string;
  status: string;
  reference: string;
  raw: Record<string, any>;
}

const props = withDefaults(
  defineProps<{
    merchantId?: string;
    merchantDetails?: Record<string, any> | null;
    overviewData?: Record<string, any> | null;
  }>(),
  { merchantId: "", merchantDetails: null, overviewData: null },
);

const { getTransactions } = usePaymentStore();
const { processAPIRequest } = useEvents();
const { getStatus, formatNumber, getBoldTableText } = useString();

const currencyOptions = computed<string[]>(() => {
  const wallets: any[] = props.overviewData?.wallets || [];
  return wallets.length
    ? [
        ...new Set<string>(
          wallets.map((w: any) => String(w.currency).toUpperCase()),
        ),
      ]
    : ["NGN", "GHS", "TZS", "ZMW", "USD"];
});

const isLoading = ref(false);
const page = ref(1);
const tablePaging = ref<any>({});
const showDetailModal = ref(false);
const selectedTransaction = ref<Record<string, any> | null>(null);

const filterValues = reactive({
  search: "",
  currency: "",
  status: "",
  period: null as [Date, Date] | null,
});

const filterConfig = computed(() => [
  { type: "search" as const, key: "search", placeholder: "Search" },
  {
    type: "select" as const,
    key: "currency",
    options: currencyOptions.value,
    placeholder: "Currency",
  },
  {
    type: "select" as const,
    key: "status",
    options: ["Completed", "Pending", "Failed"],
    placeholder: "Status",
  },
  { type: "date" as const, key: "period" },
]);

const onFilterChange = ({ key, value }: { key: string; value: any }) => {
  if (key === "period") {
    filterValues.period =
      value?.length === 2 ? [new Date(value[0]), new Date(value[1])] : null;
  } else {
    (filterValues as any)[key] = value;
  }
  page.value = 1;
};

const tableHeader: TableHeaderType[] = [
  { title: "Date", slug: "date" },
  { title: "Reference", slug: "reference" },
  { title: "Amount", slug: "amount" },
  { title: "Fees", slug: "fee" },
  { title: "Net payout", slug: "net_payout" },
  { title: "Status", slug: "status" },
  { title: "", slug: "action" },
];

const formatDate = (date?: string) => {
  if (!date) return "-";
  const { m3, d3, y1, h1, b2, a0 } = useDate.formatDate(date).getAll();
  return `${m3} ${d3}, ${y1} ${h1}:${b2} ${a0}`;
};

const getDateCreated = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const fmtStartISO = (date: Date) => date.toISOString().replace(/\.\d+Z$/, "Z");
const fmtEndISO = (date: Date) => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end.toISOString().replace(/\.\d+Z$/, "Z");
};

const apiFilters = computed(() => {
  let filters = `?page=${page.value}&user_id=${props.merchantId}&category=payout`;

  if (filterValues.status)
    filters += `&status=${filterValues.status.toLowerCase()}`;

  if (filterValues.search) filters += `&reference=${filterValues.search}`;

  if (filterValues.currency)
    filters += `&currency=${filterValues.currency.toUpperCase()}`;

  if (filterValues.period) {
    filters += `&from_created_at=${fmtStartISO(filterValues.period[0])}`;
    filters += `&to_created_at=${fmtEndISO(filterValues.period[1])}`;
  }
  return filters;
});

const payouts = ref<PayoutRow[]>([]);

const fetchPayouts = async () => {
  if (!props.merchantId) return;
  isLoading.value = true;

  const response = await processAPIRequest({
    action: getTransactions,
    payload: { filters: apiFilters.value, page: page.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code !== 200) return;

  const data = response.data;
  const payoutsList = Array.isArray(data) ? data : data?.transactions || [];

  payouts.value = payoutsList.map((item: Record<string, any>) => ({
    date: formatDate(item.created_at),
    createdAt: item.created_at,
    amount: item.amount ? `${item.currency} ${formatNumber(item.amount)}` : "-",
    fee: item.fee ? `${item.currency} ${formatNumber(item.fee)}` : "-",
    netPayout: item.net_amount
      ? `${item.currency} ${formatNumber(item.net_amount)}`
      : "-",
    status: (item.status || "").toLowerCase(),
    reference: item.reference || "-",
    raw: item,
  }));

  const src = response.pagination?.[0] || data;
  const totalRecords = src.total_records || 0;
  const pageSize = src.page_size || 10;
  const pageCount = Math.ceil(totalRecords / pageSize) || 0;
  tablePaging.value = {
    current_page: src.current_page || src.page || page.value,
    page_count: pageCount,
    total_pages_count: pageCount,
  };
};

const onPageChange = (pageNum: number) => {
  page.value = pageNum;
};

const filteredTableBody = computed(() =>
  payouts.value.map((payout) => {
    const key = payout.status === "completed" ? "successful" : payout.status;
    const label =
      payout.status.charAt(0).toUpperCase() + payout.status.slice(1);
    return {
      date: h(TableDoubleColumn, {
        entry: {
          primaryText: getDateCreated(payout.createdAt),
          secondaryText: useDate.formatTime(payout.createdAt),
        },
      }),
      amount: getBoldTableText(payout.amount),
      fee: payout.fee,
      net_payout: getBoldTableText(payout.netPayout),
      status: getStatus(key, label),
      reference: payout.reference,
      action: h("div", { class: "flex items-center gap-3" }, [
        h(
          "button",
          {
            type: "button",
            class:
              "text-sm font-semibold text-teal-800 transition hover:text-green-600",
            onClick: (event: Event) => {
              event.stopPropagation();
              openDetailModal(payout);
            },
          },
          "View",
        ),
      ]),
    };
  }),
);

const openDetailModal = (row: PayoutRow) => {
  selectedTransaction.value = row.raw || null;
  showDetailModal.value = true;
};

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(
  () => [props.merchantId, apiFilters.value] as const,
  () => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchPayouts, 300);
  },
);

onMounted(() => {
  if (props.merchantId) fetchPayouts();
});
</script>

<style scoped lang="scss">
.payouts-panel {
  @apply flex flex-col gap-5;
}

.filters-row {
  @apply flex flex-wrap items-center gap-5;
}

:deep(tbody tr td:last-child) {
  text-align: left;

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    transition: background 0.2s;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
}
</style>
