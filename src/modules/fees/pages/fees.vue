<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <PageContentWrapper
    description="Manage transaction fees and charges"
    :showTitle="true"
    pageDescription="All Fee Configurations"
    :pagingData="tablePaging"
    @updatePage="(currentPage: number) => (page = currentPage)"
    @searchEntered="processSearchEntry"
  >
    <template #pageContent>
      <section class="flex flex-col gap-7">
        <div class="flex justify-between items-center gap-4">
          <div class="w-full flex justify-end">
            <button
              class="btn btn-sm btn-primary"
              type="button"
              @click="showAddFeeModal = true"
            >
              + Add Config
            </button>
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
                aria-label="Search fee configurations"
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
            title: 'No fee configurations yet',
            description: 'Add a fee configuration to get started.',
          }"
        >
          <TableContainerBody
            v-for="(payload, index) in tableBody"
            :key="index"
            :tableHeader="tableHeader"
            :tableData="payload"
          />
        </TableContainer>
      </section>
    </template>
  </PageContentWrapper>

  <AddFeeModal
    v-if="showAddFeeModal"
    @closeTriggered="showAddFeeModal = false"
    @feeSaved="handleFeeSaved"
  />

  <EditFeeModal
    v-if="showEditModal && selectedFeeRaw !== null"
    :feeId="selectedFeeId"
    :feeData="selectedFeeRaw"
    @closeTriggered="closeEditModal"
    @feeUpdated="handleFeeUpdated"
  />
</template>

<script lang="ts" setup>
import { ref, computed, h, onMounted, watch } from "vue";
import { useDate, useEvents, useString } from "@packages/hooks";
import { useFeeStore } from "@/modules/fees/store";
import { TableHeaderType } from "@packages/models";
import {
  PageContentWrapper,
  TableContainer,
  TableContainerBody,
  TableDoubleColumn,
  DatePicker,
} from "@packages/uikit";
import AddFeeModal from "@/modules/fees/modals/add-fee-modal.vue";
import EditFeeModal from "@/modules/fees/modals/edit-fee-modal.vue";

const { getFees } = useFeeStore();
const { processAPIRequest } = useEvents();
const { formatNumber, getBoldTableText, getStatus, capitalizeFirstLetter } =
  useString();

const isLoading = ref(true);
const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});
const page = ref(1);
const searchQuery = ref("");
const activePeriod = ref<[Date, Date] | null>(null);
const showAddFeeModal = ref(false);
const showEditModal = ref(false);
const selectedFeeId = ref("");
const selectedFeeRaw = ref<Record<string, any> | null>(null);

const statusOptions = ["Active", "Inactive"];

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date", slug: "date_created" },
  { title: "Merchant", slug: "name" },
  { title: "Payment Type", slug: "payment_type" },
  { title: "Fee Type", slug: "fee_type" },
  { title: "Amount", slug: "amount" },
  { title: "Cap Amount", slug: "cap_amount" },
  { title: "Status", slug: "status" },
  { title: "", slug: "action" },
]);

const selectedStatus = ref("");

const filters = computed(
  () =>
    `?page=${page.value}&status=${selectedStatus.value}&from=${activePeriod.value ? activePeriod.value[0].toISOString().split("T")[0] : ""}&to=${activePeriod.value ? activePeriod.value[1].toISOString().split("T")[0] : ""}&search=${searchQuery.value}`,
);

const processSearchEntry = (searchValue: string) => {
  searchQuery.value = searchValue.toLocaleLowerCase().trim();
};

const processFilterSelection = (
  selectedRange: [Date | string, Date | string],
) => {
  if (selectedRange && selectedRange.length === 2) {
    const normalizedRange: [Date, Date] = [
      new Date(selectedRange[0]),
      new Date(selectedRange[1]) as Date,
    ];
    activePeriod.value = normalizedRange;
  } else {
    activePeriod.value = null;
  }
};

const getDateCreated = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const getMerchantName = (data: any) => {
  return data?.name || "-";
};

const normalizeFeeData = (data: any) => {
  return {
    id: data?.id,
    date: data?.created_at || "-",
    name: getMerchantName(data) || "-",
    merchantId: data?.id || "",
    payment_type: data?.payment_type || "-",
    country: data?.country || "-",
    fee_type: data?.fee_type || "-",
    amount: getBoldTableText(
      `${data.currency} ${formatNumber(data.amount)}`,
      data.payment_type === "payin" ? "text-green-600" : "text-red-600",
    ),
    capAmount: data?.cap_amount ? formatNumber(data.cap_amount) : "-",
    status: capitalizeFirstLetter(
      (data?.status || "active").toString().toLowerCase(),
    ),
    raw: data,
  };
};

const dummyTableBody = [
  {
    name: "Tanimola Business",
    id: "MER-001",
    created_at: "2025-03-15T10:30:00Z",
    payment_type: "payin",
    country: "nigeria",
    fee_type: "percentage",
    amount: 2500,
    cap_amount: 50000,
    currency: "NGN",
    status: "active",
  },
  {
    name: "Future Tech Solutions",
    id: "MER-002",
    created_at: "2025-01-22T14:15:00Z",
    payment_type: "payout",
    country: "ghana",
    currency: "GHS",
    fee_type: "fixed",
    amount: 1500,
    cap_amount: 30000,
    status: "active",
  },
];

const buildFeeTableRows = (fees: any[]) => {
  tableBody.value = fees.map((data: any) => {
    const fee = normalizeFeeData(data);
    const date = data?.created_at || (data as any).date;

    return {
      date_created: h(TableDoubleColumn, {
        entry: {
          primaryText: date ? getDateCreated(date) : "-",
          secondaryText: date ? useDate.formatTime(date) : "",
        },
      }),
      name: getBoldTableText(fee.name),
      payment_type: capitalizeFirstLetter(fee.payment_type),
      fee_type: capitalizeFirstLetter(fee.fee_type),
      amount: getBoldTableText(`${data.currency} ${formatNumber(data.amount)}`),
      cap_amount: getBoldTableText(fee.capAmount),
      status: getStatus(
        data?.status.toLowerCase() === "active" ? "successful" : "failed",
        data.status,
      ),
      action: h(
        "button",
        {
          class:
            "text-sm font-semibold text-teal-800 transition hover:text-green-600",
          type: "button",
          onClick: (event: Event) => {
            event.stopPropagation();
            openEditFeeModal(fee);
          },
        },
        "Edit Config",
      ),
      raw: fee,
    };
  });
};

const fetchFees = async (filters: string) => {
  isLoading.value = true;
  tablePaging.value.current_page = page.value;

  const response = await processAPIRequest({
    action: getFees,
    payload: { filters, page: page.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code === 200) {
    buildFeeTableRows(response.data);
    tablePaging.value = response.pagination[0];
  }
};

const buildDummyTableRows = () => {
  buildFeeTableRows(dummyTableBody);
};

const openEditFeeModal = (fee: any) => {
  selectedFeeId.value = fee.id || "";
  selectedFeeRaw.value = fee.raw || null;
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedFeeId.value = "";
  selectedFeeRaw.value = null;
};

const handleFeeSaved = () => {
  showAddFeeModal.value = false;
  fetchFees(filters.value);
};

const handleFeeUpdated = () => {
  closeEditModal();
  fetchFees(filters.value);
};

watch([selectedStatus, activePeriod, searchQuery], () => {
  page.value = 1;
});

watch(filters, (newFilters) => {
  fetchFees(newFilters);
});

onMounted(() => {
  buildDummyTableRows();
  fetchFees(filters.value);
});
</script>

<style scoped lang="scss">
:deep(tbody tr td:last-child) {
  text-align: left;
}
</style>
