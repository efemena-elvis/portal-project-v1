<template>
  <div>
    <div class="base-layout">
      <!-- SIDEBAR AREA -->
      <div
        class="sidebar-area"
        :class="showMobileSidebar && 'visible-sidebar-area'"
      >
        <div class="sidebar-mobile-overlay" @click="toggleMobileSidebar"></div>
        <BaseSidebar
          :routes="sidebarRoutes"
          :businessProfile="profileUtil"
          :badgeConfig="sidebarBadgeConfig"
        />
      </div>

      <!-- MAIN CONTENT AREA -->
      <div class="main-content-area">
        <!-- MAIN CONTENT -->
        <div class="main-content">
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useColor, useProfile, useEvents } from "@packages/hooks";
import { BaseSidebar } from "@packages/uikit";
import { sidebarRoutes } from "@/shared/utilities/sidebar-routes";
import { useAuthStore } from "@/modules/auth/store";
import { usePaymentStore } from "@/modules/payments/store";
import { useBalanceStore } from "@/modules/balances/store";



const route = useRoute();

const authStore = useAuthStore();
const { getTransactions } = usePaymentStore();
const { getPayouts } = useBalanceStore();

const { setPageBackgroundColor } = useColor();
const { processAPIRequest } = useEvents();
const profileUtil = new useProfile(authStore);

const showMobileSidebar = ref<boolean>(false);

const sidebarBadgeConfig = ref<Record<string, number>>({});


const toggleMobileSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value;
};


const getPendingCount = (response: any) => {
  const pagination = response?.pagination?.[0] ?? {};
  return Number(
    pagination.page_count ??
      pagination.total_count ??
      pagination.total ??
      response?.data?.length ??
      0,
  );
};

const getSidebarPendingData = async () => {
  const [complianceResponse, payoutResponse] = await Promise.all([
    processAPIRequest({
      action: getTransactions,
      payload: { filters: "?page=1&status=pending&limit=10000000", page: 1 },
      showAlert: false,
    }),
    processAPIRequest({
      action: getPayouts,
      payload: { filters: "?page=1&status=pending&limit=10000000", page: 1 },
      showAlert: false,
    }),
  ]);

  sidebarBadgeConfig.value = {
    Compliance: getPendingCount(complianceResponse),
    Payouts: getPendingCount(payoutResponse),
  };
};


watch(route, () => {
  if (showMobileSidebar.value) {
    showMobileSidebar.value = false;
  }
});

onMounted(() => {
  getSidebarPendingData();
});

setPageBackgroundColor("#F1F7F6");
</script>

<style lang="scss" scoped>
.base-layout {
  @apply relative w-full flex justify-between items-start;

  .sidebar-area {
    @apply fixed w-[15%] xl:w-[17%] lg:w-[19%] mdLg:w-0 mdLg:hidden h-full top-0 left-0;
  }

  .visible-sidebar-area {
    @apply fixed h-screen w-[35%] md:w-[45%] sm:w-[60%] xs:w-[70%] block z-50 animate-drift-left;
    z-index: 999;

    .sidebar-mobile-overlay {
      @apply fixed inset-0 w-full h-full bg-neutral-900/40 transition duration-300 ease-in-out;
    }
  }

  .main-content-area {
    @apply relative w-[85%] xl:w-[83%] lg:w-[81%] mdLg:w-full left-[15%] xl:left-[17%] lg:left-[19%] mdLg:left-0 sm:mt-6;

    .main-content {
      @apply relative  w-full h-full pb-7 px-9 xl:px-6 mdLg:px-4 bg-grey-50;
    }
  }
}

.page-layout {
  .alert-area {
    @apply fixed top-0 w-full h-[40px] z-30;
  }

  .base-layout {
    .sidebar-area {
      @apply pt-10;
    }

    .main-content-area {
      .topbar-area {
        @apply top-10;
      }

      .main-content {
        @apply mt-[52px];
      }
    }
  }
}

.support-card {
  @apply fixed z-40 text-white bg-teal-700/95 bottom-7 right-7 scale-[0.85] cursor-pointer rounded-full py-[11px] px-[15px] flex justify-center items-center gap-x-2 transition duration-300 ease-in-out hover:scale-[0.9];

  .icon {
    @apply text-[16px];
  }

  .text {
    @apply text-[13px] text-white font-medium;
  }
}
</style>
