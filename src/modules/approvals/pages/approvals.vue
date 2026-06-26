<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <PageContentWrapper
    description="Manage funding and withdrawal requests"
    :showTitle="true"
    pageDescription="All Approval Requests"
    :pagingData="tablePaging"
    @updatePage="(currentPage) => (page = currentPage)"
  >
    <template #pageContent>
      <section class="flex flex-col gap-7">
        <div class="flex flex-wrap items-center gap-8 mt-8">
          <StatsCard
            v-for="stat in approvalStats"
            :key="stat.title"
            :title="stat.title"
            :value="stat.value"
          />
        </div>

        <div class="inline-flex bg-teal-100 w-full p-2 rounded-md">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            :class="tabButtonClass(tab.value)"
            @click="switchTab(tab.value)"
            type="button"
          >
            {{ tab.label }}
          </button>
        </div>

        <FilterBar
          :filters="filterConfig"
          :values="filterValues"
          @change="onFilterChange"
        />

        <TableContainer
          :tableHeader="tableHeader"
          :tableBody="tableBody"
          :isLoading="isLoading"
          :emptyData="{
            title: 'No approval requests yet',
            description:
              'Approval requests will appear here once they are available.',
          }"
        >
          <TableContainerBody
            v-for="(payload, index) in tableBody"
            :key="index"
            :tableHeader="tableHeader"
            :tableData="payload"
          />
        </TableContainer>
      </section>
    </template>
  </PageContentWrapper>

  <RequestDetailModal
    v-if="showRequestModal && selectedRequest"
    :title="selectedRequest.isFunding ? 'Funding Request' : 'Withdrawal Request'"
    :request="selectedRequest"
    @closeTriggered="closeRequestModal"
    @approve="handleApprovalAction('approve')"
    @reject="handleApprovalAction('reject')"
    @goToMerchant="goToMerchantDashboard"
  />
</template>

<script lang="ts" setup>
import { computed, h, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useDate, useEvents, useString, useAutoFetch } from "@packages/hooks";
import {
  PageContentWrapper,
  TableContainer,
  TableContainerBody,
  TableDoubleColumn,
  FilterBar,
  StatsCard,
} from "@packages/uikit";
import { TableHeaderType } from "@packages/models";
import { useApprovalsStore } from "@/modules/approvals/store";
import RequestDetailModal from "@/modules/approvals/modals/request-detail-modal.vue";

const { getAllApprovals, decideApproval, getAllWithdrawalRequests, decideWithdrawalRequest } = useApprovalsStore();
const { processAPIRequest, pushToastAlert } = useEvents();
const { formatNumber, getBoldTableText, getStatus, capitalizeFirstLetter } =
  useString();
const router = useRouter();

const isLoading = ref(true);
const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});
const page = ref(1);
const showRequestModal = ref(false);
const selectedRequest = ref<any | null>(null);

const tabs = [
  { label: "Funding", value: "funding" },
  { label: "Withdrawal", value: "withdrawal" },
] as const;

const activeTab = ref<"funding" | "withdrawal">("funding");

const tabButtonClass = (tabValue: string) =>
  activeTab.value === tabValue ? "tab-btn tab-btn--active" : "tab-btn";

const switchTab = (tab: "funding" | "withdrawal") => {
  activeTab.value = tab;
  page.value = 1;
  fetchApprovals(filters.value);
};

const filterValues = reactive({
  search: "",
  status: "",
  period: null as [Date, Date] | null,
});

const filterConfig = [
  {
    type: "search" as const,
    key: "search",
    placeholder: "Search approval requests",
  },
  {
    type: "select" as const,
    key: "status",
    options: ["Completed", "Pending", "Failed"],
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

const approvalStats = ref<{ title: string; value: string }[]>([
  { title: "Total Requests", value: "-" },
  { title: "Completed", value: "-" },
  { title: "Pending", value: "-" },
  { title: "Failed", value: "-" },
]);

const fmtStartISO = (d: Date) => d.toISOString().replace(/\.\d+Z$/, "Z");
const fmtEndISO = (d: Date) => {
  const end = new Date(d);
  end.setHours(23, 59, 59, 0);
  return end.toISOString().replace(/\.\d+Z$/, "Z");
};

const dummyApprovalRequests = [
  {
    id: "FND-001",
    created_at: new Date().toISOString(),
    amount: 1500000,
    currency: "NGN",
    status: "pending",
    type: "funding",
    name: "Tech-village Inc",
    reference: "REF-ABC-001",
    accountNumber: "234567890",
    bankName: "GTB",
    accountName: "Tech-village Inc",
    isDummy: true,
  },
  {
    id: "WTH-001",
    created_at: new Date().toISOString(),
    amount: 850000,
    currency: "NGN",
    status: "pending",
    type: "withdrawal",
    name: "Luna Cosmetics",
    reference: "REF-WTH-001",
    accountNumber: "9876543210",
    bankName: "Access Bank",
    accountName: "Luna Cosmetics Ltd",
    isDummy: true,
  },
  {
    id: "FND-002",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    amount: 2500000,
    currency: "NGN",
    status: "successful",
    type: "funding",
    name: "BizMart Africa",
    reference: "REF-ABC-002",
    accountNumber: "234567891",
    bankName: "GTB",
    accountName: "BizMart Africa",
    isDummy: true,
  },
  {
    id: "WTH-002",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    amount: 1200000,
    currency: "GHS",
    status: "successful",
    type: "withdrawal",
    name: "GreenLeaf Ventures",
    reference: "REF-WTH-002",
    accountNumber: "1234567890",
    bankName: "Ecobank",
    accountName: "GreenLeaf Ventures",
    isDummy: true,
  },
  {
    id: "FND-003",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    amount: 750000,
    currency: "GHS",
    status: "failed",
    type: "funding",
    name: "GreenLeaf Ventures",
    reference: "REF-ABC-003",
    accountNumber: "234567892",
    bankName: "GTB",
    accountName: "GreenLeaf Ventures",
    isDummy: true,
  },
  {
    id: "WTH-003",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    amount: 450000,
    currency: "NGN",
    status: "pending",
    type: "withdrawal",
    name: "Swift Logistics",
    reference: "REF-WTH-003",
    accountNumber: "5678912340",
    bankName: "First Bank",
    accountName: "Swift Logistics Ltd",
    isDummy: true,
  },
];

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date", slug: "date_created" },
  { title: "Merchant", slug: "merchant" },
  { title: "Amount", slug: "amount" },
  { title: "Status", slug: "status" },
  { title: "Reference", slug: "reference" },
  { title: "", slug: "action" },
]);

const filters = computed(() => {
  const base = `?page=${page.value}&status=${filterValues.status}&from=${filterValues.period ? fmtStartISO(filterValues.period[0]) : ""}&to=${filterValues.period ? fmtEndISO(filterValues.period[1]) : ""}&search=${filterValues.search.toLocaleLowerCase().trim()}`;
  return base;
});

const getDateCreated = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const normalizeApprovalRequest = (data: any) => {
  return {
    id: data?.uuid || data?.id,
    amount: data?.amount ? formatNumber(Number(data?.amount)) : "-",
    currency: data?.currency,
    status: capitalizeFirstLetter(
      (data?.status || "-").toString().toLowerCase(),
    ),
    date: data?.created_at ? getDateCreated(data?.created_at) : "-",
    merchantName: data?.name,
    merchantId: data?.merchant_id || data?.business_id || data?.uuid,
    reference: data?.reference,
    accountNumber: data?.accountNumber || data?.account_number || "",
    bankName: data?.bankName || data?.bank_name || "",
    accountName: data?.accountName || data?.account_name || "",
    isFunding: data?.type === "funding",
    isDummy: data?.isDummy || false,
  };
};

const normalizeWithdrawalRequest = (data: any) => {
  return {
    uuid: data?.uuid,
    id: data?.id || data?.reference || "",
    amount: data?.amount ? formatNumber(data.amount) : "-",
    currency: data?.currency || "",
    status: capitalizeFirstLetter(
      (data?.status || "-").toString().toLowerCase(),
    ),
    date: data?.created_at ? getDateCreated(data.created_at) : "-",
    merchantName: data?.name || "-",
    merchantId: data?.id || "",
    reference: data?.reference || "-",
    accountNumber: data?.account_number || "",
    narration: data?.narration || "",
    isFunding: false,
  };
};

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
          description: "The withdrawal request has been updated successfully.",
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
        comment:
          action === "approve"
            ? "Request confirmed by admin"
            : "Approval request rejected",
      }),
    alertHandler: {
      200: {
        message:
          action === "approve"
            ? "Approval request approved"
            : "Approval request rejected",
        description: "The approval request has been updated successfully.",
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
      merchant: request.merchantName,
      amount: getBoldTableText(`${request.currency} ${request.amount}`.trim()),
      status: getStatus(mapStatusKey(data.status), request.status),
      reference: request.reference,
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
      merchant: request.merchantName,
      amount: getBoldTableText(
        `${data.currency} ${formatNumber(data.amount)}`,
      ),
      status: getStatus(mapStatusKey(data.status), request.status),
      reference: request.reference,
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

const mapStatusKey = (status: string) => {
  const s = (status || "").toLowerCase();
  if (s === "completed" || s === "successful") return "successful";
  if (s === "failed" || s === "rejected") return "failed";
  return "pending";
};

const computeApprovalStats = (response: any) => {
  const transactions = response?.data?.wallet_fundings || [];
  const completed = transactions.filter(
    (t: any) => t.status === "successful" || t.status === "completed",
  ).length;
  const pending = transactions.filter(
    (t: any) => t.status === "pending",
  ).length;
  const failed = transactions.filter((t: any) => t.status === "failed").length;
  const total = transactions.length;

  approvalStats.value = [
    { title: "Total Funding Requests", value: total.toLocaleString() },
    { title: "Funding Completed", value: completed.toLocaleString() },
    { title: "Funding Pending", value: pending.toLocaleString() },
    { title: "Funding Failed", value: failed.toLocaleString() },
  ];
};

const computeWithdrawalStats = (response: any) => {
  const transactions = response?.data?.transactions || [];
  const completed = transactions.filter(
    (t: any) => t.status === "successful" || t.status === "Completed",
  ).length;
  const pending = transactions.filter(
    (t: any) => t.status === "pending",
  ).length;
  const failed = transactions.filter(
    (t: any) => t.status === "failed",
  ).length;
  const total = transactions.length;

  approvalStats.value = [
    { title: "Total Withdrawal Requests", value: total.toLocaleString() },
    { title: "Withdrawal Completed", value: completed.toLocaleString() },
    { title: "Withdrawal Pending", value: pending.toLocaleString() },
    { title: "Withdrawal Failed", value: failed.toLocaleString() },
  ];
};

const fetchFundingRequests = async (filters: string) => {
  isLoading.value = true;

  const response = await processAPIRequest({
    action: getAllApprovals,
    payload: { filters, page: page.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code === 200 && response.data?.wallet_fundings?.length) {
    computeApprovalStats(response);
    buildApprovalTableRows(response.data.wallet_fundings);
    tablePaging.value = response?.pagination?.[0] || {};
  } else {
    buildApprovalTableRows(dummyApprovalRequests);
  }
};

const fetchWithdrawalRequests = async (filters: string) => {
  isLoading.value = true;

  const response = await processAPIRequest({
    action: getAllWithdrawalRequests,
    payload: { filters, page: page.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    computeWithdrawalStats(response);
    buildWithdrawalTableRows(response.data.transactions);
    tablePaging.value = response.pagination[0];
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
</script>

<style scoped lang="scss">
.tab-btn {
  @apply text-sm font-medium text-grey-700 px-4 py-2 rounded-md transition duration-200 ease-in-out border-0 cursor-pointer bg-transparent;
}

.tab-btn--active {
  @apply bg-white text-teal-800;
}
</style>
