<template>
  <PageContentWrapper
    description="All withdrawal requests initiated on your platform"
    :showTitle="true"
    pageDescription="All Withdrawal Requests"
    @updatePage="(currentPage) => (page = currentPage)"
    :pagingData="tablePaging"
  >
    <template #pageContent>
      <section class="flex flex-col gap-7">
        <div class="flex flex-wrap items-center gap-8 mt-8">
          <StatsCard
            v-for="stat in withdrawalStats"
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
            title: 'No withdrawal request initiated yet',
            description:
              'You don\'t have any withdrawal requests yet. This is where you\'ll be able to see all your initiated withdrawal requests.',
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
    title="Withdrawal Request"
    :request="selectedRequest"
    @closeTriggered="closeRequestModal"
    @approve="handleAction('approve')"
    @reject="handleAction('reject')"
    @goToMerchant="goToMerchantDashboard"
  />
</template>

<script setup lang="ts">
import { ref, computed, h, reactive } from "vue";
import { useRouter } from "vue-router";
import { useString, useEvents, useDate, useAutoFetch } from "@packages/hooks";
import { useBalanceStore } from "@/modules/balances/store";
import { TableHeaderType } from "@packages/models";
import {
  FilterBar,
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
  TableDoubleColumn,
  StatsCard,
} from "@packages/uikit";
import RequestDetailModal from "@/modules/balances/modals/request-detail-modal.vue";


const { getBoldTableText, formatNumber, getStatus, capitalizeFirstLetter } =
  useString();
const { getAllWithdrawalRequests, decideWithdrawalRequest } = useBalanceStore();
const { processAPIRequest, pushToastAlert } = useEvents();
const router = useRouter();

const isLoading = ref(true);
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
    placeholder: "Search withdrawal requests",
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
  page.value = 1;
};

const fmtStartISO = (d: Date) => d.toISOString().replace(/\.\d+Z$/, "Z");
const fmtEndISO = (d: Date) => {
  const end = new Date(d);
  end.setHours(23, 59, 59, 0);
  return end.toISOString().replace(/\.\d+Z$/, "Z");
};

const withdrawalStats = ref<{ title: string; value: string }[]>([
  { title: "Total Requests", value: "-" },
  { title: "Completed", value: "-" },
  { title: "Pending", value: "-" },
  { title: "Failed", value: "-" },
]);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date", slug: "date_created" },
  { title: "Merchant", slug: "name" },
  { title: "Amount", slug: "amount_requested" },
  { title: "Status", slug: "status" },
  { title: "Reference", slug: "reference" },
  { title: "", slug: "action" },
]);

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});
const page = ref(1);

const filters = computed(
  () =>
    `?page=${page.value}&status=${filterValues.status}&from=${filterValues.period ? fmtStartISO(filterValues.period[0]) : ""}&to=${filterValues.period ? fmtEndISO(filterValues.period[1]) : ""}&search=${filterValues.search}`,
);

const getDateCreated = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const getMerchantId = (data: any) => {
  return data?.id || "";
};

const getMerchantName = (data: any) => {
  return data?.name || "-";
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
    merchantName: getMerchantName(data),
    merchantId: getMerchantId(data),
    reference: data?.reference || "-",
    accountNumber: data?.account_number || "",
    narration: data?.narration || "",
  };
};

const openRequestModal = (request: any) => {
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

const handleAction = async (action: "approve" | "reject") => {
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
    fetchWithdrawalRequests(filters.value);
  } else {
    pushToastAlert({
      message:
        response?.error?.message || "Unable to complete action",
      type: "error",
    });
  }
};





    const computeWithdrawalStats = (response: any) => {
      const transactions = response?.data?.transactions || []
      const completed = transactions.filter(
        (t: any) => t.status === "successful" || t.status === "Completed",
      ).length
      const pending = transactions.filter(
        (t: any) => t.status === "pending",
      ).length
      const failed = transactions.filter(
        (t: any) => t.status === "failed",
      ).length
      const total = transactions.length

      withdrawalStats.value = [
        { title: "Total Requests", value: total.toLocaleString() },
        { title: "Completed", value: completed.toLocaleString() },
        { title: "Pending", value: pending.toLocaleString() },
        { title: "Failed", value: failed.toLocaleString() },
      ]
    }

    const fetchWithdrawalRequests = async (filters: string) => {
      isLoading.value = true;
      tablePaging.value.current_page = page.value;
      const response = await processAPIRequest({
        action: getAllWithdrawalRequests,
        payload: { filters, page: page.value },
        showAlert: false,
      });

      isLoading.value = false;

      if (response.code === 200) {
        computeWithdrawalStats(response)
        tableBody.value = response.data.transactions.map((data: any) => {
      const formattedAmount = `${data.currency} ${formatNumber(data.amount)}`;
      const createdDate = new Date(data.created_at);
      const request = normalizeWithdrawalRequest(data);

      return {
        date_created: h(TableDoubleColumn, {
          entry: {
            primaryText: getDateCreated(data.created_at),
            secondaryText: useDate.formatTime(data.created_at),
          },
        }),
        name: request.merchantName,
        amount_requested: getBoldTableText(
          `${data.currency} ${formatNumber(data.amount)}`,
        ),
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

        status: getStatus(
          data.status === "completed" ? "successful" : data.status,
          data.status === "completed" ? "Successful" : data.status,
        ),
        reference: request.reference,
        reason_for_failure: capitalizeFirstLetter(
          (data.reason_for_failure || "-").toString().toLowerCase(),
        ),

        raw: {
          date_created: `${getDateCreated(data.created_at)} - ${useDate.formatTime(data.created_at)}`,
          raw_date: createdDate,
          amount: formattedAmount,
          status: data.status ?? "-",
          reason_for_failure: capitalizeFirstLetter(
            (data.reason_for_failure || "-").toString().toLowerCase(),
          ),

          reference: data.reference ?? "-",
          currency: data.currency,
          name: data.name,
          id: data.id,
        },
      };
    });

    tablePaging.value = response.pagination[0];
  }
};

useAutoFetch(filters, fetchWithdrawalRequests);
</script>
