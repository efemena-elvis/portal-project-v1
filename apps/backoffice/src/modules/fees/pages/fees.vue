<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <PageContentWrapper
    description="Manage transaction fees and charges"
    :showTitle="true"
    pageDescription="All Fee Configurations"
    :pagingData="tablePaging"
    @updatePage="(currentPage: number) => (page = currentPage)"
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
              + Add Fee Config
            </button>
          </div>
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
    v-if="showEditModal"
    :feeId="selectedFeeId"
    @closeTriggered="closeEditModal"
    @feeUpdated="handleFeeUpdated"
  />

  <MerchantActionModal
    v-if="showDeleteModal"
    action="delete-fee"
    title="Delete fee configuration"
    :description="`Are you sure you want to delete the fee config for ${feeToDelete?.name || 'this merchant'}?`"
    confirmText="Delete"
    tone="danger"
    @closeTriggered="showDeleteModal = false"
    @confirmed="handleDeleteConfirmed"
  />
</template>

<script lang="ts" setup>
import { ref, computed, h, reactive, onMounted } from "vue";
import { useDate, useEvents, useString, useAutoFetch } from "@packages/hooks";
import { useFeeStore } from "@/modules/fees/store";
import { useMerchantStore } from "@/modules/merchants/store";
import { TableHeaderType } from "@packages/models";
import { getCountryByCurrencyShort } from "@packages/constants";
import {
  PageContentWrapper,
  TableContainer,
  TableContainerBody,
  TableDoubleColumn,
  FilterBar,
} from "@packages/uikit";
import AddFeeModal from "@/modules/fees/modals/add-fee-modal.vue";
import EditFeeModal from "@/modules/fees/modals/edit-fee-modal.vue";
import MerchantActionModal from "@/modules/payments/modals/merchant-action-modal.vue";

const { getFees, deleteFee } = useFeeStore();
const { getMerchants } = useMerchantStore();
const { processAPIRequest, pushToastAlert } = useEvents();
const { formatNumber, getBoldTableText, getStatus, capitalizeFirstLetter } =
  useString();

const isLoading = ref(true);
const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});
const page = ref(1);
const showAddFeeModal = ref(false);
const showEditModal = ref(false);
const selectedFeeId = ref("");
const showDeleteModal = ref(false);
const feeToDelete = ref<any>(null);
const merchantOptions = ref<{ value: string; name: string }[]>([]);

const filterValues = reactive({
  merchant: "",
  status: "",
  period: null as [Date, Date] | null,
});

const filterConfig = [
  {
    type: "searchable-select" as const,
    key: "merchant",
    options: merchantOptions,
    placeholder: "Merchant",
  },
  {
    type: "select" as const,
    key: "status",
    options: ["Active", "Inactive"],
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
  page.value = 1;
};

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date", slug: "date_created" },
  { title: "Merchant", slug: "merchant" },
  { title: "Payment Type", slug: "payment_type" },
  { title: "Fee Type", slug: "fee_type" },
  { title: "Amount", slug: "amount" },
  { title: "Cap Amount", slug: "cap_amount" },
  { title: "Status", slug: "status" },
  { title: "", slug: "action" },
]);

const filters = computed(
  () =>
    `?page=${page.value}&status=${filterValues.status}&user_id=${filterValues.merchant}&from=${filterValues.period ? filterValues.period[0].toISOString().split("T")[0] : ""}&to=${filterValues.period ? filterValues.period[1].toISOString().split("T")[0] : ""}`,
);

const fetchMerchants = async () => {
  const response = await processAPIRequest({
    action: async () => getMerchants({ filters: "?page=1&page_size=100000" }),
    showAlert: false,
  });
  if (response?.code === 200 && response.data) {
    const merchants = response.data.merchants || [];
    merchantOptions.value = merchants.map((merchant: any) => ({
      value: merchant.uuid || "",
      name: merchant.user.business_name || merchant.user.email
    }));
  }
};

const getDateCreated = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};



const normalizeFeeData = (data: any) => {
  return {
    id: data?.id,
    date: data?.created_at || "-",
    merchant: data?.user.business_name || "-",
    merchantId: data?.user_id,
    payment_type: capitalizeFirstLetter(data?.method || "-"),
    country:
      getCountryByCurrencyShort(data?.currency)?.country ||
      data?.country ||
      "-",
    fee_type: capitalizeFirstLetter(data?.type || "-"),
    amount: getBoldTableText(
      data?.type === "percentage"
        ? `${data?.amount ?? 0}%`
        : `${data?.currency} ${formatNumber(data?.amount ?? 0)}`,
      data?.method === "payin" ? "text-green-600" : "text-red-600",
    ),
    capAmount: data?.cap_amount
      ? `${data.currency} ${formatNumber(data.cap_amount)}`
      : "-",
    status: data?.is_active ? "active" : "inactive",
    raw: data,
  };
};

const buildFeeTableRows = (fees: any[]) => {
  tableBody.value = fees.map((data: any) => {
    const fee = normalizeFeeData(data);
    const date = fee.date;

    return {
      date_created: h(TableDoubleColumn, {
        entry: {
          primaryText: date ? getDateCreated(date) : "-",
          secondaryText: date ? useDate.formatTime(date) : "",
        },
      }),
      merchant: getBoldTableText(capitalizeFirstLetter(fee.merchant)),
      payment_type: capitalizeFirstLetter(fee.payment_type),
      fee_type: capitalizeFirstLetter(fee.fee_type),
      amount: fee.amount,
      cap_amount: getBoldTableText(fee.capAmount),
      status: getStatus(
        fee.status === "active" ? "successful" : "failed",
        fee.status,
      ),
      action: h("div", { class: "flex items-center gap-3" }, [
        h(
          "button",
          {
            type: "button",
            onClick: (event: Event) => {
              event.stopPropagation();
              openEditFeeModal(fee);
            },
          },
          [
            h("i", {
              class: "icon icon-pen-edit text-teal-800 text-lg",
            }),
          ],
        ),
        h(
          "button",
          {
            type: "button",
            onClick: (event: Event) => {
              event.stopPropagation();
              handleDeleteFee(fee);
            },
          },
          [
            h("i", {
              class: "icon icon-trash text-red-500 text-lg",
            }),
          ],
        ),
      ]),
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
    const merchantConfigs = response.data?.merchant_configs || [];
    buildFeeTableRows(merchantConfigs);
    tablePaging.value = {
      current_page: response.data?.page || page.value,
      page_count: merchantConfigs.length,
      total_pages_count: Math.ceil(
        (response.data?.total_records || 0) / (response.data?.page_size || 1),
      ),
    };
  }
};

const openEditFeeModal = (fee: any) => {
  selectedFeeId.value = fee.id;
  showEditModal.value = true;
};

const handleDeleteFee = (fee: any) => {
  feeToDelete.value = fee;
  showDeleteModal.value = true;
};

const handleDeleteConfirmed = async () => {
  showDeleteModal.value = false;
  const fee = feeToDelete.value;
  if (!fee) return;
  feeToDelete.value = null;

  const response = await processAPIRequest({
    action: async () => deleteFee(fee.id),
    payload: { merchant_config_uuid: fee.id },
    showAlert: false,
  });

  if (response?.code >= 200) {
    pushToastAlert({
      message: "Fee configuration deleted",
      type: "success",
    });
    fetchFees(filters.value);
  } else {
    pushToastAlert({
      message: "Failed to delete fee configuration",
      description: response?.error?.message || "Please try again",
      type: "error",
    });
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedFeeId.value = "";
};

const handleFeeSaved = () => {
  showAddFeeModal.value = false;
  fetchFees(filters.value);
};

const handleFeeUpdated = () => {
  closeEditModal();
  fetchFees(filters.value);
};

useAutoFetch(filters, fetchFees);

onMounted(() => {
  fetchMerchants();
});
</script>

<style scoped lang="scss">
:deep(tbody tr td:last-child) {
  text-align: left;

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    transition: background 0.2s;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
}
</style>
