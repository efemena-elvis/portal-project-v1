<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <PageContentWrapper
    description="View and manage all transactions"
    :showTitle="true"
    pageDescription="All Transactions"
    :pagingData="tablePaging"
    @updatePage="(currentPage: number) => (page = currentPage)"
  >
    <template #pageContent>
      <section class="flex flex-col gap-7">
        <div
          v-if="tableBody.length > 0"
          class="flex flex-wrap items-center gap-8"
        >
          <StatsCard
            v-for="stat in transactionStats"
            :key="stat.title"
            :title="stat.title"
            :value="stat.value"
          />
          <TransactionsDonut
            v-if="!filterValues.status"
            :stats="transactionStats"
          />
        </div>
        <div class="flex items-center justify-between">
          <FilterBar
            class="w-[70%]"
            :filters="filterConfig"
            :values="filterValues"
            @change="onFilterChange"
          />
          <button
            class="btn btn-sm btn-secondary"
            type="button"
            @click="exportToExcel"
          >
            Export
          </button>
        </div>

        <TableContainer
          :tableHeader="tableHeader"
          :tableBody="tableBody"
          :isLoading="isLoading"
          :emptyData="{
            title: 'No transactions yet',
            description: 'There are no transactions matching your criteria.',
          }"
        >
          <TableContainerBody
            v-for="(payload, index) in tableBody"
            :key="index"
            :tableHeader="tableHeader"
            :tableData="payload"
          />
        </TableContainer>
      </section>
    </template>
  </PageContentWrapper>

  <TransactionDetailModal
    v-if="showDetailModal"
    :transaction="selectedTransaction"
    @closeTriggered="showDetailModal = false"
  />
</template>

<script lang="ts" setup>
import {
  PageContentWrapper,
  TableContainer,
  TableContainerBody,
  FilterBar,
  StatsCard,
} from "@packages/uikit";
import TransactionDetailModal from "@/modules/transactions/modals/transaction-detail-modal.vue";
import TransactionsDonut from "@/modules/transactions/components/transactions-donut.vue";
import { useTransactionsData } from "@/modules/transactions/composables/useTransactionsData";

const {
  transactionStats,
  isLoading,
  tableBody,
  tableHeader,
  tablePaging,
  page,
  filterValues,
  filterConfig,
  onFilterChange,
  exportToExcel,
  showDetailModal,
  selectedTransaction,
} = useTransactionsData();
</script>

<style scoped lang="scss">
:deep(tbody tr td:last-child) {
  text-align: left;

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    transition: background 0.2s;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }
}
</style>
