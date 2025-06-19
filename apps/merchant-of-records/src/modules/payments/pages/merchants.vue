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
  TableDoubleColumn,
  PageContentWrapper,
} from "@packages/uikit";
import { useRouter } from "vue-router";

const {
  formatNumber,
  getStatus,
  getBoldTableText,
  notAvailable,
  capitalizeFirstLetter,
} = useString();
const { processAPIRequest } = useEvents();
const { getTransactions } = usePaymentStore();
const router = useRouter();

const isLoading = ref(true);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Business name", slug: "business" },
  { title: "Date added", slug: "date" },
  { title: "Account ID", slug: "id" },
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
  {
    business: "Beta Traders",
    date: "Tue, 13 May, 2025",
    id: "BTA-00456",
    email: "support@betatraders.com",
    status: getStatus("verified", "verified"),
  },
  {
    business: "Zeno Electronics",
    date: "Wed, 14 May, 2025",
    id: "ZEN-00789",
    email: "sales@zenoelectronics.com",
    status: getStatus("pending", "pending"),
  },
];

const tableBody = reactive<any[]>([]);
const tablePaging = ref<any>({});

const getTransactionDate = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const fetchPaymentTransactions = async () => {
  tableBody.push(...dummyTableBody);
  isLoading.value = false;

  // const response = await processAPIRequest({
  //   action: getTransactions,
  //   payload: {},
  //   showAlert: false,
  // });

  // isLoading.value = false;
  // // console.log(response);
  // if (response?.code === 200) {
  //   response.data.map((data: any) => {
  //     tableBody.push({
  //       date_created: getTransactionDate(data.created_at),
  //       customer_details: data.customer
  //         ? h(TableDoubleColumn, {
  //             entry: {
  //               primaryText: `${data.customer.firstname} ${data.customer.lastname}`,
  //               secondaryText: data.customer.email,
  //             },
  //           })
  //         : notAvailable("No customer info"),
  //       amount: h(TableDoubleColumn, {
  //         entry: {
  //           primaryText: `${data.currency} ${formatNumber(data.amount)}`,
  //           secondaryText: `Charge: ${data.currency} ${formatNumber(data.charge)}`,
  //         },
  //       }),
  //       payment_details: h(TableDoubleColumn, {
  //         entry: {
  //           primaryText: capitalizeFirstLetter(data.method),
  //           secondaryText: `Type: ${
  //             data.redirect_url.startsWith("https://store.redstonepgs.com/")
  //               ? "Storefront"
  //               : "Third party"
  //           }`,
  //         },
  //       }),
  //       status: getStatus(data.status, data.status),
  //     });
  //   });

  //   tablePaging.value = response.pagination[0];
  // }
};

const handleTableClicked = (id: string) => {
  router.push(`/merchant/${id}`);
};

onMounted(() => {
  fetchPaymentTransactions();
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
