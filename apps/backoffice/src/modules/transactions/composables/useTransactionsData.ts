import { ref, computed, h, reactive, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useDate, useEvents, useString } from "@packages/hooks";
import { useTransactionStore } from "@/modules/transactions/store";
import { useMerchantStore } from "@/modules/merchants/store";
import { useGlobalStore } from "@/modules/global/store";
import { TableHeaderType } from "@packages/models";
import { TableDoubleColumn } from "@packages/uikit";

export function useTransactionsData() {
  const { getAllTransactions } = useTransactionStore();
  const { getAllMerchants } = useMerchantStore();
  const { processAPIRequest } = useEvents();
  const { formatNumber, getBoldTableText, getStatus, capitalizeFirstLetter } =
    useString();

  const isLoading = ref(true);
  const transactionStats = ref<{ title: string; value: string }[]>([
    { title: "Total Transactions", value: "-" },
    { title: "Completed", value: "-" },
    { title: "Pending", value: "-" },
    { title: "Failed", value: "-" },
  ]);
  const tableBody = ref<any[]>([]);
  const tablePaging = ref<any>({});
  const page = ref(1);
  const merchantOptions = ref<{ value: string; name: string }[]>([]);
  const showDetailModal = ref(false);
  const selectedTransaction = ref<Record<string, any> | null>(null);
  const debounceTimer = ref<ReturnType<typeof setTimeout> | null>(null);

  const { environment } = storeToRefs(useGlobalStore());

  const mapMerchantOptions = (merchants: any[]) =>
    merchants.map((merchant: any) => ({
      value: merchant.uuid || "",
      name:
        merchant.business_name ||
        merchant.email ||
        `${merchant.first_name || ""} ${merchant.last_name || ""}`.trim() ||
        "-",
    }));

  const fetchMerchants = async () => {
    const response = await processAPIRequest({
      action: getAllMerchants,
      environment: environment.value,
      showAlert: false,
    });
    if (Array.isArray(response)) {
      merchantOptions.value = mapMerchantOptions(response);
    }
  };

  const filterValues = reactive({
    search: "",
    merchant: "",
    paymentMethod: "",
    currency: "",
    status: "",
    type: "",
    period: null as [Date, Date] | null,
  });

  const filterConfig = [
    {
      type: "search" as const,
      key: "search",
      placeholder: "Search by reference",
    },
    {
      type: "searchable-select" as const,
      key: "merchant",
      options: merchantOptions,
      placeholder: "Merchant",
    },
    {
      type: "select" as const,
      key: "paymentMethod",
      options: [
        { value: "mobilemoney", name: "Mobile Money" },
        { value: "card", name: "Card" },
        { value: "bank", name: "Bank" },
        { value: "reversal", name: "Reversal" },
      ],
      placeholder: "Payment Method",
    },
    {
      type: "select" as const,
      key: "type",
      options: [
        { value: "pay_in", name: "Pay In" },
        { value: "pay_out", name: "Pay Out" },
      ],
      placeholder: "Type",
    },
    {
      type: "select" as const,
      key: "currency",
      options: [
        { value: "NGN", name: "NGN" },
        { value: "ZMW", name: "ZMW" },
        { value: "GHS", name: "GHS" },
        { value: "USD", name: "USD" },
        { value: "TZS", name: "TZS" },
        { value: "KES", name: "KES" },
        { value: "XOF", name: "XOF" },
      ],
      placeholder: "Currency",
    },
    {
      type: "select" as const,
      key: "status",
      options: ["Completed", "Pending", "Failed", "Cancelled"],
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
    page.value = 1;
  };

  const tableHeader = ref<TableHeaderType[]>([
    { title: "Date", slug: "date" },
    { title: "Business Name", slug: "merchant" },
    { title: "Amount", slug: "amount" },
    { title: "Payment Method", slug: "method" },
    { title: "Reference", slug: "reference" },
    { title: "Status", slug: "status" },
    { title: "", slug: "action" },
  ]);

  const fmtDate = (date: Date) => date.toISOString().split("T")[0];

  const filters = computed(() => {
    return `?page=${page.value}&status=${filterValues.status}&method=${filterValues.paymentMethod}&type=${filterValues.type}&currency=${filterValues.currency}&user_id=${filterValues.merchant}&from_created_at=${filterValues.period ? fmtDate(filterValues.period[0]) : ""}&to_created_at=${filterValues.period ? fmtDate(filterValues.period[1]) : ""}&reference=${filterValues.search}`;
  });

  const getDateCreated = (date: string) => {
    const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
    return `${w2}, ${d3} ${m3}, ${y1}`;
  };

  const normalizeTransaction = (data: any) => {
    return {
      id: data?.uuid,
      uuid: data?.uuid,
      date: data?.created_at || "-",
      merchant: data?.business_name || "-",
      amount: `${data?.currency || ""} ${formatNumber(data?.amount ?? 0)}`,
      currency: data?.currency || "",
      method: data?.method || "-",
      type: data?.type || "-",
      reference: data?.reference || "-",
      status: data?.status || "-",
      raw: data,
    };
  };

  const buildTableRows = (transactions: any[]) => {
    tableBody.value = transactions.map((data: any) => {
      const tx = normalizeTransaction(data);
      const date = tx.date;

      return {
        date: h(TableDoubleColumn, {
          entry: {
            primaryText: date !== "-" ? getDateCreated(date) : "-",
            secondaryText: date !== "-" ? useDate.formatTime(date) : "",
          },
        }),
        merchant: getBoldTableText(capitalizeFirstLetter(tx.merchant)),
        amount: getBoldTableText(tx.amount),
        method: h(TableDoubleColumn, {
          entry: {
            primaryText: capitalizeFirstLetter(tx.method.replace(/_/g, " ")),
            secondaryText: capitalizeFirstLetter(tx.type.replace(/_/g, " ")),
          },
        }),
        reference: tx.reference,
        status: getStatus(
          tx.status === "completed" ? "successful" : tx.status,
          tx.status,
        ),

        action: h("div", { class: "flex items-center gap-3" }, [
          h(
            "button",
            {
              type: "button",
              class:
                "text-sm font-semibold text-teal-800 transition hover:text-green-600",
              onClick: (event: Event) => {
                event.stopPropagation();
                openDetailModal(tx);
              },
            },

            "View",
          ),
        ]),
        raw: tx,
      };
    });
  };

  const openDetailModal = (tx: any) => {
    selectedTransaction.value = tx.raw;
    showDetailModal.value = true;
  };

  const fetchTransactionStats = async () => {
    const base = `?page=1&page_size=100&method=${filterValues.paymentMethod}&type=${filterValues.type}&currency=${filterValues.currency}&user_id=${filterValues.merchant}&from_created_at=${filterValues.period ? fmtDate(filterValues.period[0]) : ""}&to_created_at=${filterValues.period ? fmtDate(filterValues.period[1]) : ""}&reference=${filterValues.search}`;

    if (filterValues.status) {
      const statusRes = await processAPIRequest({
        action: getAllTransactions,
        payload: {
          filters: `${base}&status=${filterValues.status}`,
          environment: environment.value,
        },
        showAlert: false,
      });
      const count = statusRes?.data?.total_records || 0;

      transactionStats.value = [
        { title: "Total Transactions", value: "-" },
        {
          title: "Completed",
          value:
            filterValues.status === "completed" ? count.toLocaleString() : "-",
        },
        {
          title: "Pending",
          value:
            filterValues.status === "pending" ? count.toLocaleString() : "-",
        },
        {
          title: "Failed",
          value:
            filterValues.status === "failed" ? count.toLocaleString() : "-",
        },
      ];
      return;
    }

    const [totalRes, completedRes, pendingRes, failedRes] = await Promise.all([
      processAPIRequest({
        action: getAllTransactions,
        payload: { filters: base, environment: environment.value },
        showAlert: false,
      }),
      processAPIRequest({
        action: getAllTransactions,
        payload: {
          filters: `${base}&status=completed`,
          environment: environment.value,
        },
        showAlert: false,
      }),
      processAPIRequest({
        action: getAllTransactions,
        payload: {
          filters: `${base}&status=pending`,
          environment: environment.value,
        },
        showAlert: false,
      }),
      processAPIRequest({
        action: getAllTransactions,
        payload: {
          filters: `${base}&status=failed`,
          environment: environment.value,
        },
        showAlert: false,
      }),
    ]);

    const total = totalRes?.data?.total_records || 0;
    const completed = completedRes?.data?.total_records || 0;
    const pending = pendingRes?.data?.total_records || 0;
    const failed = failedRes?.data?.total_records || 0;

    transactionStats.value = [
      { title: "Total Transactions", value: total.toLocaleString() },
      { title: "Completed", value: completed.toLocaleString() },
      { title: "Pending", value: pending.toLocaleString() },
      { title: "Failed", value: failed.toLocaleString() },
    ];
  };

  const fetchTransactions = async (filters: string) => {
    isLoading.value = true;
    tablePaging.value.current_page = page.value;

    const response = await processAPIRequest({
      action: getAllTransactions,
      payload: { filters, page: page.value, environment: environment.value },
      showAlert: false,
    });

    isLoading.value = false;

    if (response?.code === 200) {
      const transactions = response.data?.transactions || [];
      const total = response.data?.total_records || 0;
      buildTableRows(transactions);
      tablePaging.value = {
        current_page: response.data?.page || page.value,
        page_count: transactions.length,
        total_pages_count: Math.ceil(total / (response.data?.page_size || 1)),
      };

      fetchTransactionStats();
    }
  };

  watch(filters, (newFilters) => {
    if (debounceTimer.value) clearTimeout(debounceTimer.value);
    debounceTimer.value = setTimeout(() => fetchTransactions(newFilters), 300);
  });

  watch(environment, () => {
    if (debounceTimer.value) clearTimeout(debounceTimer.value);
    debounceTimer.value = setTimeout(() => {
      fetchMerchants();
      fetchTransactions(filters.value);
    }, 300);
  });

  onMounted(() => {
    fetchMerchants();
    fetchTransactions(filters.value);
  });

  return {
    transactionStats,
    isLoading,
    tableBody,
    tableHeader,
    tablePaging,
    page,
    filterValues,
    filterConfig,
    onFilterChange,
    showDetailModal,
    selectedTransaction,
  };
}
