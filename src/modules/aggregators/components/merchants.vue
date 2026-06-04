<!-- eslint-disable vue/multi-word-component-names, vue/valid-define-props -->
<template>
  <section class="aggregator-merchants">
    <div class="filters-row">
      <div class="search-field">
        <span class="icon icon-search-normal"></span>
        <input v-model="searchQuery" type="search" placeholder="Search" />
      </div>

      <label class="filter-select">
        <select v-model="selectedStatus">
          <option value="">Status</option>
          <option v-for="status in statusOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
        <span class="icon icon-caret-down"></span>
      </label>

      <DatePicker
        filterSize="lg"
        :activePeriod="activePeriod"
        @onFilterSelected="processFilterSelection"
      />
    </div>

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
import { computed,  onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { TableHeaderType } from "@packages/models";
import { useDate, useEvents, useString } from "@packages/hooks";
import {
  DatePicker,
  TableContainer,
  TableContainerBody,
} from "@packages/uikit";
import { useAggregatorStore } from "@/modules/aggregators/store";

const props = defineProps<{
  aggregatorId: string;
}>();

const router = useRouter();
const { getAggregatorMerchants } = useAggregatorStore();
const { processAPIRequest } = useEvents();
const { getStatus } = useString();

const isLoading = ref(true);
const searchQuery = ref("");
const selectedStatus = ref("");
const activePeriod = ref<[Date, Date] | null>(null);

const statusOptions = ["Active", "Inactive", "Pending"];

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
    `?status=${selectedStatus.value.toLowerCase()}&from=${
      activePeriod.value
        ? activePeriod.value[0].toISOString().split("T")[0]
        : ""
    }&to=${
      activePeriod.value
        ? activePeriod.value[1].toISOString().split("T")[0]
        : ""
    }&search=${searchQuery.value.trim().toLowerCase()}`,
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
      formatDate(merchant.created_at ),
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

const processFilterSelection = (
  selectedRange: [Date | string, Date | string] | null,
) => {
  if (selectedRange && selectedRange.length === 2) {
    activePeriod.value = [
      new Date(selectedRange[0]),
      new Date(selectedRange[1]),
    ];
    return;
  }

  activePeriod.value = null;
};

const openMerchant = (merchantId: string) => {
  if (!merchantId) return;
  router.push(`/merchant/${merchantId}`);
};

watch(filters, fetchMerchants);

onMounted(fetchMerchants);
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
