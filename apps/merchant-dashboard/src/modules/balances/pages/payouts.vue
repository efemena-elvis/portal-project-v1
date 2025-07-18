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
            'You haven\'t initiated any payout yet. This is where you\'ll be able to see all your  initiated payout transactions.',
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
import { useString, useEvents, useDate } from "@packages/hooks";
import { useBalanceStore } from "@/modules/balances/store";
import { TableHeaderType } from "@packages/models";

import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
} from "@packages/uikit";
import { onMounted } from "vue";

const { getBoldTableText, formatNumber, capitalizeFirstLetter } = useString();

const { fetchAllPayouts } = useBalanceStore();
const { processAPIRequest } = useEvents();

const isLoading = ref<boolean>(true);

const showInitiatePayoutModal = ref(false);

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
const tablePaging = ref<any>({});

const getDateCreated = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const fetchPayouts = async () => {
  const response = await processAPIRequest({
    action: fetchAllPayouts,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    tableBody.length = 0;

    response.data.map((data: any) => {
      tableBody.push({
        date_created: getDateCreated(data.created_at),
        reference_id: data.reference,
        amount_requested: getBoldTableText(
          `${data.currency} ${formatNumber(data.amount)}`
        ),
        narration: data.narration,
        status: capitalizeFirstLetter(data.status.split("_").join(" ")),
      });
    });

    tablePaging.value = response.pagination[0];
  }
};

onMounted(() => {
  fetchPayouts();
});
</script>
