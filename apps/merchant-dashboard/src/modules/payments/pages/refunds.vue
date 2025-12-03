<template>
  <PageContentWrapper
    :pagingData="tablePaging"
    pageDescription="All Refunds"
    @updatePage="(page) => fetchRefunds(page)"
    :showCustomActionBtn="false"
  >
    <template #pageOptions>
      <div
        class="relative flex items-center gap-4 mb-6 sm:flex-wrap sm:flex-row-reverse top-3 sm:static"
        v-if="!isLoading"
      >
        <div class="flex items-center justify-between w-full gap-4">
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
        </div>
        <div class="flex items-center w-full gap-4">
          <DatePicker
            filterSize="lg"
            :activePeriod="activePeriod"
            @onFilterSelected="processFilterSelection"
          />
          <button
            @click="exportToExcel"
            class="w-48 p-4 text-sm font-semibold text-teal-800 transition-all duration-200 border rounded-md sm:w-1/2 hover:bg-teal-50"
          >
            Export
          </button>
        </div>
      </div>
    </template>

    <template v-slot:pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No refunds initiated yet',
          description:
            'You haven\'t initiated any refund yet. This is where you\'ll be able to see all your initiated refund transactions.',
        }"
      >
        <TableContainerBody
          v-for="(payload, index) in tableBody"
          :key="index"
          :tableHeader="tableHeader"
          :tableData="payload"
        />
      </TableContainer>
    </template>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h, watch } from "vue";
import { useString, useEvents, useDate } from "@packages/hooks";
import { usePaymentStore } from "@/modules/payments/store";
import { TableHeaderType } from "@packages/models";
import { DatePicker } from "@packages/uikit";
import * as XLSX from "xlsx";
import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
  TableDoubleColumn,
} from "@packages/uikit";

const { getBoldTableText, formatNumber, getStatus, capitalizeFirstLetter } =
  useString();
const { getRefunds, fetchAllRefunds } = usePaymentStore();
const { processAPIRequest } = useEvents();

const isLoading = ref(true);
const selectedStatus = ref("");

const activePeriod = ref<[Date, Date] | null>(null);

const statusOptions = ["Successful", "Pending", "Failed"];

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date Initiated", slug: "date_initiated" },
  { title: "Refund Amount", slug: "refund_amount" },
  // { title: "Customer's Number", slug: "momo_number" },
  { title: "Refund Status", slug: "refund_status" },
  { title: "Reason", slug: "reason_for_failure" },
  // { title: "Refunded On", slug: "date_refunded" },
  { title: "Refund Reference", slug: "reference" },
]);

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});
const page = ref(1);

const filters = computed(
  () =>
    `?page=${page.value}&status=${selectedStatus.value}&from=${activePeriod.value ? activePeriod.value[0].toISOString().split("T")[0] : ""}&to=${activePeriod.value ? activePeriod.value[1].toISOString().split("T")[0] : ""}`
);

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

const fetchRefunds = async (filters: string) => {
  isLoading.value = true;
  tablePaging.value.current_page = page;
  const response = await processAPIRequest({
    action: getRefunds,
    payload: { filters, page: page.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.value = response.data.map((data: any) => {
      const formattedAmount = `${formatNumber(data.amount)}`;

      return {
        date_initiated: h(TableDoubleColumn, {
          entry: {
            primaryText: getDateCreated(data.created_at),
            secondaryText: useDate.formatTime(data.created_at),
          },
        }),
        reference: data.reference,
        refund_amount: getBoldTableText(
          `${data.currency} ${formatNumber(data.amount)}`
        ),

        refund_status: getStatus(data.status, data.status),
        reason_for_failure: capitalizeFirstLetter(
          (data.reason_for_failure || "-").toString().toLowerCase()
        ),

        // momo_number: "",
        raw: {
          date_initiated: `${getDateCreated(data.created_at)} - ${useDate.formatTime(data.created_at)}`,
          raw_date: new Date(data.created_at),
          refund_amount: formattedAmount,
          refund_status: data.status ?? "-",
          reference: data.reference ?? "-",
          momo_number: "",
        },
      };
    });

    tablePaging.value = response.pagination[0];
  }
};

const fetchAllRefundPages = async () => {
  let page = 1;
  let all: any[] = [];
  let totalPages = 1;

  do {
    const response = await processAPIRequest({
      action: fetchAllRefunds,
      payload: { page },
      showAlert: false,
    });

    if (response?.code !== 200) break;

    const mapped = response.data.map((data: any) => {
      return {
        date_initiated: `${getDateCreated(data.created_at)} - ${useDate.formatTime(data.created_at)}`,
        raw_date: new Date(data.created_at),
        refund_amount: `${formatNumber(data.amount)}`,
        refund_status: data.status ?? "-",
        reason_for_failure: capitalizeFirstLetter(
          (data.reason_for_failure || "-").toString().toLowerCase()
        ),

        // momo_number: "",
        reference: data.reference ?? "-",
      };
    });

    all.push(...mapped);

    totalPages = response.pagination[0]?.total_pages ?? 1;
    page++;
  } while (page <= totalPages);

  return all;
};

const exportToExcel = async () => {
  const allRefunds = await fetchAllRefundPages();

  const filtered = allRefunds.filter((tx) => {
    const status = tx.refund_status.toLowerCase();
    const date = tx.raw_date ? new Date(tx.raw_date) : null;

    const matchesStatus = selectedStatus.value
      ? status === selectedStatus.value
      : true;
    const matchesDate = date ? isWithinRange(date, activePeriod.value) : true;

    return matchesStatus && matchesDate;
  });

  const cleanData = filtered.map((tx) => ({
    "Date Initiated": tx.date_initiated,
    Amount: tx.refund_amount || "-",
    Status: tx.refund_status,
    Reference: tx.reference,
    Reason: tx.reason_for_failure ?? "-",
  }));

  const worksheet = XLSX.utils.json_to_sheet(cleanData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Merchant Refunds");
  XLSX.writeFile(workbook, "Merchant_Refunds.xlsx");
};

watch([selectedStatus, activePeriod], () => {
  page.value = 1;
});

watch(filters, (newFilters) => {
  fetchRefunds(newFilters);
});

onMounted(fetchRefunds);
</script>

<style scoped></style>
