<template>
  <PageContentWrapper
    description="Business verification and onboarding"
    :showTitle="true"
    pageDescription="All Compliances"
    @updatePage="(currentPage: number) => (page = currentPage)"
    :pagingData="selectedTab === 'requests' ? tablePaging : { page_count: 0 }"
    @searchEntered="processSearchEntry"
  >
    <template v-slot:pageContent>
      <section class="flex flex-col gap-7">
        <div class="compliance-stats">
          <div
            v-for="stat in complianceStats"
            :key="stat.title"
            class="compliance-stat-card"
          >
            <p>{{ stat.title }}</p>
            <strong>{{ stat.value }}</strong>
          </div>
        </div>

        <!-- <div class="inline-flex bg-teal-100 w-full p-2 rounded-md">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            :class="tabButtonClass(tab.value)"
            @click="selectedTab = tab.value"
            type="button"
          >
            {{ tab.label }}
          </button>
        </div> -->

        <template v-if="selectedTab === 'requests'">
          <div class="flex flex-wrap justify-between gap-6 items-start">
            <div class="flex justify-start items-center gap-4 w-full">
              <div class="relative w-[20%]">
                <div
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-grey-700 icon icon-search-normal"
                ></div>
                <input
                  type="search"
                  class="w-full rounded-lg border border-grey-200 bg-white py-4 pl-12 pr-4 text-sm text-grey-900 shadow-sm outline-none transition duration-200 ease-in-out"
                  placeholder="Search"
                  v-model="searchQuery"
                  aria-label="Search merchants"
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
                    :value="status.toLowerCase()"
                    :key="index"
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

          <div class="w-full">
            <TableContainer
              :tableHeader="tableHeader"
              :tableBody="tableBody"
              :isLoading="isLoading"
              :emptyData="{
                title: 'All tickets have been resolved',
                description: 'Check later for new tickets.',
              }"
            >
              <TableContainerBody
                v-for="(payload, index) in tableBody"
                :key="payload.id || index"
                :tableHeader="tableHeader"
                :tableData="payload"
              />
            </TableContainer>
          </div>
        </template>
        <template v-else>
          <ComplianceConfig />
        </template>
      </section>
    </template>
  </PageContentWrapper>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, h, watch } from "vue";
import { useRouter } from "vue-router";
import { TableHeaderType } from "@packages/models";
import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
  TableDoubleColumn,
  DatePicker,
} from "@packages/uikit";
import { useString, useEvents, useDate } from "@packages/hooks";
import { usePaymentStore } from "@/modules/payments/store";
import ComplianceConfig from "../components/compliance-config.vue";

const { getStatus } = useString();
const { processAPIRequest } = useEvents();
const { getTransactions } = usePaymentStore();
const router = useRouter();

const complianceStats = [
  { title: 'Pending Approvals', value: '24' },

]

const selectedTab = ref("requests");

const tabs = [
  { label: "New Requests", value: "requests" },
  { label: "Compliance set-up", value: "setup" },
] as const;

const tabButtonClass = (tabValue: string) =>
  selectedTab.value === tabValue ? "tab-btn tab-btn--active" : "tab-btn";
const selectedStatus = ref("");
const isLoading = ref(true);
const tablePaging = ref<any>({});
const page = ref(1);
const searchQuery = ref("");
const activePeriod = ref<[Date, Date] | null>(null);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date", slug: "date" },
  { title: "Name", slug: "name" },
  { title: "Type", slug: "type" },
  { title: "Status", slug: "status" },
  { title: "", slug: "action" },
]);

const statusOptions = ["Successful", "Pending", "Failed"];

const tableBody = ref<any[]>([]);

const filters = computed(
  () =>
    `?page=${page.value}&status=${selectedStatus.value}&from=${activePeriod.value ? activePeriod.value[0].toISOString().split("T")[0] : ""}&to=${activePeriod.value ? activePeriod.value[1].toISOString().split("T")[0] : ""}&search=${searchQuery.value}`,
);

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

const processSearchEntry = (searchValue: string) => {
  searchQuery.value = searchValue.toLocaleLowerCase().trim();
};

const getDateFormatted = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const openComplianceDetails = (data: any, customerName: string) => {
  router.push({
    name: "ComplianceDetails",
    params: { id: data.id || data.reference || data.transaction_id || "new" },
    query: {
      business: data.business_name || data.business?.name || customerName,
      email: data.customer?.email || data.email || "",
      type: data.type || "Merchant",
      status: data.status || "",
      country: data.country || data.business?.country || "Ghana",
      aggregator:
        data.aggregator?.business_name ||
        data.aggregator?.name ||
        "Olamide Pro Inc",
    },
  });
};

const fetchCompliances = async (filters: string) => {
  isLoading.value = true;
  tablePaging.value.current_page = page;
  const response = await processAPIRequest({
    action: getTransactions,
    payload: { filters, page: page.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response && response.code === 200) {
    tableBody.value = response.data.map((data: any) => {
      const customerName = data.customer
        ? `${data.customer.firstname} ${data.customer.lastname}`
        : "No customer info";
      const customerEmail = data.customer ? data.customer.email : "";

      return {
        date: h(TableDoubleColumn, {
          entry: {
            primaryText: getDateFormatted(data.created_at),
            secondaryText: useDate.formatTime(data.created_at),
          },
        }),
        name: h(TableDoubleColumn, {
          entry: { primaryText: customerName, secondaryText: customerEmail },
        }),

        type: data.type,

        status: getStatus(data.status, data.status),

        action: h(
          "button",
          {
            class: "text-sm font-medium text-green-500 hover:text-teal-800",
            onClick: () => openComplianceDetails(data, customerName),
          },
          "View details",
        ),
      };
    });

    tablePaging.value = response.pagination[0] || {};
  }
};

watch([selectedStatus, activePeriod], () => {
  page.value = 1;
});

watch(filters, (newFilters) => {
  fetchCompliances(newFilters);
});

onMounted(fetchCompliances);
</script>

<style scoped>
.compliance-stat-card {
  @apply flex h-[124px] w-[350px] bg-[#f6faf9] flex-col justify-center rounded-lg px-8 sm:w-full;

  p {
    @apply mb-4 text-base font-medium text-grey-800;
  }

  strong {
    @apply text-[30px] font-bold leading-none text-grey-900;
  }
}

.tab-btn {
  @apply text-sm font-medium text-grey-700 px-4 py-2 rounded-md transition duration-200 ease-in-out border-0 cursor-pointer bg-transparent;
}
.tab-btn--active {
  @apply bg-white text-teal-800;
}
</style>
