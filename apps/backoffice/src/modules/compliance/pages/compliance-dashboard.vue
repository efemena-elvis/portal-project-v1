<template>
  <PageContentWrapper
    description="Business verification and onboarding"
    :showTitle="true"
    pageDescription="All Compliances"
    @updatePage="(currentPage: number) => (page = currentPage)"
    :pagingData="selectedTab === 'requests' ? tablePaging : { page_count: 0 }"
  >
    <template v-slot:pageContent>
      <section class="flex flex-col gap-7">
        <div class="flex flex-wrap items-center gap-8 mt-8">
          <StatsCard
            v-for="stat in complianceStats"
            :key="stat.title"
            :title="stat.title"
            :value="stat.value"
          />
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
          <FilterBar
            :filters="filterConfig"
            :values="filterValues"
            @change="onFilterChange"
          />

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
import { computed, ref, h, reactive } from "vue";
import { useRouter } from "vue-router";
import { TableHeaderType } from "@packages/models";
import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
  TableDoubleColumn,
  FilterBar,
  StatsCard,
} from "@packages/uikit";
import { useString, useEvents, useDate, useAutoFetch } from "@packages/hooks";
import { useComplianceStore } from "@/modules/compliance/store";
import ComplianceConfig from "../components/compliance-config.vue";
import { title } from "process";

const { getStatus, getBoldTableText, capitalizeFirstLetter } = useString();
const { processAPIRequest } = useEvents();

const complianceStore = useComplianceStore() as any;
const { getCompliances } = complianceStore;
const router = useRouter();

const complianceStats = ref<{ title: string; value: string }[]>([
  { title: "Total", value: "-" },
  { title: "Verified", value: "-" },
  { title: "Unverified", value: "-" },
]);

const selectedTab = ref("requests");

// const tabs = [
//   { label: "New Requests", value: "requests" },
//   { label: "Compliance set-up", value: "setup" },
// ] as const;

// const tabButtonClass = (tabValue: string) =>
//   selectedTab.value === tabValue ? "tab-btn tab-btn--active" : "tab-btn";

const isLoading = ref(true);
const tablePaging = ref<any>({});
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
    options: ["Verified", "Unverified"],
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
  if (key !== "search") page.value = 1;
};

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date", slug: "date" },
  { title: "Business Name", slug: "business" },
  { title: "Email", slug: "email" },
  { title: "Status", slug: "status" },
  { title: "", slug: "action" },
]);

const tableBody = ref<any[]>([]);

const isVerifiedParam = computed(() => {
  const status = (filterValues.status || "").toLowerCase();
  if (status === "verified") return "true";
  if (status === "unverified") return "false";
  return "";
});

const filters = computed(
  () =>
    `?page=${page.value}&page_size=20&is_verified=${isVerifiedParam.value}&from_created_at=${filterValues.period ? filterValues.period[0].toISOString().split("T")[0] : ""}&to_created_at=${filterValues.period ? filterValues.period[1].toISOString().split("T")[0] : ""}&search=${filterValues.search}`,
);

const getDateFormatted = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const openComplianceDetails = (data: any) => {
  router.push({
    name: "ComplianceDetails",
    params: { id: data.uuid },
  });
};

const buildBusinessRows = (documents: any[]) => {
  const grouped = documents.reduce<Record<string, any[]>>((acc, doc) => {
    const key = doc.uuid;
    if (!acc[key]) acc[key] = [];
    acc[key].push(doc);
    return acc;
  }, {});

  return Object.values(grouped).map((docs) => {
    const first = docs[0];
    const isVerified =
      first.is_verified === true 
    const latest = docs.reduce((a, b) =>
      new Date(a.created_at) > new Date(b.created_at) ? a : b,
    );

    return {
      date: h(TableDoubleColumn, {
        entry: {
          primaryText: latest?.created_at
            ? getDateFormatted(latest.created_at)
            : "-",
          secondaryText: latest?.created_at
            ? useDate.formatTime(latest.created_at)
            : "",
        },
      }),
      business: getBoldTableText(
        capitalizeFirstLetter(first.business_name || "No business info"),
      ),
      email: first.merchant_email || "-",
      status: getStatus(
        isVerified ? "verified" : "pending",
        isVerified ? "Verified" :  "Unverified",
      ),
     
      action: h(
        "button",
        {
          class:
            "text-sm font-semibold text-teal-800 transition hover:text-green-600",
          type: "button",
          onClick: (event: Event) => {
            event.stopPropagation();
            openComplianceDetails(first);
          },
        },
        "View",
      ),
      isVerified,
    };
  });
};

const fetchCompliances = async (filters: string) => {
  isLoading.value = true;
  tablePaging.value.current_page = page;
  const response = await processAPIRequest({
    action: getCompliances,
    payload: { filters, page: page.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response && response.code === 200) {
    const documents = response.data?.documents || [];
    const rows = buildBusinessRows(documents);
    tableBody.value = rows;

    const total = response.data?.total_records || documents.length;
    tablePaging.value = {
      current_page: response.data?.page || page.value,
      page_count: rows.length,
      total_pages_count: Math.ceil(total / (response.data?.page_size || 20)),
    };


    complianceStats.value = [
      { title: "Total", value: total.toLocaleString() }
    ];
  }
};

useAutoFetch(filters, fetchCompliances);
</script>

<style scoped>
.tab-btn {
  @apply text-sm font-medium text-grey-700 px-4 py-2 rounded-md transition duration-200 ease-in-out border-0 cursor-pointer bg-transparent;
}
.tab-btn--active {
  @apply bg-white text-teal-800;
}
</style>
