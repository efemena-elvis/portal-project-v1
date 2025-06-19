<template>
  <PageContentWrapper>
    <template v-slot:pageContent>
      <!-- TOP BLOCK -->
      <div class="top-block">
        <div class="top-block--left">
          <OverviewBlock />
        </div>

        <div class="top-block--right">
          <MetricStatsBlock />
        </div>
      </div>

      <!-- MID BLOCK -->
      <div class="mid-block"></div>

      <!-- BOTTOM BLOCK -->
      <div class="bottom-block"></div>
    </template>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
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

const authStore = useAuthStore();
const overviewStore = useOverviewStore();
const profileUtil = new useProfile(authStore);

const { getWallets, updateWalletState } = overviewStore;
const { getAllWallets } = storeToRefs(overviewStore);

const { processAPIRequest } = useEvents();
</script>

<style lang="scss" scoped>
.top-block {
  @apply flex justify-between items-start gap-x-8 mt-2;

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
  @apply mb-4;
}
</style>
