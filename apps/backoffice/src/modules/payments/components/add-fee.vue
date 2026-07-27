<template>
  <div class="fees-panel">

      <div class="add-fee-actions">
      <p class="add-fee-description">
        Add a fee to this merchant's account. Fees can be used for
        administrative charges, penalties, or service costs.
      </p>
      <button
        class="btn btn-primary btn-sm"
        type="button"
        @click="showAddFeeModal = true"
      >
        Add Config
      </button>
    </div>
    <TableContainer
      :tableHeader="tableHeader"
      :tableBody="paginatedFees"
      :isLoading="false"
      :emptyData="{
        title: 'No fee configurations yet',
        description: 'This merchant has no fee configurations at the moment.',
      }"
    >
      <TableContainerBody
        v-for="(row, index) in paginatedFees"
        :key="index"
        :tableHeader="tableHeader"
        :tableData="row"
      />
    </TableContainer>

    <Pagination
      v-if="tablePaging.page_count > 0"
      :pageDescription="`Page ${tablePaging.current_page} of ${tablePaging.total_pages_count}`"
      :pagingData="tablePaging"
      @page-change="onPageChange"
    />

  

    <AddFeeModal
      v-if="showAddFeeModal"
      :merchantId="merchantId"
      :merchantName="merchantName"
      @closeTriggered="showAddFeeModal = false"
      @feeAdded="showAddFeeModal = false"
    />
  </div>
</template>

<script setup lang="ts">
/* eslint-disable vue/valid-define-props */
import { ref, computed, withDefaults, defineProps } from "vue";
import { useDate, useString } from "@packages/hooks";
import { TableHeaderType } from "@packages/models";
import {
  Pagination,
  TableContainer,
  TableContainerBody
} from "@packages/uikit";
import AddFeeModal from "@/modules/payments/modals/add-fee-modal.vue";

const props = withDefaults(
  defineProps<{
    merchantId?: string;
    merchantDetails?: Record<string, any> | null;
    businessName?: string;
    overviewData?: Record<string, any> | null;
  }>(),
  {
    merchantId: "",
    merchantDetails: null,
    businessName: "",
    overviewData: null,
  },
);

const { getStatus, capitalizeFirstLetter } = useString();

const merchantName = computed(() => {
  if (props.businessName) return props.businessName;
  return props.merchantDetails?.name || "";
});

const showAddFeeModal = ref(false);

const PAGE_SIZE = 10;
const page = ref(1);

const tableHeader: TableHeaderType[] = [
   { title: "Date Created", slug: "dateCreated" },
  { title: "Currency", slug: "currency" },
  { title: "Method", slug: "method" },
  { title: "Fee Type", slug: "feeType" },
  { title: "Amount", slug: "amount" },
  { title: "Status", slug: "status" },
 
];

const formatDate = (date?: string) => {
  if (!date) return "-";
  const { m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${m3} ${d3}, ${y1}`;
};

const feeConfigurations = computed(() => {
  return props.overviewData?.fee_configuration || [];
});

const normalizedFees = computed(() =>
  feeConfigurations.value?.map((item: Record<string, any>) => ({
    currency: item.currency || "-",
    method: capitalizeFirstLetter(item.method || "-"),
    feeType: capitalizeFirstLetter(item.type || "-"),
    amount:
      item.type === "percentage"
        ? `${item.amount}%`
        : `${item.currency} ${item.amount}`,
    is_active: item.is_active,
    dateCreated: item.created_at,
  })),
);

const tablePaging = computed(() => {
  const totalRecords = normalizedFees.value.length;
  const totalPages = Math.ceil(totalRecords / PAGE_SIZE) || 0;
  return {
    current_page: page.value,
    page_count: totalPages,
    total_pages_count: totalPages,
  };
});

const paginatedFees = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE;
  return normalizedFees.value
    .slice(start, start + PAGE_SIZE)
    .map((item: Record<string, any>) => ({
      currency: item.currency,
      method: item.method,
      feeType: item.feeType,
      amount: item.amount,
      status: getStatus(
        item.is_active ? "successful" : "failed",
        item.is_active ? "Active" : "Inactive",
      ),
      dateCreated: formatDate(item.dateCreated),
    }));
});

const onPageChange = (pageNum: number) => {
  page.value = pageNum;
};
</script>

<style scoped lang="scss">
.fees-panel {
  @apply flex flex-col gap-6;
}

.add-fee-actions {
  @apply flex flex-col items-start gap-4 rounded-lg bg-white p-8 shadow-sm;
}

.add-fee-description {
  @apply text-sm leading-6 text-grey-600;
}
</style>
