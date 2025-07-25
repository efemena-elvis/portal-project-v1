<template>
  <PageContentWrapper>
    <template v-slot:pageOptions>
      <div class="button-row">
        <router-link to="/merchant/add" class="!h-12 btn btn-primary"
          >Add new merchant</router-link
        >
      </div>
    </template>

    <template v-slot:pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No merchants yet!',
          description: 'You can start by adding a new merchant.',
        }"
      >
        <TableContainerBody
          v-for="(payload, index) in tableBody"
          :key="index"
          :tableHeader="tableHeader"
          :tableData="payload"
          :onTableClicked="() => handleTableClicked(payload.id)"
        />
      </TableContainer>
    </template>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import { ref, reactive, h, onMounted, computed } from "vue";
import { TableHeaderType } from "@packages/models";
import { useDate, useString, useEvents } from "@packages/hooks";
import { usePaymentStore } from "@/modules/payments/store";

import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
} from "@packages/uikit";
import { useRouter } from "vue-router";

const { getStatus, getBoldTableText, notAvailable, capitalizeFirstLetter } =
  useString();
const { processAPIRequest } = useEvents();
const { getMerchants } = usePaymentStore();
const router = useRouter();

const isLoading = ref(true);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Business name", slug: "business" },
  { title: "Date added", slug: "date_created" },
  { title: "Business ID", slug: "id" },
  { title: "Email", slug: "email" },
  { title: "Status", slug: "status" },
]);

const dummyTableBody = [
  {
    business: "Acme Corp",
    date: "Mon, 12 May, 2025",
    id: "ACM-00123",
    email: "contact@acmecorp.com",
    status: getStatus("verified", "verified"),
  },
];

const tableBody = reactive<any[]>([]);
const tablePaging = ref<any>({});

const getDateAdded = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const fetchMerchants = async () => {
  // tableBody.push(...dummyTableBody);

  const response = await processAPIRequest({
    action: getMerchants,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response?.code === 200) {
    response.data.map((data: any) => {
      tableBody.push({
        business: getBoldTableText(data.business_name),
        date_created: getDateAdded(data.date_added),
        id: data.business_id,
        email: data.email,
        status: getStatus(data.status, data.status),
      });
    });

    tablePaging.value = response.pagination[0];
  }
};

const handleTableClicked = (id: string) => {
  router.push(`/merchant/${id}`);
};

onMounted(() => {
  fetchMerchants();
});
</script>

<style lang="scss" scoped>
.button-row {
  @apply flex justify-end items-center gap-x-2;

  .btn {
    @apply py-2.5 px-5 h-10;
  }
}
</style>
