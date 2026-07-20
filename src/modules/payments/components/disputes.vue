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
          title: 'No disputes recorded',
          description: 'This merchant has no disputes at the moment.',
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
import { useEvents, useDate } from "@packages/hooks";
import { useDisputeStore } from "@/modules/disputes/store";
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

const { getDisputes } = useDisputeStore();
const { processAPIRequest } = useEvents();

const isLoading = ref(false);
const page = ref(1);
const pageSize = ref(10);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date", slug: "date_created" },
  { title: "Reference", slug: "reference_id" },
  { title: "Amount", slug: "amount" },
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

const fetchDisputes = async () => {
  if (!props.merchantId) return;
  isLoading.value = true;

  const response = await processAPIRequest({
    action: getDisputes,
    payload: { filters: apiFilters.value },
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code === 200) {
    const list = response.data?.data || response.data || [];
    tableBody.value = list.map((item: any) => ({
      date_created: getDateCreated(item.created_at),
      reference_id: item.reference || item.id || "-",
      amount: `${item.currency || "USD"} ${item.amount || 0}`,
      status: item.status || item.dispute_status || "open",
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
    fetchDisputes();
  },
  { immediate: true },
);
</script>
