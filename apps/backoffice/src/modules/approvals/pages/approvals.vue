<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <PageContentWrapper
    description="Manage funding and withdrawal requests"
    :showTitle="true"
    pageDescription="All Approval Requests"
    :pagingData="tablePaging"
    @updatePage="(currentPage: number) => (page = currentPage)"
  >
    <template #pageContent>
      <section class="flex flex-col gap-7">
        <div class="flex flex-wrap items-center gap-8 mt-8">
          <StatsCard
            v-for="stat in approvalStats"
            :key="stat.title"
            :title="stat.title"
            :value="stat.value"
          />
        </div>

        <div class="inline-flex bg-teal-100 w-full p-2 rounded-md">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            :class="tabButtonClass(tab.value)"
            @click="switchTab(tab.value)"
            type="button"
          >
            {{ tab.label }}
          </button>
        </div>

        <FilterBar
          :filters="filterConfig"
          :values="filterValues"
          @change="onFilterChange"
        />

        <TableContainer
          :tableHeader="tableHeader"
          :tableBody="tableBody"
          :isLoading="isLoading"
          :emptyData="{
            title: 'No approval requests yet',
            description:
              'Approval requests will appear here once they are available.',
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

  <RequestDetailModal
    v-if="showRequestModal && selectedRequest"
    :title="
      selectedRequest.isFunding ? 'Funding Request' : 'Withdrawal Request'
    "
    :request="selectedRequest"
    @closeTriggered="closeRequestModal"
    @approve="handleApprovalAction('approve')"
    @reject="handleApprovalAction('reject')"
    @cancel="closeRequestModal"
    @goToMerchant="goToMerchantDashboard"
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
import { useApprovalsData } from "@/modules/approvals/composables/useApprovalsData";
import RequestDetailModal from "@/modules/approvals/modals/request-detail-modal.vue";

const {
  isLoading,
  tableBody,
  tableHeader,
  tablePaging,
  page,
  showRequestModal,
  selectedRequest,
  tabs,
  tabButtonClass,
  switchTab,
  filterValues,
  filterConfig,
  onFilterChange,
  approvalStats,
  closeRequestModal,
  goToMerchantDashboard,
  handleApprovalAction,
} = useApprovalsData();
</script>

<style scoped lang="scss">
.tab-btn {
  @apply text-sm font-medium text-grey-700 px-4 py-2 rounded-md transition duration-200 ease-in-out border-0 cursor-pointer bg-transparent;
}

.tab-btn--active {
  @apply bg-white text-teal-800;
}
</style>
