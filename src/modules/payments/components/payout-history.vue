<template>
  <PageContentWrapper
    :showTitle="false"
    :pagingData="tablePaging"
    @update-page="onPageChange"
  >
    <template v-slot:pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No payout initiated yet',
          description:
            'You haven\'t initiated any payout yet. This is where you\'ll be able to see all your initiated payout transactions.',
          actionText: 'Initiate a Payout',
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
import { ref, computed, watch } from "vue";
import { useString, useEvents, useDate } from "@packages/hooks";
import { useApprovalsStore } from "@/modules/approvals/store";
import { TableHeaderType } from "@packages/models";

import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
} from "@packages/uikit";

const props = withDefaults(
  defineProps<{
    merchantId?: string;
    merchantDetails?: Record<string, any> | null;
  }>(),
  { merchantId: "", merchantDetails: null },
);

const { formatNumber, capitalizeFirstLetter, getStatus } = useString();
const { processAPIRequest } = useEvents();

const { getAllWithdrawalRequests } = useApprovalsStore();

const isLoading = ref(false);
const page = ref(1);
const pageSize = ref(10);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date", slug: "date_created" },
  { title: "Reference", slug: "reference" },
  { title: "Amount", slug: "amount_requested" },
  { title: "Fees", slug: "fee" },
  { title: "Net payout", slug: "net_payout" },
  { title: "Status", slug: "status" },
]);

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});

const getDateCreated = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const apiFilters = computed(() => {
  return `?page=${page.value}&user_id=${props.merchantId}`;
});

const fetchPayouts = async () => {
  if (!props.merchantId) return;
  isLoading.value = true;

  const response = await processAPIRequest({
    action: getAllWithdrawalRequests,
    payload: { filters: apiFilters.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code === 200) {
    const list = response.data?.data || response.data || [];
    tableBody.value = list.map((item: any) => ({
      date_created: getDateCreated(item.created_at),
      reference: item.reference || item.reference_id || "-",
      amount_requested: `${item.currency || "USD"} ${formatNumber(item.amount || 0)}`,
      fee: item.fee
        ? `${item.currency || "USD"} ${formatNumber(item.fee)}`
        : "-",
      net_payout: item.net_payout
        ? `${item.currency || "USD"} ${formatNumber(item.net_payout)}`
        : "-",
      status: getStatus(
        item.status === "completed" || item.status === "successful"
          ? "success"
          : item.status === "failed"
            ? "failed"
            : "pending",
        capitalizeFirstLetter((item.status || "pending").split("_").join(" ")),
      ),
    }));

    const pagination = response.pagination?.[0];
    if (pagination) {
      const pageCount =
        Math.ceil(
          (pagination.total || pagination.total_records || 0) /
            (pagination.page_size || pageSize.value),
        ) || 0;
      tablePaging.value = {
        current_page: pagination.current_page || pagination.page || 1,
        page_count: pageCount,
        total_pages_count: pageCount,
      };
    } else {
      tablePaging.value = {
        current_page: 1,
        page_count: 0,
        total_pages_count: 0,
      };
    }
  }
};

const onPageChange = (pageNum: number) => {
  page.value = pageNum;
};

watch(
  () => [props.merchantId, apiFilters.value] as const,
  () => {
    fetchPayouts();
  },
  { immediate: true },
);
</script>
