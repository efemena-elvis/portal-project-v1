<template>
  <PageContentWrapper>
    <template v-slot:pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No balance history yet',
          description:
            'You haven\'t performed any transaction at the moment. This is where you\'ll be able to see your balance history on all outflow and inflow payments',
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
import { ref, reactive } from "vue";
import { useString } from "@packages/hooks";
import { TableHeaderType } from "@packages/models";
import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
} from "@packages/uikit";

const { formatNumber, getStatus, getBoldTableText } = useString();

const isLoading = ref(false);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date Created", slug: "date_created" },
  { title: "Transaction Summary", slug: "summary" },
  { title: "Market Wallet", slug: "wallet" },
  { title: "Balance Before", slug: "balance_before" },
  { title: "Change", slug: "change" },
  { title: "Balance After", slug: "balance_after" },
]);

const tableBody = reactive<any[]>([
  {
    date_created: "22nd July, 2024",
    summary: "Collection charge",
    wallet: "NGN Wallet",
    balance_before: "NGN 20,000.00",
    change: getBoldTableText("NGN 1,000.00"),
    balance_after: "NGN 21,000.00",
  },
  {
    date_created: "22nd July, 2024",
    summary: "Collection charge",
    wallet: "USD Wallet",
    balance_before: "USD 5,000.00",
    change: getBoldTableText("USD 1,000.00"),
    balance_after: "USD 6,000.00",
  },
]);
</script>
