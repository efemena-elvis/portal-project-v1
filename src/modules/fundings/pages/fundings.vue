<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <PageContentWrapper
    description="Manage funding and capital"
    :showTitle="true"
    pageDescription="All Funding Requests"
    :pagingData="tablePaging"
    @updatePage="(currentPage) => (page = currentPage)"
  >
    <template #pageContent>
      <section class="flex flex-col gap-7">
        <div class="flex flex-wrap items-center gap-8 mt-8">
          <StatsCard
            v-for="stat in fundingStats"
            :key="stat.title"
            :title="stat.title"
            :value="stat.value"
          />
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
            title: 'No funding requests yet',
            description:
              'Funding requests will appear here once they are available.',
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
    title="Funding Request"
    :request="selectedRequest"
    @closeTriggered="closeRequestModal"
    @approve="handleFundingAction('approve')"
    @reject="handleFundingAction('reject')"
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
import { useFundingStore } from "@/modules/fundings/store";
import RequestDetailModal from "@/modules/balances/modals/request-detail-modal.vue";

const { getAllFundings, verifyFunding } = useFundingStore();
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

const filterValues = reactive({
  search: "",
  status: "",
  period: null as [Date, Date] | null,
});

const filterConfig = [
  {
    type: "search" as const,
    key: "search",
    placeholder: "Search funding requests",
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

const fundingStats = ref<{ title: string; value: string }[]>([
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

const dummyFundingRequests = [
  {
    id: "FND-001",
    created_at: new Date().toISOString(),
    amount: 1500000,
    currency: "NGN",
    status: "pending",
    name: "Tech-village Inc",
    reference: "REF-ABC-001",
    accountNumber: "234567890",
    bankName: "GTB",
    accountName: "Tech-village Inc",
    isDummy: true,
  },
  {
    id: "FND-002",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    amount: 2500000,
    currency: "NGN",
    status: "successful",
    name: "BizMart Africa",
    reference: "REF-ABC-002",
    accountNumber: "234567890",
    bankName: "GTB",
    accountName: "Tech-village Inc",
    isDummy: true,
  },
  {
    id: "FND-003",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    amount: 750000,
    currency: "GHS",
    status: "pending",
    name: "GreenLeaf Ventures",
    reference: "REF-ABC-003",
    accountNumber: "234567890",
    bankName: "GTB",
    accountName: "Tech-village Inc",
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

const filters = computed(
  () =>
    `?page=${page.value}&status=${filterValues.status}&from=${filterValues.period ? fmtStartISO(filterValues.period[0]) : ""}&to=${filterValues.period ? fmtEndISO(filterValues.period[1]) : ""}&search=${filterValues.search.toLocaleLowerCase().trim()}`,
);

const getDateCreated = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const normalizeFundingRequest = (data: any) => {
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
    isDummy: data?.isDummy || false,
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

const handleFundingAction = async (action: "approve" | "reject") => {
  const uuid = selectedRequest.value?.id;
  if (!uuid) {
    pushToastAlert({
      message: "Unable to complete action",
      description: "Funding request information is not available.",
      type: "error",
    });
    return;
  }

  const response = await processAPIRequest({
    action: () =>
      verifyFunding({
        uuid,
        comment:
          action === "approve"
            ? "Payment confirmed by admin"
            : "Funding request rejected",
      }),
    alertHandler: {
      200: {
        message:
          action === "approve"
            ? "Funding request approved"
            : "Funding request rejected",
        description: "The funding request has been updated successfully.",
        type: "success",
      },
    },
  });

  if (response?.code === 200 || response?.code === 201) {
    closeRequestModal();
    fetchFundings(filters.value);
  } else {
    pushToastAlert({
      message: response?.error?.message || "Unable to complete action",
      type: "error",
    });
  }
};

const buildFundingTableRows = (requests: any[]) => {
  tableBody.value = requests.map((data: any) => {
    const request = normalizeFundingRequest(data);
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
      status: getStatus(
        data.status || request.status,
        data.status || request.status,
      ),
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

const computeFundingStats = (response: any) => {
  const transactions = response?.data?.wallet_fundings || [];
  const completed = transactions.filter(
    (t: any) => t.status === "successful" || t.status === "completed",
  ).length;
  const pending = transactions.filter(
    (t: any) => t.status === "pending",
  ).length;
  const failed = transactions.filter((t: any) => t.status === "failed").length;
  const total = transactions.length;

  fundingStats.value = [
    { title: "Total Requests", value: total.toLocaleString() },
    { title: "Completed", value: completed.toLocaleString() },
    { title: "Pending", value: pending.toLocaleString() },
    { title: "Failed", value: failed.toLocaleString() },
  ];
};

const fetchFundings = async (filters: string) => {
  isLoading.value = true;

  const response = await processAPIRequest({
    action: getAllFundings,
    payload: { filters, page: page.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code === 200 && response.data?.wallet_fundings?.length) {
    computeFundingStats(response);
    buildFundingTableRows(response.data.wallet_fundings);
    tablePaging.value = response?.pagination?.[0] || {};
  } else {
    buildFundingTableRows(dummyFundingRequests);
  }
};

useAutoFetch(filters, fetchFundings);
</script>
