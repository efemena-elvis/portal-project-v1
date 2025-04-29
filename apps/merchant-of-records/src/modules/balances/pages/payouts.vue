<template>
  <PageContentWrapper>
    <template v-slot:pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No payout initiated yet',
          description:
            'You haven\'t initiated any payout yet. This is where you\'ll be able to see all your  initiated payout transactions',
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

const { formatNumber, getStatus } = useString();

const isLoading = ref(false);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date Initiated", slug: "date_created" },
  { title: "Payout Reference", slug: "reference_id" },
  { title: "Amount Requested", slug: "amount_requested" },
  { title: "Payout Narration", slug: "narration" },
  { title: "Status", slug: "status" },
]);

const tableBody = reactive<any[]>([
  // {
  //   date_created: "22nd July, 2024",
  //   reference_id: "Ref: 123-980-112119",
  //   amount_requested: "NGN 120,000.00",
  //   narration: "Payment for April 2025",
  //   status: getStatus("success", "Successful"),
  // },
]);
</script>
