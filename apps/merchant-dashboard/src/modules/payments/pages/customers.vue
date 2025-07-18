<template>
  <PageContentWrapper>
    <template v-slot:pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No customers yet',
          description:
            'We haven\'t collected payment from any customer on this account yet. This is where you\'ll be able to see all customers you\'ve collected payment from.',
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
import { TableHeaderType } from "@packages/models";
import { usePaymentStore } from "../store";
import { useDate, useString, useEvents } from "@packages/hooks";

import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
} from "@packages/uikit";

const { formatNumber, getStatus, notAvailable } = useString();
const { getCustomers } = usePaymentStore();
const { processAPIRequest } = useEvents();

const isLoading = ref(true);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Added On", slug: "date_created" },
  { title: "Full Name", slug: "full_name" },
  { title: "Customer Email", slug: "customer_email" },
  { title: "Phone Number", slug: "phone_number" },
  { title: "Status", slug: "status" },
]);

const tableBody = reactive<any[]>([
  // {
  //   status: getStatus("success", "Successful"),
  //   date_created: "22nd July, 2024",
  //   customer_email: "elvis@vesicash.com",
  //   full_name: "Efemena Elvis",
  //   phone_number: "+234 813 117 7703",
  // },
]);
const tablePaging = ref<any>({});

const getDateAdded = (date: string) => {
  let { w2, m3, d3, y1 } = useDate.formatDate(date).getAll();
  return `${w2}, ${d3} ${m3}, ${y1}`;
};

const fetchCustomers = async () => {
  const response = await processAPIRequest({
    action: getCustomers,
    payload: {},
    showAlert: false,
  });

  isLoading.value = false;

  if (response.code === 200) {
    response.data.map((data: any) => {
      tableBody.push({
        date_created: getDateAdded(data.created_at),
        full_name: `${data.firstname} ${data.lastname}`,
        customer_email: data.email,
        phone_number: data.phone_number
          ? "+" + data.phone_number
          : notAvailable("No phone number"),
        status: getStatus(
          data.blacklisted ? "danger" : "success",
          data.blacklisted ? "Blacklisted" : "Active"
        ),
      });
    });

    tablePaging.value = response.pagination[0];
  }
};

onMounted(() => {
  fetchCustomers();
});
</script>
