<template>
  <PageContentWrapper :showTitle="false">
    <template v-slot:pageContent>
      <TableContainer
        :tableHeader="tableHeader"
        :tableBody="tableBody"
        :isLoading="isLoading"
        :emptyData="{
          title: 'No disputes recorded',
          description: 'This merchant has no disputes at the moment.',
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
import { TableHeaderType } from "@packages/models";
import {
  TableContainer,
  TableContainerBody,
  PageContentWrapper,
} from "@packages/uikit";

const isLoading = ref(false);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date", slug: "date_created" },
  { title: "Reference", slug: "reference_id" },
  { title: "Amount", slug: "amount" },
  { title: "Status", slug: "status" },
]);

const tableBody = reactive<any[]>([]);
</script>
