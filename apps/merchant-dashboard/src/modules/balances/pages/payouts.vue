<template>
  <PageContentWrapper>

     <template #pageOptions>
      <div class="button-row">
        <div class="flex items-center gap-3 mr-12">
       

          <select
            v-model="selectedStatus"
            class="p-3 text-sm border rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-grey-50/80"
          >
            <option value="">Status</option>
            <option
              v-for="(status, index) in statusOptions"
              :value="status"
              :key="index"
            >
              {{ status }}
            </option>
          </select>

          <div
            class="flex items-center px-3 py-2 text-sm border rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-grey-50/80"
          >
            <input
              type="date"
              v-model="selectedDate"
              class="outline-none bg-grey-50/80"
            />
            <div class="icon icon-calendar text-[14px] "></div>
          </div>
        </div>

    
      </div>
    </template>
    <template v-slot:pageContent>

      
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="filteredTableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No payout initiated yet',
          description:
            'You haven\'t initiated any payout yet. This is where you\'ll be able to see all your  initiated payout transactions.',
             actionText: 'Initiate a Payout',
        }"
      >

        <TableContainerBody
          v-for="(payload, index) in filteredTableBody"
          :key="index"
          :tableHeader="tableHeader"
          :tableData="payload"
        />
      </TableContainer>
    </template>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useString, useEvents, useDate } from "@packages/hooks";
import { useBalanceStore } from "@/modules/balances/store";
import { TableHeaderType } from "@packages/models";
import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
} from "@packages/uikit";

const { getBoldTableText, formatNumber, getStatus } = useString();
const { fetchAllPayouts } = useBalanceStore();
const { processAPIRequest } = useEvents();

const isLoading = ref(true);
const selectedStatus = ref("");
const selectedDate = ref("");

const statusOptions = ["Successful", "Pending", "Failed"];

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date Initiated", slug: "date_created" },
  { title: "Payout Reference", slug: "reference_id" },
  { title: "Amount Requested", slug: "amount_requested" },
  { title: "Payout Narration", slug: "narration" },
  { title: "Status", slug: "status" },
]);

const tableBody = ref<any[]>([]);
const tablePaging = ref<any>({});

const getDateCreated = (date: string) => {
  const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
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
    tableBody.value = response.data.map((data: any) => ({
      // raw values (for filtering)
      raw_date: data.created_at,
      raw_status: data.status,

      // formatted values (for display)
     
      date_created: getDateCreated(data.created_at),
      reference_id: data.reference,
      amount_requested: getBoldTableText(
        `${data.currency} ${formatNumber(data.amount)}`
      ),
      narration: data.narration,
      status: getStatus(data.status, data.status),
    }));

    tablePaging.value = response.pagination[0];
  }
};


const filteredTableBody = computed(() =>
  tableBody.value.filter((tx) => {
    const matchesStatus = selectedStatus.value
      ? tx.raw_status.toLowerCase() === selectedStatus.value.toLowerCase()
      : true;

    const matchesDate = selectedDate.value
      ? new Date(tx.raw_date).toDateString() ===
        new Date(selectedDate.value).toDateString()
      : true;

    return matchesStatus && matchesDate;
  })
);

onMounted(() => {
  fetchPayouts();
});
</script>
