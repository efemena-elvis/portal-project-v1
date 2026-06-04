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
        <div class="funding-stats">
          <div
            v-for="stat in fundingStats"
            :key="stat.title"
            class="funding-stat-card"
          >
            <p>{{ stat.title }}</p>
            <strong>{{ stat.value }}</strong>
          </div>
        </div>


        <div class="flex flex-wrap items-center gap-4">
          <div class="relative w-[20%]">
            <div
              class="absolute left-4 top-1/2 -translate-y-1/2 text-grey-700 icon icon-search-normal"
            ></div>
            <input
              v-model="searchQuery"
              type="search"
              class="w-full rounded-lg border border-grey-200 bg-white py-4 pl-12 pr-4 text-sm text-grey-900 shadow-sm outline-none transition duration-200 ease-in-out"
              placeholder="Search funding requests"
              aria-label="Search funding requests"
            />
          </div>

          <div class="flex flex-wrap items-center gap-4 sm:w-full">
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
          </div>
        </div>

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
    @approve="handleUnavailableFundingAction"
    @reject="handleUnavailableFundingAction"
    @goToMerchant="goToMerchantDashboard"
  />
</template>

<script lang="ts" setup>
import { computed, h, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useDate, useEvents, useString } from "@packages/hooks";
import {
  PageContentWrapper,
  TableContainer,
  TableContainerBody,
  TableDoubleColumn,
  DatePicker,
} from "@packages/uikit";
import { TableHeaderType } from "@packages/models";
import { useFundingStore } from "@/modules/funding/store";
import RequestDetailModal from "@/modules/balances/modals/request-detail-modal.vue";

const { getFunding, getSingleFunding } = useFundingStore();
const { processAPIRequest, pushToastAlert } = useEvents();
const { formatNumber, getBoldTableText, getStatus, capitalizeFirstLetter } =
  useString();
const router = useRouter();

const isLoading = ref(true);
const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});
const page = ref(1);
const searchQuery = ref("");
const activePeriod = ref<[Date, Date] | null>(null);
const showRequestModal = ref(false);
const selectedRequest = ref<any | null>(null);


const fundingStats = [
  { title: "New request / Pending", value: "20" },
  { title: "Completed", value: "5200" },
];

const dummyFundingRequests = [
  {
    id: "FND-001",
    created_at: new Date().toISOString(),
    amount: 1500000,
    currency_code: "NGN",
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
    currency_code: "NGN",
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
    currency_code: "GHS",
    status: "pending",
    name: "GreenLeaf Ventures",
    reference: "REF-ABC-003",
    accountNumber: "234567890",
    bankName: "GTB",
    accountName: "Tech-village Inc",
    isDummy: true,
  }
];

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date", slug: "date_created" },
  { title: "Merchant", slug: "merchant" },
  { title: "Amount", slug: "amount" },
  { title: "Status", slug: "status" },
  { title: "Reference", slug: "reference" },
  { title: "", slug: "action" },
]);

const selectedStatus = ref("");
const statusOptions = ["Successful", "Pending", "Failed"];

const filters = computed(
  () =>
    `?page=${page.value}&status=${selectedStatus.value}&from=${
      activePeriod.value
        ? activePeriod.value[0].toISOString().split("T")[0]
        : ""
    }&to=${
      activePeriod.value
        ? activePeriod.value[1].toISOString().split("T")[0]
        : ""
    }&search=${searchQuery.value.toLocaleLowerCase().trim()}`,
);

const getDateCreated = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const normalizeFundingRequest = (data: any) => {
  return {
    id: data?.id,
    amount: data?.amount ? formatNumber(data?.amount) : "-",
    currency: data?.currency_code,
    status: capitalizeFirstLetter(
      (data?.status || "-").toString().toLowerCase(),
    ),
    date: data?.created_at ? getDateCreated(data?.created_at) : "-",
    merchantName: data?.name,
    merchantId: data?.id,
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

  if (!request.id || request.isDummy) return;

  const response = await processAPIRequest({
    action: async () => getSingleFunding(request.id),
    showAlert: false,
  });

  if (response?.code === 200 && response.data) {
    selectedRequest.value = normalizeFundingRequest(response.data);
  }
};

const closeRequestModal = () => {
  showRequestModal.value = false;
  selectedRequest.value = null;
};

const goToMerchantDashboard = () => {
  if (!selectedRequest.value?.merchantId) return;
  router.push(`/merchants/${selectedRequest.value.merchantId}`);
};

const handleUnavailableFundingAction = () => {
  pushToastAlert({
    message: "Funding action unavailable",
    description:
      "Approve and reject endpoints are not available for funding yet.",
    type: "error",
  });
};

const processFilterSelection = (
  selectedRange: [Date | string, Date | string],
) => {
  if (selectedRange && selectedRange.length === 2) {
    activePeriod.value = [
      new Date(selectedRange[0]),
      new Date(selectedRange[1]),
    ];
  } else {
    activePeriod.value = null;
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
      status: getStatus(data.status || request.status, data.status || request.status),
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
        "View"
      ),
      raw: request,
    };
  });
};

const fetchFunding = async (filters: string) => {
  isLoading.value = true;
  tablePaging.value.current_page = page.value;

  const response = await processAPIRequest({
    action: getFunding,
    payload: { filters, page: page.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code === 200 && response.data?.length) {
    buildFundingTableRows(response.data);
    tablePaging.value = response.pagination[0];
  } else {
    buildFundingTableRows(dummyFundingRequests);
  }
};

watch([selectedStatus, activePeriod, searchQuery], () => {
  page.value = 1;
});

watch(filters, (newFilters) => {
  fetchFunding(newFilters);
});

onMounted(() => fetchFunding(filters.value));
</script>

<style scoped lang="scss">
.funding-stats {
  @apply flex flex-wrap items-center gap-8;
}

.funding-stat-card {
  @apply flex h-[124px] w-[370px] flex-col justify-center rounded-lg bg-[#F6FAF9] px-8 sm:w-full;

  p {
    @apply mb-4 text-base font-medium text-grey-800;
  }

  strong {
    @apply text-[30px] font-bold leading-none text-grey-900;
  }
}
</style>
