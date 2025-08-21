<template>
  <PageContentWrapper>
    <template v-slot:pageContent>
      <!-- TOP BLOCK -->
      <div class="pt-3 top-block">
        <div class="top-block--left">
          <OverviewBlock :metrics="dashboardMetrics" />
        </div>

        <div class="top-block--right">
          <MetricStatsBlock :metrics="dashboardMetrics" />
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
import { onMounted, ref, watch } from "vue";
import { PageContentWrapper } from "@packages/uikit";
import { useProfile, useEvents, useStorage } from "@packages/hooks";
import { storeToRefs } from "pinia";
import {
  OverviewBlock,
  MetricStatsBlock,
  TransactionTable,
} from "@/modules/overview/components";
import { useAuthStore } from "@/modules/auth/store";
import { useOverviewStore } from "@/modules/overview/store";
import { useStoreStore } from "@/modules/storefront/store";
import { Ref } from "vue";

type Store = { id: string; [key: string]: any };
const authStore = useAuthStore();
const overviewStore = useOverviewStore();
const { getStoreList } = useStoreStore();
const profileUtil = new useProfile(authStore);
const { processAPIRequest } = useEvents();

const { getWallets, updateWalletState, getDashboardMetrics } = overviewStore;
const { getAllWallets } = storeToRefs(overviewStore);
const dashboardMetrics = ref<Record<string, any>>({});
const storeList = ref<any[]>([]);
const { getStorage } = useStorage();

const activeStore = ref(getStorage({ storage_name: "activeStore", storage_type: "object" }) || storeList.value[0] );

const fetchStoreList = async () => {

  const response = await processAPIRequest({
    action: getStoreList,
    payload: {},
  });

  if (response.code === 200) {
    storeList.value = response.data;
  }
}

watch(
  () => activeStore.value,
  async (newStore: Store | null) => {
    if (newStore?.id) {
      const response = await processAPIRequest({
        action: getDashboardMetrics,
        payload: { store_id: newStore.id },
      });
      dashboardMetrics.value = response.data;
    }
  },
  { immediate: true }
);


onMounted(async() => {
 await fetchStoreList(); 
    if (!activeStore.value?.id && storeList.value.length > 0) {
    activeStore.value = storeList.value[0];
    localStorage.setItem("activeStore", JSON.stringify(activeStore.value));
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
