<template>
  <PageContentWrapper
    :pagingData="tablePaging"
    pageDescription="All Payouts"
    :fetchDataByPage="fetchPayouts"
    customActionBtnText="Initiate a Payout"
    @customActionBtnClicked="toggleInitiatePayoutModal"
    :showCustomActionBtn="tableBody.length > 0 && !isLoading"

  >
    <template #pageOptions v-if="tableBody.length > 0 && !isLoading">
      <div
        class="relative w-48 text-sm font-semibold text-teal-800 border rounded-md cursor-pointer sm:w-1/2 bg-grey-50/80"
      >
        <select
          v-model="selectedStatus"
          class="w-full p-4 bg-transparent appearance-none focus:outline-none"
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

      <div class="flex items-center w-full gap-3">
        <DatePicker
          filterSize="lg"
          :activePeriod="activePeriod"
          @onFilterSelected="processFilterSelection"
        />
        <button
          @click="exportToExcel"
          class="w-full p-4 text-sm font-semibold text-teal-800 transition-all duration-200 border rounded-md sm:w-1/2 hover:bg-teal-50"
        >
          Export
        </button>
      </div>
    </template>

    <template v-slot:pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="filteredTableBody"
        :isLoading="isLoading"
        @onActionClicked="toggleInitiatePayoutModal"
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
     <teleport to="body" v-if="showInitiatePayoutModal">
    <InitiatePayoutModal @closeTriggered="toggleInitiatePayoutModal" @reloadPayouts="fetchAllPayouts" />
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from "vue";
import { useString, useEvents, useDate } from "@packages/hooks";
import { useBalanceStore } from "@/modules/balances/store";
import { TableHeaderType } from "@packages/models";
import { DatePicker } from "@packages/uikit";
import * as XLSX from "xlsx";
import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
  TableDoubleColumn,
} from "@packages/uikit";
import InitiatePayoutModal from "@/modules/payments/modals/initiate-payout-modal.vue";

const { getBoldTableText, formatNumber, getStatus } = useString();
const { fetchAllPayouts } = useBalanceStore();
const { processAPIRequest } = useEvents();
const showInitiatePayoutModal = ref(false);

const toggleInitiatePayoutModal = () => {
  showInitiatePayoutModal.value = !showInitiatePayoutModal.value;
};

const isLoading = ref(true);
const selectedStatus = ref("");

const activePeriod = ref<[Date, Date] | null>(null);


const statusOptions = ["Successful", "Pending", "Failed"];

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date Initiated", slug: "date_created" },
  { title: "Amount Requested", slug: "amount_requested" },
  { title: "Payout Narration", slug: "narration" },
  { title: "Status", slug: "status" },
  { title: "Payout Reference", slug: "reference" },
]);

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});

const getDateCreated = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
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
  selectedRange: [Date | string, Date | string]
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

const fetchPayouts = async (page = 1) => {
  tablePaging.value.current_page = page;
  const response = await processAPIRequest({
    action: fetchAllPayouts,
    payload: { page },
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.value = response.data.map((data: any) => {
      const formattedAmount = `${formatNumber(data.amount)}`;
      const createdDate = new Date(data.created_at);

      return {
        date_created: h(TableDoubleColumn, {
          entry: {
            primaryText: getDateCreated(data.created_at),
            secondaryText: useDate.formatTime(data.created_at),
          },
        }),
        reference: data.reference,
        amount_requested: getBoldTableText(
          `${data.currency} ${formatNumber(data.amount)}`
        ),
        narration: data.narration,
        status: getStatus(data.status, data.status),

        raw: {
          date_created: `${getDateCreated(data.created_at)} - ${useDate.formatTime(data.created_at)}`,
          raw_date: createdDate,
          amount: formattedAmount,
          status: data.status ?? "-",
          reference: data.reference ?? "-",
        },
      };
    });

    tablePaging.value = response.pagination[0];
  }
};

const exportToExcel = () => {
  const dataToExport = filteredTableBody.value.map((tx) => tx.raw);
  const cleanData = dataToExport.map((tx) => ({
    "Date Created": tx.date_created,
    Amount: tx.amount || "-",
    Status: tx.status,
    Reference: tx.reference,
  }));

  const worksheet = XLSX.utils.json_to_sheet(cleanData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Merchant Payouts");
  XLSX.writeFile(workbook, "Merchant_Payouts.xlsx");
};

const filteredTableBody = computed(() => {
  return tableBody.value.filter((tx) => {
    const rawDate = tx.raw.raw_date ? new Date(tx.raw.raw_date) : null;
    const matchesStatus = selectedStatus.value
      ? tx.raw?.status?.toLowerCase() === selectedStatus.value.toLowerCase()
      : true;
    const matchesDate = rawDate
      ? isWithinRange(rawDate, activePeriod.value)
      : true;
    return matchesStatus && matchesDate;
  });
});

onMounted(() => {
  fetchPayouts();
});
</script>

<style scoped></style>
