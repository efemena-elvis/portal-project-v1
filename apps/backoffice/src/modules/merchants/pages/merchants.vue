<template>
  <PageContentWrapper
    description="Merchants onboarded on your platform, click on a merchant to view details and compliance status"
    :showTitle="true"
    pageDescription="All Merchants"
    @updatePage="(currentPage: number) => (page = currentPage)"
    :pagingData="tablePaging"
  >
    <template #pageContent>
      <section class="flex flex-col gap-7">
        <div class="flex flex-wrap items-center gap-8 mt-8">
          <StatsCard
            v-for="stat in merchantStats"
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
import { ref, h, computed, reactive } from "vue";
import { TableHeaderType } from "@packages/models";
import { useDate, useString, useEvents, useAutoFetch } from "@packages/hooks";
import { useMerchantStore } from "@/modules/merchants/store";
import {
  TableDoubleColumn,
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
  FilterBar,
  StatsCard,
} from "@packages/uikit";

import { useRouter } from "vue-router";

const { getStatus, getBoldTableText } = useString();
const { processAPIRequest } = useEvents();
const { getMerchants } = useMerchantStore();
const router = useRouter();

const isLoading = ref(true);
const page = ref(1);

const filterValues = reactive({
  search: "",
  status: "",
  period: null as [Date, Date] | null,
});

const filterConfig = [
  {
    type: "search" as const,
    key: "search",
    placeholder: "Search merchants by email",
  },
  {
    type: "select" as const,
    key: "status",
    options: ["Active", "Pending", "Deactivated"],
    placeholder: "Status",
  },
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
  if (key !== "search") page.value = 1;
};

const merchantStats = ref<any[]>([]);

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});

const filters = computed(
  () =>
    `?page=${page.value}&status=${filterValues.status}&from=${filterValues.period ? filterValues.period[0].toISOString().split("T")[0] : ""}&to=${filterValues.period ? filterValues.period[1].toISOString().split("T")[0] : ""}&email=${filterValues.search}`,
);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date added", slug: "date_created" },
  { title: "Business name", slug: "business" },
  { title: "Business ID", slug: "id" },
  { title: "Email", slug: "email" },
  { title: "Status", slug: "status" },
]);

const getDateAdded = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const fetchMerchants = async (filters: string) => {
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
    const {
      merchants,
      total_records,
      page: currentPage,
      page_size,
    } = response.data;

    // Update merchant stats
    merchantStats.value = [
      { title: "Number of Merchants", value: total_records.toString() },
    ];

    tableBody.value = merchants.map((data: any) => {
      const businessName =
        data.first_name && data.last_name
          ? `${data.first_name} ${data.last_name}`
          : data.first_name || data.last_name || "-";

      return {
        date_created: h(TableDoubleColumn, {
          entry: {
            primaryText: getDateAdded(data.created_at),
            secondaryText: useDate.formatTime(data.created_at),
          },
        }),

        business: getBoldTableText(businessName),
        id: data.uuid,
        email: data.email,
        status: getStatus(
          data.is_active ? "successful" : "failed",
          data.is_active ? "active" : "deactivated",
        ),
      };
    });

    tablePaging.value = {
      current_page: currentPage,
      page_count: merchants.length,
      total_pages_count: Math.ceil(total_records / page_size),
    };
  }
};

const handleTableClicked = (id: string) => {
  router.push({ path: `/merchant/${id}` });
};

useAutoFetch(filters, fetchMerchants);
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
