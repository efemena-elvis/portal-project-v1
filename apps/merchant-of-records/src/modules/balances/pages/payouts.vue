<template>
  <PageContentWrapper>
    <template #pageOptions>
      <div class="button-row">
        <div class="flex items-center gap-3 mr-12">
        <select
          v-model="selectedStatus"
          class="p-3 text-sm border rounded-md cursor-pointer focus:outline-none bg-grey-50/80 w-[120px]"
        >
          <option value="">Status</option>
          <option
            class="bg-white rounded-md"
            v-for="(status, index) in statusOptions"
            :value="status"
            :key="index"
          >
            {{ status }}
          </option>
        </select>

        <div class="relative">
          <div
            class="flex justify-between items-center gap-x-2 p-3 border rounded-md bg-grey-50/80 cursor-pointer text-sm w-[120px]"
            @click="showDropdown = !showDropdown"
          >
            <span>{{ activePeriod }}</span>
            <span class="icon-calendar transition-transform duration-200"></span>
          </div>

          <div
            v-if="showDropdown"
            class="absolute z-10 mt-1 bg-white border rounded-md shadow-md w-full"
          >
            <div
              v-for="(period, index) in periodList"
              :key="index"
              @click="processFilterSelection(period); showDropdown = false"
              class="px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50"
            >
              {{ period }}
            </div>
          </div>
        </div>
      </div>
      </div>
    </template>

    <template v-slot:pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="filteredTableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No payout initiated yet',
          description:
            'You haven\'t initiated any payout yet. This is where you\'ll be able to see all your initiated payout transactions.',
          actionText: 'Initiate a Payout',
        }"
      >
        <TableContainerBody
          v-for="(payload, index) in filteredTableBody"
          :key="index"
          :tableHeader="tableHeader"
          :tableData="payload"
        />
      </TableContainer>
    </template>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useString, useEvents, useDate } from "@packages/hooks";
import { useBalanceStore } from "@/modules/balances/store";
import { TableHeaderType } from "@packages/models";
import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
} from "@packages/uikit";

const { getBoldTableText, formatNumber, getStatus } = useString();
const { fetchAllPayouts } = useBalanceStore();
const { processAPIRequest } = useEvents();

const isLoading = ref(true);
const selectedStatus = ref("");

const activePeriod = ref("All Time");
const showDropdown = ref(false);

const periodList = ref([
  "Today",
  "Last 7 days",
  "This month",
  "Last month",
  "All time",
]);

const statusOptions = ["Successful", "Pending", "Failed"];

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date Initiated", slug: "date_created" },
  { title: "Payout Reference", slug: "reference_id" },
  { title: "Amount Requested", slug: "amount_requested" },
  { title: "Payout Narration", slug: "narration" },
  { title: "Status", slug: "status" },
]);

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});

const getDateCreated = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const processFilterSelection = (selectedPeriod: string) => {
  activePeriod.value = selectedPeriod;
};

const normalize = (val: string) => val?.trim().toLowerCase() || "";

const isWithinPeriod = (date: Date, period: string): boolean => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  switch (period) {
    case "Today":
      return date >= startOfToday;
    case "Last 7 days":
      return date >= sevenDaysAgo;
    case "This month":
      return date >= startOfMonth;
    case "Last month":
      return date >= startOfLastMonth && date <= endOfLastMonth;
    case "All time":
    default:
      return true;
  }
};

const fetchPayouts = async () => {
  const response = await processAPIRequest({
    action: fetchAllPayouts,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.value = response.data.map((data: any) => ({
      raw_date: data.created_at,
      raw_status: data.status,
      date_created: getDateCreated(data.created_at),
      reference_id: data.reference,
      amount_requested: getBoldTableText(
        `${data.currency} ${formatNumber(data.amount)}`
      ),
      narration: data.narration,
      status: getStatus(data.status, data.status),
    }));

    tablePaging.value = response.pagination[0];
  }
};

const filteredTableBody = computed(() => {
  return tableBody.value.filter((tx) => {
    const rawDate = tx.raw_date ? new Date(tx.raw_date) : null;
    const matchesStatus = selectedStatus.value
      ? tx.raw_status?.toLowerCase() === selectedStatus.value.toLowerCase()
      : true;
    const matchesDate = rawDate ? isWithinPeriod(rawDate, activePeriod.value) : true;
    return matchesStatus && matchesDate;
  });
});

onMounted(() => {
  fetchPayouts();
});
</script>
