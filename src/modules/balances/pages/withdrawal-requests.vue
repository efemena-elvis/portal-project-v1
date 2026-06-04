<template>
  <PageContentWrapper
    description="All withdrawal requests initiated on your platform"
    :showTitle="true"
    pageDescription="All Withdrawal Requests"
    @updatePage="(currentPage) => (page = currentPage)"
    :pagingData="tablePaging"
    @searchEntered="processSearchEntry"
  >
    <template #pageContent>
      <section class="flex flex-col gap-7">
        <div class="withdrawal-stats">
          <div
            v-for="stat in withdrawalStats"
            :key="stat.title"
            class="withdrawal-stat-card"
          >
            <p>{{ stat.title }}</p>
            <strong>{{ stat.value }}</strong>
          </div>
        </div>

        <div class="flex flex-wrap justify-between gap-6 items-start">
          <div class="flex justify-start items-center gap-4 w-full">
            <div class="relative w-[20%]">
              <div
                class="absolute left-4 top-1/2 -translate-y-1/2 text-grey-700 icon icon-search-normal"
              ></div>
              <input
                v-model="searchQuery"
                type="search"
                class="w-full rounded-lg border border-grey-200 bg-white py-4 pl-12 pr-4 text-sm text-grey-900 shadow-sm outline-none transition duration-200 ease-in-out"
                placeholder="Search withdrawal requests"
                aria-label="Search withdrawal requests"
              />
            </div>
            <div
              class="relative text-sm font-semibold text-teal-800 border rounded-lg cursor-pointer filter-select bg-white"
            >
              <select
                v-model="selectedStatus"
                class="w-[180px] p-4 bg-transparent appearance-none focus:outline-none"
              >
                <option value="">Status</option>
                <option
                  v-for="(status, index) in statusOptions"
                  :key="index"
                  :value="status.toLowerCase()"
                >
                  {{ status }}
                </option>
              </select>
              <div
                class="absolute text-[16px] text-teal-800 -translate-y-1/2 pointer-events-none icon icon-caret-down right-4 top-1/2"
              ></div>
            </div>
            <DatePicker
              filterSize="lg"
              :activePeriod="activePeriod"
              @onFilterSelected="processFilterSelection"
            />
            <!-- <button
              @click="exportToExcel"
              class="w-48 p-4 text-sm font-semibold text-teal-800 transition-all duration-200 border rounded-lg sm:w-1/2 hover:bg-teal-50 bg-white"
            >
              Export
            </button> -->
          </div>
        </div>
        <TableContainer
          :tableHeader="tableHeader"
          :tableBody="tableBody"
          :isLoading="isLoading"
          @onActionClicked="toggleInitiatePayoutModal"
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
    @approve="handlePayoutAction('approve')"
    @reject="handlePayoutAction('reject')"
    @goToMerchant="goToMerchantDashboard"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h, watch } from "vue";
import { useRouter } from "vue-router";
import { useString, useEvents, useDate } from "@packages/hooks";
import { useBalanceStore } from "@/modules/balances/store";
import { useMerchantStore } from "@/modules/merchants/store";
import { TableHeaderType } from "@packages/models";
import {
  DatePicker,
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
  TableDoubleColumn,
} from "@packages/uikit";
import RequestDetailModal from "@/modules/balances/modals/request-detail-modal.vue";
import * as XLSX from "xlsx";

const { getBoldTableText, formatNumber, getStatus, capitalizeFirstLetter } =
  useString();
const { getPayouts, fetchAllPayouts } = useBalanceStore();
const { approveMerchantPayoutRequest, rejectMerchantPayoutRequest } =
  useMerchantStore();
const { processAPIRequest, pushToastAlert } = useEvents();
const router = useRouter();

const isLoading = ref(true);
const showInitiatePayoutModal = ref(false);
const showRequestModal = ref(false);
const selectedRequest = ref<any | null>(null);
const searchQuery = ref("");
const selectedStatus = ref("");
const statusOptions = ["Successful", "Pending", "Failed"];
const activePeriod = ref<[Date, Date] | null>(null);

const processSearchEntry = (searchValue: string) => {
  searchQuery.value = searchValue.toLocaleLowerCase().trim();
};

const toggleInitiatePayoutModal = () => {
  showInitiatePayoutModal.value = !showInitiatePayoutModal.value;
};

const withdrawalStats = [
  {
    title: "New request / Pending",
    value: "20",
  },
  {
    title: "Completed",
    value: "5200",
  },
];

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date", slug: "date_created" },
  { title: "Merchant", slug: "name" },
  { title: "Amount", slug: "amount" },
  { title: "Status", slug: "status" },
  { title: "Reference", slug: "reference" },
  { title: "", slug: "action" },
]);

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});
const page = ref(1);

const filters = computed(
  () =>
    `?page=${page.value}&status=${selectedStatus.value}&from=${activePeriod.value ? activePeriod.value[0].toISOString().split("T")[0] : ""}&to=${activePeriod.value ? activePeriod.value[1].toISOString().split("T")[0] : ""}&search=${searchQuery.value}`,
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

const normalizePayoutRequest = (data: any) => {
  return {
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

const handlePayoutAction = async (action: "approve" | "reject") => {
  const merchantId = selectedRequest.value?.merchantId;

  if (!merchantId) {
    pushToastAlert({
      message: "Unable to complete action",
      description: "Merchant information is not available for this request.",
      type: "error",
    });
    return;
  }

  const response = await processAPIRequest({
    action: async () =>
      action === "approve"
        ? approveMerchantPayoutRequest(merchantId)
        : rejectMerchantPayoutRequest(merchantId),
    alertHandler: {
      200: {
        message:
          action === "approve"
            ? "Payout request approved"
            : "Payout request rejected",
        description: "The payout request has been updated successfully.",
        type: "success",
      },
      400: {
        message: "Unable to complete action",
        type: "error",
      },
      404: {
        message: "Merchant not found",
        description: "Please refresh the page and try again.",
        type: "error",
      },
    },
  });

  if (response?.code === 200 || response?.code === 201) {
    closeRequestModal();
    fetchPayouts(filters.value);
  }
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
  selectedRange: [Date | string, Date | string],
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

const fetchPayouts = async (filters: string) => {
  isLoading.value = true;
  tablePaging.value.current_page = page.value;
  const response = await processAPIRequest({
    action: getPayouts,
    payload: { filters, page: page.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.value = response.data.map((data: any) => {
      const formattedAmount = `${data.currency} ${formatNumber(data.amount)}`;
      const createdDate = new Date(data.created_at);
      const request = normalizePayoutRequest(data);

      return {
        date_created: h(TableDoubleColumn, {
          entry: {
            primaryText: getDateCreated(data.created_at),
            secondaryText: useDate.formatTime(data.created_at),
          },
        }),
        merchant: request.merchantName,
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

        status: getStatus(data.status, data.status),
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

const fetchAllPayoutPages = async () => {
  let page = 1;
  const all: any[] = [];
  let totalPages = 1;

  do {
    const response = await processAPIRequest({
      action: fetchAllPayouts,
      payload: { page },
      showAlert: false,
    });

    if (response?.code !== 200) break;

    const mapped = response.data.map((data: any) => {
      return {
        date_created: `${getDateCreated(data.created_at)} - ${useDate.formatTime(data.created_at)}`,
        raw_date: new Date(data.created_at),
        amount: `${formatNumber(data.amount)}`,
        status: data.status ?? "-",
        reason_for_failure: capitalizeFirstLetter(
          (data.reason_for_failure || "-").toString().toLowerCase(),
        ),

        reference: data.reference ?? "-",
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
  const allPayouts = await fetchAllPayoutPages();

  const filtered = allPayouts.filter((tx) => {
    const status = tx.status.toLowerCase();
    const date = tx.raw_date ? new Date(tx.raw_date) : null;

    const matchesStatus = selectedStatus.value
      ? status === selectedStatus.value
      : true;
    const matchesDate = date ? isWithinRange(date, activePeriod.value) : true;

    return matchesStatus && matchesDate;
  });

  const cleanData = filtered.map((tx) => ({
    "Date Created": tx.date_created,
    Currency: tx.currency,
    Amount: tx.amount || "-",
    Status: tx.status,
    Reason: tx.reason_for_failure || "-",
    Reference: tx.reference,
  }));

  const worksheet = XLSX.utils.json_to_sheet(cleanData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Merchant Payouts");
  XLSX.writeFile(workbook, "Merchant_Payouts.xlsx");
};

watch([selectedStatus, activePeriod, searchQuery], () => {
  page.value = 1;
});

watch(filters, (newFilters) => {
  fetchPayouts(newFilters);
});

onMounted(() => fetchPayouts(filters.value));
</script>

<style scoped lang="scss">
.withdrawal-stats {
  @apply flex flex-wrap items-center gap-8;
}

.withdrawal-stat-card {
  @apply flex h-[124px] w-[370px] bg-[#f6faf9] flex-col justify-center rounded-lg  px-8 sm:w-full;

  p {
    @apply mb-4 text-base font-medium text-grey-800;
  }

  strong {
    @apply text-[30px] font-bold leading-none text-grey-900;
  }
}
</style>
