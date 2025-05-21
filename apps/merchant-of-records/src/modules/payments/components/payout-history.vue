<template>
  <PageContentWrapper :showTitle = "false">
    <template v-slot:pageContent>
        <div class="flex justify-between  relative bottom-6">
        <div
          class="bg-grey-10 cursor-pointer w-[70px] p-2 text-grey-500 rounded-lg flex items-center sm:gap-2 gap-4"
        >
          <p>USD</p>
          <div class="icon-caret-down text-lg"></div>
        </div>
        <div class="border  border-grey-200 text-center rounded-lg hover:bg-grey-300 text-grey-900 cursor-pointer p-2 w-[70px]">
          Export
        </div>
      </div>
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

const { getBoldTableText, formatNumber, capitalizeFirstLetter, getStatus } = useString();

const { fetchAllPayouts } = useBalanceStore();
const { processAPIRequest } = useEvents();

  const isLoading = ref<boolean>(false);

const showInitiatePayoutModal = ref(false);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date", slug: "date_created" },
  { title: "Amount", slug: "amount_requested" },
  { title: "Fees", slug: "fee" },
  { title: "Net payout", slug: "net_payout" },
  { title: "Status", slug: "status" },
]);

const tableBody = reactive<any[]>([
  {
    date_created: "22nd July, 2024",
    amount_requested: "$12,000.00",
    fee: "$200",
    net_payout: "$11,800",
    status: getStatus("success", "Successful"),
  },
  {
    date_created: "22nd July, 2024",
    amount_requested: "$12,000.00",
    fee: "$200",
    net_payout: "$11,800",
    status: getStatus("failed", "Failed"),
  },
]);
const tablePaging = ref<any>({});

const getDateCreated = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

//   const fetchPayouts = async () => {
//     const response = await processAPIRequest({
//       action: fetchAllPayouts,
//       payload: {},
//       showAlert: false,
//     });

//     isLoading.value = false;

//     if (response.code === 200) {
//       tableBody.length = 0;

//       response.data.map((data: any) => {
//         tableBody.push({
//           date_created: getDateCreated(data.created_at),
//           reference_id: data.reference,
//           amount_requested: getBoldTableText(
//             `${data.currency} ${formatNumber(data.amount)}`
//           ),
//           narration: data.narration,
//           status: capitalizeFirstLetter(data.status.split("_").join(" ")),
//         });
//       });

//       tablePaging.value = response.pagination[0];
//     }
//   };

//   onMounted(() => {
//     fetchPayouts();
//   });
</script>
