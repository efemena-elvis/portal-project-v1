<template>
  <PageContentWrapper
    description="Merchants onboarded on your platform, click on a merchant to view details and compliance status"
    :showTitle="true"
    pageDescription="All Merchants"
    @updatePage="(currentPage: number) => (page = currentPage)"
    :pagingData="tablePaging"
    @searchEntered="processSearchEntry"
  >
    <template #pageContent>
      <section class="flex flex-col gap-7">
        <div class="merchant-stats">
          <div
            v-for="stat in merchantStats"
            :key="stat.title"
            class="merchant-stat-card"
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
                placeholder="Search"
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
            title: 'No merchants yet!',
            description: 'You can start by adding a new merchant.',
          }"
        >
          <TableContainerBody
            v-for="(payload, index) in tableBody"
            :key="index"
            :tableHeader="tableHeader"
            :tableData="payload"
            :onTableClicked="() => handleTableClicked(payload.id)"
          />
        </TableContainer>
      </section>
    </template>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import { ref, h, onMounted, watch, computed } from "vue";
import { TableHeaderType } from "@packages/models";
import { useDate, useString, useEvents } from "@packages/hooks";
import { useMerchantStore } from "@/modules/merchants/store";
import { TableDoubleColumn } from "@packages/uikit";

import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
  DatePicker,
} from "@packages/uikit";
import { useRouter } from "vue-router";

const { getStatus, getBoldTableText } = useString();
const { processAPIRequest } = useEvents();
const { getMerchants } = useMerchantStore();
const router = useRouter();

const isLoading = ref(true);
const selectedStatus = ref("");
const page = ref(1);
const searchQuery = ref("");
const activePeriod = ref<[Date, Date] | null>(null);

const merchantStats = [{ title: "Number of Merchants", value: "170" }];

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});

const statusOptions = ["Active", "Pending", "Deactivated"];

const processSearchEntry = (searchValue: string) => {
  searchQuery.value = searchValue.toLocaleLowerCase().trim();
};

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

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date added", slug: "date_created" },
  { title: "Business name", slug: "business" },
  { title: "Business ID", slug: "id" },
  { title: "Email", slug: "email" },
  { title: "Status", slug: "status" },
]);

const dummyTableBody = [
  {
    business: "Acme Corp",
    date_created: "Mon, 12 May, 2025",
    id: "ACM-00123",
    email: "contact@acmecorp.com",
    status: getStatus("failed", "deactivated"),
  },
  {
    business: "Acme Corp",
    date_created: "Mon, 12 May, 2025",
    id: "ACM-00123",
    email: "contact@acmecorp.com",
    status: getStatus("successful", "active"),
  },
  {
    business: "Acme Corp",
    date_created: "Mon, 12 May, 2025",
    id: "ACM-00123",
    email: "contact@acmecorp.com",
    status: getStatus("pending", "pending"),
  },
];

const getDateAdded = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const fetchMerchants = async (filters: string) => {
  tableBody.value.push(...dummyTableBody);

  const response = await processAPIRequest({
    action: getMerchants,
    payload: {
      filters,
      page: page.value,
    },
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code === 200) {
    tableBody.value = response.data.map((data: any) => {
      return {
        date_created: h(TableDoubleColumn, {
          entry: {
            primaryText: getDateAdded(data.created_at),
            secondaryText: useDate.formatTime(data.created_at),
          },
        }),

        business: getBoldTableText(data.name),
        id: data.business_id,
        email: data.email,
        status: getStatus(
          data.status === "deactivated"
            ? "failed"
            : data.status === "active"
              ? "successful"
              : "pending",
          data.status,
        ),
      };
    });

    tablePaging.value = response.pagination[0] || {};
  }
};

const handleTableClicked = (id: string) => {
  router.push(`/merchant/${id}`);
};

watch([selectedStatus, activePeriod], () => {
  page.value = 1;
});

watch(filters, (newFilters) => {
  fetchMerchants(newFilters);
});
onMounted(fetchMerchants);
</script>

<style lang="scss" scoped>
.merchant-stat-card {
  @apply flex h-[124px] w-[350px] bg-[#f6faf9] flex-col justify-center rounded-lg px-8 sm:w-full;

  p {
    @apply mb-4 text-base font-medium text-grey-800;
  }

  strong {
    @apply text-[30px] font-bold leading-none text-grey-900;
  }
}

.button-row {
  @apply flex justify-end items-center gap-x-2;

  .btn {
    @apply py-2.5 px-5 h-10;
  }
}

:deep(tbody tr td:last-child) {
  text-align: left;
}
</style>
