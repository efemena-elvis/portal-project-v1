import { ref, computed, h, reactive } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useDate, useEvents, useString, useAutoFetch } from "@packages/hooks";
import { TableDoubleColumn } from "@packages/uikit";
import { TableHeaderType } from "@packages/models";
import { useApprovalsStore } from "@/modules/approvals/store";
import { useGlobalStore } from "@/modules/global/store";
import {
  getDateCreated,
  mapStatusKey,
  normalizeApprovalRequest,
  normalizeWithdrawalRequest,
} from "./approvalHelpers";
import {
  tabs,
  filterConfig,
  fundingStatsTemplate,
  withdrawalStatsTemplate,
} from "./approvalConstants";

export function useApprovalsData() {
  const {
    getAllApprovals,
    decideApproval,
    getAllWithdrawalRequests,
    decideWithdrawalRequest,
  } = useApprovalsStore();
  const { processAPIRequest, pushToastAlert } = useEvents();
  const { environment } = storeToRefs(useGlobalStore());
  const { formatNumber, getBoldTableText, getStatus, capitalizeFirstLetter} = useString();
  const router = useRouter();

  const isLoading = ref(true);
  const tableBody = ref<any[]>([]);
  const tablePaging = ref<any>({});
  const page = ref(1);
  const showRequestModal = ref(false);
  const selectedRequest = ref<any | null>(null);

  const activeTab = ref<"funding" | "withdrawal">("funding");

  const tabButtonClass = (tabValue: string) =>
    activeTab.value === tabValue ? "tab-btn tab-btn--active" : "tab-btn";

  const switchTab = (tab: "funding" | "withdrawal") => {
    activeTab.value = tab;
    page.value = 1;
  };

  const filterValues = reactive({
    search: "",
    status: "",
    period: null as [Date, Date] | null,
  });

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

  const approvalStats = ref<{ title: string; value: string }[]>([
    { title: "Total Funding Requests", value: "-" },
    { title: "Fundings Completed", value: "-" },
    { title: "Fundings Pending", value: "-" },
    { title: "Fundings Failed", value: "-" },
  ]);

  const fmtDate = (date: Date) => date.toISOString().split("T")[0];

  const fundingTableHeader: TableHeaderType[] = [
    { title: "Date", slug: "date_created" },
    { title: "Merchant", slug: "merchant" },
    { title: "Amount", slug: "amount" },
    { title: "Status", slug: "status" },
    { title: "Reference", slug: "reference" },
    { title: "Failure Reason", slug: "failureReason" },
    { title: "", slug: "action" },
  ];

  const withdrawalTableHeader: TableHeaderType[] = [
    { title: "Date", slug: "date_created" },
    { title: "Merchant", slug: "merchant" },
    { title: "Amount", slug: "amount" },
    { title: "Status", slug: "status" },
    { title: "Reference", slug: "reference" },
    { title: "Failure Reason", slug: "failureReason" },
    { title: "", slug: "action" },
  ];

  const tableHeader = computed(() =>
    activeTab.value === "funding" ? fundingTableHeader : withdrawalTableHeader,
  );

  const filters = computed(
    () =>
      `?page=${page.value}&tab=${activeTab.value}&status=${filterValues.status}&from=${filterValues.period ? fmtDate(filterValues.period[0]) : ""}&to=${filterValues.period ? fmtDate(filterValues.period[1]) : ""}&search=${filterValues.search.toLocaleLowerCase().trim()}&environment=${environment.value}`,
  );

  const openRequestModal = async (request: any) => {
    selectedRequest.value = request;
    showRequestModal.value = true;
  };

  const closeRequestModal = () => {
    showRequestModal.value = false;
    selectedRequest.value = null;
  };

  const goToMerchantDashboard = () => {
    if (!selectedRequest.value?.merchantId) return;
    router.push(`/merchants/${selectedRequest.value.merchantId}`);
  };

  const handleApprovalAction = async (action: "approve" | "reject") => {
    if (activeTab.value === "withdrawal") {
      const uuid = selectedRequest.value?.uuid;
      if (!uuid) {
        pushToastAlert({
          message: "Unable to complete action",
          description: "Request information is not available.",
          type: "error",
        });
        return;
      }

      const response = await processAPIRequest({
        action: async () => decideWithdrawalRequest({ uuid, action }),
        alertHandler: {
          200: {
            message:
              action === "approve"
                ? "Withdrawal request approved"
                : "Withdrawal request rejected",
            description:
              "The withdrawal request has been updated successfully.",
            type: "success",
          },
          404: {
            message: "Request not found",
            description: "Please refresh the page and try again.",
            type: "error",
          },
        },
      });

      if (response?.code === 200 || response?.code === 201) {
        closeRequestModal();
        fetchApprovals(filters.value);
      } else {
        pushToastAlert({
          message: response?.error?.message || "Unable to complete action",
          type: "error",
        });
      }
      return;
    }

    const uuid = selectedRequest.value?.id;
    if (!uuid) {
      pushToastAlert({
        message: "Unable to complete action",
        description: "Approval request information is not available.",
        type: "error",
      });
      return;
    }

    const response = await processAPIRequest({
      action: () =>
        decideApproval({
          uuid,
          comment: "Payment confirmed by admin",
        }),
      alertHandler: {
        200: {
          message: "Funding request approved",
          description: "The funding request has been approved successfully.",
          type: "success",
        },
      },
    });

    if (response?.code === 200 || response?.code === 201) {
      closeRequestModal();
      fetchApprovals(filters.value);
    } else {
      pushToastAlert({
        message: response?.error?.message || "Unable to complete action",
        type: "error",
      });
    }
  };

  const buildApprovalTableRows = (requests: any[]) => {
    tableBody.value = requests.map((data: any) => {
      const request = normalizeApprovalRequest(data);
      const date = data?.created_at;

      return {
        date_created: h(TableDoubleColumn, {
          entry: {
            primaryText: date ? getDateCreated(date) : "-",
            secondaryText: date ? useDate.formatTime(date) : "",
          },
        }),
        merchant: getBoldTableText(capitalizeFirstLetter(request.merchantName)),
        amount: getBoldTableText(
          `${request.currency} ${request.amount}`.trim(),
        ),
        status: getStatus(mapStatusKey(data.status), request.status),
        reference: request.reference,
        failureReason: request.failureReason,
        action: h(
          "button",
          {
            class:
              "text-sm font-semibold text-teal-800 transition hover:text-green-600",
            type: "button",
            onClick: (event: Event) => {
              event.stopPropagation();
              openRequestModal(request);
            },
          },
          "View",
        ),
        raw: request,
      };
    });
  };

  const buildWithdrawalTableRows = (requests: any[]) => {
    tableBody.value = requests.map((data: any) => {
      const request = normalizeWithdrawalRequest(data);

      return {
        date_created: h(TableDoubleColumn, {
          entry: {
            primaryText: getDateCreated(data.created_at),
            secondaryText: useDate.formatTime(data.created_at),
          },
        }),
        merchant: getBoldTableText(capitalizeFirstLetter(request.merchantName)),
        amount: getBoldTableText(
          `${data.currency} ${formatNumber(data.amount)}`,
        ),
        status: getStatus(mapStatusKey(data.status), request.status),
        reference: request.reference,
        failureReason: request.failureReason,
        action: h(
          "button",
          {
            class:
              "text-sm font-semibold text-teal-800 transition hover:text-green-600",
            type: "button",
            onClick: (event: Event) => {
              event.stopPropagation();
              openRequestModal(request);
            },
          },
          "View",
        ),
        raw: request,
      };
    });
  };

  const fetchApprovalStats = async () => {
    const base = filters.value.replace(/page=\d+/, "page=1").replace(/&status=[^&]*/, '');
    const action =
      activeTab.value === "funding"
        ? getAllApprovals
        : getAllWithdrawalRequests;
    const isFunding = activeTab.value === "funding";

    if (filterValues.status) {
      const statusRes = await processAPIRequest({
        action,
        payload: { filters: `${base}&status=${filterValues.status}` },
        showAlert: false,
      });
      const count = statusRes?.data?.total_records || 0;

      approvalStats.value = [
        {
          title: isFunding
            ? "Total Funding Requests"
            : "Total Withdrawal Requests",
          value: "-",
        },
        {
          title: isFunding ? "Fundings Completed" : "Withdrawals Completed",
          value:
            filterValues.status === "completed" ? count.toLocaleString() : "-",
        },
        {
          title: isFunding ? "Fundings Pending" : "Withdrawals Pending",
          value:
            filterValues.status === "pending" ? count.toLocaleString() : "-",
        },
        {
          title: isFunding ? "Fundings Failed" : "Withdrawals Failed",
          value:
            filterValues.status === "failed" ? count.toLocaleString() : "-",
        },
      ];
      return;
    }

    const [totalRes, completedRes, pendingRes, failedRes] = await Promise.all([
      processAPIRequest({
        action,
        payload: { filters: base },
        showAlert: false,
      }),
      processAPIRequest({
        action,
        payload: { filters: `${base}&status=completed` },
        showAlert: false,
      }),
      processAPIRequest({
        action,
        payload: { filters: `${base}&status=pending` },
        showAlert: false,
      }),
      processAPIRequest({
        action,
        payload: { filters: `${base}&status=failed` },
        showAlert: false,
      }),
    ]);

    const total = totalRes?.data?.total_records || 0;
    const completed = completedRes?.data?.total_records || 0;
    const pending = pendingRes?.data?.total_records || 0;
    const failed = failedRes?.data?.total_records || 0;

    approvalStats.value = [
      {
        title: isFunding
          ? "Total Funding Requests"
          : "Total Withdrawal Requests",
        value: total.toLocaleString(),
      },
      {
        title: "Completed",
        value: completed.toLocaleString(),
      },
      {
        title: "Pending",
        value: pending.toLocaleString(),
      },
      {
        title: "Failed",
        value: failed.toLocaleString(),
      },
    ];
  };

  const fetchFundingRequests = async (filters: string) => {
    tableBody.value = [];
    approvalStats.value = [...fundingStatsTemplate];
    tablePaging.value = {};
    isLoading.value = true;

    const response = await processAPIRequest({
      action: getAllApprovals,
      payload: { filters, page: page.value },
      showAlert: false,
    });

    isLoading.value = false;

    if (activeTab.value !== "funding") return;

    if (response?.code === 200 && response.data?.wallet_fundings?.length) {
      buildApprovalTableRows(response.data.wallet_fundings);
      await fetchApprovalStats();
      const total = response.data?.total_records || 0;
      tablePaging.value = {
        current_page: response.data?.page || page.value,
        page_count: response.data?.wallet_fundings?.length || 0,
        total_pages_count: Math.ceil(total / (response.data?.page_size || 1)),
      };
    }
  };

  const fetchWithdrawalRequests = async (filters: string) => {
    tableBody.value = [];
    approvalStats.value = [...withdrawalStatsTemplate];
    tablePaging.value = {};
    isLoading.value = true;

    const response = await processAPIRequest({
      action: getAllWithdrawalRequests,
      payload: { filters, page: page.value },
      showAlert: false,
    });

    isLoading.value = false;

    if (activeTab.value !== "withdrawal") return;

    if (response.code === 200) {
      buildWithdrawalTableRows(response.data.transactions);
      await fetchApprovalStats();
      const total = response.data?.total_records || 0;
      tablePaging.value = {
        current_page: response.data?.page || page.value,
        page_count: response.data?.transactions?.length || 0,
        total_pages_count: Math.ceil(total / (response.data?.page_size || 1)),
      };
    }
  };

  const fetchApprovals = async (filters: string) => {
    if (activeTab.value === "funding") {
      await fetchFundingRequests(filters);
    } else {
      await fetchWithdrawalRequests(filters);
    }
  };

  useAutoFetch(filters, fetchApprovals);

  return {
    isLoading,
    tableBody,
    tableHeader,
    tablePaging,
    page,
    showRequestModal,
    selectedRequest,
    tabs,
    activeTab,
    tabButtonClass,
    switchTab,
    filterValues,
    filterConfig,
    onFilterChange,
    approvalStats,
    fetchApprovals,
    closeRequestModal,
    goToMerchantDashboard,
    handleApprovalAction,
  };
}
