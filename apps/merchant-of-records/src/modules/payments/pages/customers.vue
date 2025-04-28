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
            'We haven\'t collected payment from any customer on this account yet. This is where you\'ll be able to see all customers you\'ve collected payment from',
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
  { title: "Added On", slug: "date_created" },
  { title: "Full Name", slug: "full_name" },
  { title: "Customer Email", slug: "customer_email" },
  { title: "Phone Number", slug: "phone_number" },
  { title: "Status", slug: "status" },
]);

const tableBody = reactive<any[]>([
  {
    status: getStatus("success", "Successful"),
    date_created: "22nd July, 2024",
    customer_email: "elvis@vesicash.com",
    full_name: "Efemena Elvis",
    phone_number: "+234 813 117 7703",
  },
  {
    status: getStatus("success", "Successful"),
    date_created: "26th July, 2024",
    customer_email: "oluwasegun@gmail.com",
    full_name: "Oluwasegun Joseph",
    phone_number: "+234 803 440 8121",
  },
]);
</script>
