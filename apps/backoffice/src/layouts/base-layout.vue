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
          :resetMfaAction="resetAdminMfa"
        />
      </div>

      <!-- MAIN CONTENT AREA -->
      <div class="main-content-area">
        <!-- TOPBAR AREA -->
        <div class="topbar-area">
          <!-- BASE TOP BAR -->
          <BaseTopbar
            :businessProfile="profileUtil"
            :switchModeAction="switchAppMode"
          />
        </div>

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
import { ref, watch, onMounted, onUnmounted, inject } from "vue";
import { useRoute } from "vue-router";
import { jwtDecode } from "jwt-decode";
import { Emitter } from "mitt";
import { useColor, useProfile, useEvents } from "@packages/hooks";
import { BaseSidebar, BaseTopbar } from "@packages/uikit";
import { sidebarRoutes } from "@/shared/utilities/sidebar-routes";
import { useAuthStore } from "@/modules/auth/store";
import { useGlobalStore } from "@/modules/global/store";
import { useComplianceStore } from "@/modules/compliance/store";
import { useApprovalsStore } from "@/modules/approvals/store";
import { useTransactionStore } from "@/modules/transactions/store";
import { useMerchantStore } from "@/modules/merchants/store";

const route = useRoute();

const authStore = useAuthStore();
const { resetAdminMfa } = authStore;
const globalStore = useGlobalStore();
const { switchAppMode, updateEnvironment } = globalStore;
const eventBus = inject<Emitter<{ environmentChange: string }>>("eventBus");
const { getCompliances } = useComplianceStore() as any;
const { getAllWithdrawalRequests } = useApprovalsStore();
const { getAllApprovals } = useApprovalsStore();


const { setPageBackgroundColor } = useColor();
const { processAPIRequest } = useEvents();
const profileUtil = new useProfile(authStore);

const showMobileSidebar = ref<boolean>(false);

eventBus?.on("environmentChange", (mode: string) => {
  updateEnvironment(mode || "live");
});

let refreshCheckInterval: ReturnType<typeof setInterval> | null = null;

const sidebarBadgeConfig = ref<Record<string, number>>({});

const toggleMobileSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value;
};

const getPendingCount = (response: any) => {
  return Number(response?.data?.total_records ?? 0);
};

const getSidebarPendingData = async () => {
  const [
    complianceResponse,
    approvalResponse,
    withdrawalResponse,

  ] = await Promise.all([
    processAPIRequest({
      action: getCompliances,
      payload: { filters: "?page=1&status=pending&limit=10000000", page: 1 },
      showAlert: false,
    }),
    processAPIRequest({
      action: getAllApprovals,
      payload: { filters: "?page=1&status=pending&limit=10000000", page: 1 },
      showAlert: false,
    }),
    processAPIRequest({
      action: getAllWithdrawalRequests,
      payload: { filters: "?page=1&status=pending&limit=10000000", page: 1 },
      showAlert: false,
    }),

  ]);

  sidebarBadgeConfig.value = {
    Compliance: getPendingCount(complianceResponse),
    Approvals:
      getPendingCount(approvalResponse) + getPendingCount(withdrawalResponse),

  };
};

watch(route, () => {
  if (showMobileSidebar.value) {
    showMobileSidebar.value = false;
  }
});

onMounted(() => {
  getSidebarPendingData();

  refreshCheckInterval = setInterval(() => {
    const raw = localStorage.getItem("PORTAL_REFRESH_TOKEN");
    if (!raw) return;
    try {
      const { exp } = jwtDecode<{ exp: number }>(raw);
      if (Date.now() >= exp * 1000) {
        location.href = "/logout";
      }
    } catch {
      // ignore decode errors
    }
  }, 30000);
});

onUnmounted(() => {
  if (refreshCheckInterval) {
    clearInterval(refreshCheckInterval);
    refreshCheckInterval = null;
  }
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

    .topbar-area {
      @apply fixed top-0 w-[85%] xl:w-[83%] lg:w-[81%] mdLg:w-full;
      z-index: 99;
    }

    .main-content {
      @apply relative top-[70px] w-full h-full pb-7 px-9 xl:px-6 mdLg:px-4 bg-grey-50;
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
