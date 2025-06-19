<template>
  <PageContentWrapper :showTitle="false">
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
          title: 'No balance history yet',
          description:
            'You haven\'t performed any transaction at the moment. This is where you\'ll be able to see your balance history on all outflow and inflow payments.',
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
import { ref, reactive, onMounted } from "vue";
import { useString, useDate, useEvents } from "@packages/hooks";
import { TableHeaderType } from "@packages/models";
import { useBalanceStore } from "@/modules/balances/store";
import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
} from "@packages/uikit";

const {
  formatNumber,
  getStatus,
  getBoldTableText,
  capitalizeFirstLetter,
  transactionFlowIcon,
} = useString();
const { getBalanceHistory } = useBalanceStore();
const { processAPIRequest } = useEvents();

const isLoading = ref(false);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date", slug: "date_created" },
  { title: "Description", slug: "summary" },
  { title: "Amount", slug: "amount" },
  { title: "Balance ", slug: "balance_after" },
]);

const tableBody = reactive<any[]>([
  {
    date_created: "22nd July, 2024",
    summary: "Withdrawal",
    amount: "$250000",
    balance_after: "$21,000.00",
  },
  {
    date_created: "22nd July, 2024",
    summary: "Withdrawal",
    amount: "$250000",
    balance_after: "$21,000.00",
  },
]);
const tablePaging = ref<any>({});

const getTransactionDate = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

//   const fetchBalanceHistory = async () => {
//     const response = await processAPIRequest({
//       action: getBalanceHistory,
//       payload: {},
//       showAlert: false,
//     });

//     isLoading.value = false;

//     if (response.code === 200) {
//       response.data.map((data: any) => {
//         tableBody.push({
//           status: transactionFlowIcon(
//             data.type === "credit" ? "receive" : "send"
//           ),
//           date_created: getTransactionDate(data.balance_at),
//           summary: capitalizeFirstLetter(data.action.split("-").join(" ")),
//           amount: `ZMW ${formatNumber(data.balance_before)}`,
//           balance_after: `ZMW ${formatNumber(data.balance_after)}`,
//         });
//       });

//       tablePaging.value = response.pagination[0];
//     }
//   };

//   onMounted(() => {
//     fetchBalanceHistory();
//   });
</script>
