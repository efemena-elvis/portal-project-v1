<template>
  <PageContentWrapper>
    <template v-slot:pageContent>
      <!-- TOP BLOCK -->
      <div class="top-block pt-3">
        <div class="top-block--left">
          <OverviewBlock />
        </div>

        <div class="top-block--right">
          <MetricStatsBlock metrics="dashboardMetrics"/>
        </div>
      </div>

      <!-- MID BLOCK -->
      <div class="mid-block"></div>

      <!-- BOTTOM BLOCK -->
      <div class="bottom-block">
        <TransactionTable />
      </div>
    </template>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, Ref } from "vue";
import { PageContentWrapper } from "@packages/uikit";
import { useProfile, useEvents } from "@packages/hooks";
import { storeToRefs } from "pinia";
import {
  OverviewBlock,
  MetricStatsBlock,
  TransactionTable,
} from "@/modules/overview/components";
import { useAuthStore } from "@/modules/auth/store";
import { useOverviewStore } from "@/modules/overview/store";
import { useStoreStore } from "@/modules/storefront/store";

const authStore = useAuthStore();
const overviewStore = useOverviewStore();
const profileUtil = new useProfile(authStore);

const { getWallets, updateWalletState, getDashboardMetrics } = overviewStore;
const { getAllWallets } = storeToRefs(overviewStore);

const dashboardMetrics = ref(null)


type Store = { id: string; [key: string]: any };
const { getActiveStore } = storeToRefs(useStoreStore()) as { getActiveStore: Ref<Store | null> };

const { processAPIRequest } = useEvents();

watch(() => getActiveStore.value, async (newStore: Store | null) => {
  if (newStore) {

    const response = await processAPIRequest({
      action: getDashboardMetrics,
      payload: { store_id: newStore?.id },
    });
dashboardMetrics.value = response.data;
    console.log("Dashboard Metrics:", dashboardMetrics.value);
   
  }
});

</script>

<style lang="scss" scoped>
.top-block {
  @apply flex justify-between items-start gap-x-6 mt-2;

  &--left {
    @apply w-[55%];
  }

  &--right {
    @apply w-[45%];
  }
}

.mid-block {
  @apply mb-4;
}

.bottom-block {
  @apply mt-12;
}
</style>
