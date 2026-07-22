<!-- eslint-disable vue/multi-word-component-names, vue/valid-define-props -->
<template>
  <section class="aggregator-merchants">
    <FilterBar
      :filters="filterConfig"
      :values="filterValues"
      variant="panel"
      @change="onFilterChange"
    />

    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="tableBody"
      :isLoading="isLoading"
      :emptyData="{
        title: 'No merchants yet',
        description: 'This aggregator has no merchants at the moment.',
      }"
    >
      <TableContainerBody
        v-for="(payload, index) in tableBody"
        :key="index"
        :tableHeader="tableHeader"
        :tableData="payload"
        :onTableClicked="() => openMerchant(payload.rawId)"
      />
    </TableContainer>
  </section>
</template>

<script setup lang="ts">
/* eslint-disable vue/valid-define-props */
import { computed, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { TableHeaderType } from "@packages/models";
import { useDate, useEvents, useString, useAutoFetch } from "@packages/hooks";
import { FilterBar, TableContainer, TableContainerBody } from "@packages/uikit";
import { useAggregatorStore } from "@/modules/aggregators/store";

const props = defineProps<{
  aggregatorId: string;
}>();

const router = useRouter();
const { getAggregatorMerchants } = useAggregatorStore();
const { processAPIRequest } = useEvents();
const { getStatus } = useString();

const isLoading = ref(true);

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
    options: ["Active", "Inactive", "Pending"],
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
};

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date Added", slug: "date_added" },
  { title: "Name", slug: "name" },
  { title: "Email", slug: "email" },
  { title: "Status", slug: "status" },
]);

const fallbackRows = [
  {
    rawId: "merchant-1",
    date_added: "Today",
    name: "ElevateHQ services",
    email: "business@email.com",
    rawStatus: "Active",
  },
  {
    rawId: "merchant-2",
    date_added: "Yesterday",
    name: "Saffron technology",
    email: "admin@digitalworld.com",
    rawStatus: "Inactive",
  },
  {
    rawId: "merchant-3",
    date_added: "August 5, 2024",
    name: "Asante limited",
    email: "support@innovatehub.com",
    rawStatus: "Active",
  },
];

const filters = computed(
  () =>
    `?status=${filterValues.status}&from=${
      filterValues.period
        ? filterValues.period[0].toISOString().split("T")[0]
        : ""
    }&to=${
      filterValues.period
        ? filterValues.period[1].toISOString().split("T")[0]
        : ""
    }&search=${filterValues.search.trim().toLowerCase()}`,
);

const formatDate = (date?: string) => {
  if (!date) return "-";
  const { m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${m3} ${d3}, ${y1}`;
};

const tableBody = ref<any[]>([]);

const mapMerchant = (merchant: Record<string, any>) => {
  const rawStatus = merchant.status || "Active";

  return {
    rawId: merchant.business_id || merchant.id || merchant.merchant_id,
    date_added:
      merchant.date_label ||
      merchant.date_added ||
      formatDate(merchant.created_at),
    name: merchant.name || "-",
    email: merchant.email || merchant.customer_email || "-",
    status: getStatus(rawStatus.toLowerCase(), rawStatus),
    rawStatus,
  };
};

const fetchMerchants = async () => {
  isLoading.value = true;

  const response = await processAPIRequest({
    action: getAggregatorMerchants,
    payload: {
      id: props.aggregatorId,
      filters: filters.value,
    },
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code === 200) {
    tableBody.value = response.data?.length
      ? response.data.map((merchant: Record<string, any>) =>
          mapMerchant(merchant),
        )
      : [];
    return;
  }

  tableBody.value = fallbackRows.map((merchant) => ({
    ...merchant,
    status: getStatus(merchant.rawStatus.toLowerCase(), merchant.rawStatus),
  }));
};

const openMerchant = (merchantId: string) => {
  if (!merchantId) return;
  router.push(`/merchant/${merchantId}`);
};

useAutoFetch(filters, fetchMerchants);
</script>

<style scoped lang="scss">
.aggregator-merchants {
  @apply flex flex-col gap-6;
}

.filters-row {
  @apply flex flex-wrap items-center gap-5;
}

.search-field {
  @apply relative w-[260px] md:w-full;

  .icon {
    @apply absolute left-4 top-1/2 -translate-y-1/2 text-grey-500;
  }

  input {
    @apply h-11 w-full rounded-lg border border-grey-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-grey-900 outline-none transition focus:border-teal-800;
  }
}

.filter-select {
  @apply relative inline-flex h-11 min-w-[120px] items-center rounded-lg bg-grey-100 text-sm font-bold text-grey-900 md:w-full;

  select {
    @apply h-full w-full appearance-none bg-transparent px-4 pr-9 outline-none;
  }

  .icon {
    @apply pointer-events-none absolute right-4 text-xs text-grey-700;
  }
}

:deep(tbody tr) {
  @apply cursor-pointer;
}

:deep(tbody tr td:last-child) {
  text-align: left;
}
</style>
