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
            @click="handleExport"
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
import { useDate, useString, useEvents } from "@packages/hooks";
import { exportXLSX } from "@/shared/utils/export";
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
  fetchAllTransactionPages,
  showDetailModal,
  selectedTransaction,
} = useTransactionsData();

const { pushToastAlert } = useEvents();
const { formatNumber, capitalizeFirstLetter } = useString();

const handleExport = async () => {
  const allTransactions = await fetchAllTransactionPages()

  if (!allTransactions.length) {
    pushToastAlert({
      message: "No data to export",
      description: "No transactions match the current filters.",
      type: "warning",
    })
    return
  }

  const getDateCreated = (date: string) => {
    const { w2, m3, d3, y1 } = useDate.formatDate(date).getAll()
    return `${w2}, ${d3} ${m3}, ${y1}`
  }

  const cleanData = allTransactions.map((tx: any) => ({
    Date: tx.created_at
      ? `${getDateCreated(tx.created_at)} ${useDate.formatTime(tx.created_at)}`
      : "-",
    Email: tx.email || "-",
    "Payment Method": `${capitalizeFirstLetter(tx.method?.replace(/_/g, " ") || "")} - ${capitalizeFirstLetter(tx.type?.replace(/_/g, " ") || "")}`,
    Currency: tx.currency || "-",
    Amount: formatNumber(tx.amount ?? 0),
    Status: capitalizeFirstLetter(
      tx.status === "completed" ? "Successful" : tx.status || "-",
    ),
  }))

  exportXLSX(cleanData, "Transactions_Data.xlsx", "Transactions")
}
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
