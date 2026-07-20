<template>
  <PageContentWrapper
    description="Aggregators onboarded on your platform, click on an aggregator to view details and compliance status"
    :showTitle="true"
    pageDescription="All Aggregators"
    @updatePage="(currentPage: number) => (page = currentPage)"
    :pagingData="tablePaging"
  >
    <template #pageContent>
      <section class="flex flex-col gap-7">
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
            title: 'No aggregators yet!',
            description: 'You can start by adding a new aggregator.',
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
import { ref, h, computed, reactive } from "vue";
import { TableHeaderType } from "@packages/models";
import {
  useDate,
  useString,
  useEvents,
  useAutoFetch,
  useDateFilter,
} from "@packages/hooks";
import { useAggregatorStore } from "@/modules/aggregators/store";
import {
  TableDoubleColumn,
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
  FilterBar,
} from "@packages/uikit";

import { useRouter } from "vue-router";

const { getStatus, getBoldTableText } = useString();
const { processAPIRequest } = useEvents();
const { getAggregators } = useAggregatorStore();
const router = useRouter();

const isLoading = ref(true);
const page = ref(1);

const filterValues = reactive({
  search: "",
  status: "",
  period: null as [Date, Date] | null,
});

const filterConfig = [
  { type: "search" as const, key: "search", placeholder: "Search" },
  {
    type: "select" as const,
    key: "status",
    options: ["verified", "pending", "rejected"],
    placeholder: "Status",
  },
  { type: "date" as const, key: "period" },
];

const { onDateSelected } = useDateFilter();

const onFilterChange = ({ key, value }: { key: string; value: any }) => {
  if (key === "period") {
    onDateSelected(value);
    filterValues.period = value;
  } else {
    (filterValues as any)[key] = value;
  }
  if (key !== "search") page.value = 1;
};

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});

const filters = computed(
  () =>
    `?page=${page.value}&status=${filterValues.status}&from=${filterValues.period ? filterValues.period[0].toISOString().split("T")[0] : ""}&to=${filterValues.period ? filterValues.period[1].toISOString().split("T")[0] : ""}&search=${filterValues.search}`,
);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date added", slug: "date_created" },
  { title: "Business name", slug: "business" },
  { title: "Business ID", slug: "id" },
  { title: "Email", slug: "email" },
  { title: "No. of merchants", slug: "merchant_count" },
  { title: "Status", slug: "status" },
]);

const dummyTableBody = [
  {
    date_created: "Mon, 12 May, 2025",
    business: "Acme Corp",
    id: "ACM-00123",
    email: "contact@acmecorp.com",
    merchant_count: 3,
    status: getStatus("verified", "verified"),
  },
  {
    business: "Acme Corp",
    date_created: "Mon, 12 May, 2025",
    id: "ACM-00123",
    email: "contact@acmecorp.com",
    merchant_count: 5,
    status: getStatus("verified", "verified"),
  },
  {
    business: "Acme Corp",
    date_created: "Mon, 12 May, 2025",
    id: "ACM-00123",
    email: "contact@acmecorp.com",
    merchant_count: 5,
    status: getStatus("rejected", "rejected"),
  },
];

const getDateAdded = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const fetchAggregators = async (filters: string) => {
  tableBody.value.push(...dummyTableBody);

  const response = await processAPIRequest({
    action: getAggregators,
    payload: { page: page.value, filters },
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

        business: getBoldTableText(data.business_name),
        id: data.business_id,
        email: data.email,
        merchant_count: data.merchant_count,
        status: getStatus(data.status, data.status),
      };
    });

    tablePaging.value = response.pagination[0] || {};
  }
};

const handleTableClicked = (id: string) => {
  router.push(`/aggregators/${id}`);
};

useAutoFetch(filters, fetchAggregators);
</script>

<style lang="scss" scoped>
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
