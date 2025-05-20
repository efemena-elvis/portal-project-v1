<template>
  <div :class="showAlertTop ? 'page-layout' : ''">
    <!-- ALERT TOP BAR -->
    <div class="alert-area">
      <AlertTopbar
        v-if="showAlertTop"
        :alertText="alertTopText"
        :alertAction="alertTopActionText"
        :alertActionRoute="alertTopActionRoute"
      />
    </div>

    <div class="base-layout">
      <!-- SIDEBAR AREA -->
      <div
        class="sidebar-area"
        :class="showMobileSidebar && 'visible-sidebar-area'"
      >
        <div class="sidebar-mobile-overlay" @click="toggleMobileSidebar"></div>
        <BaseSidebar :routes="sidebarRoutes" :businessProfile="profileUtil" />
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

    <!-- <a class="support-card" href="#" @click="toggleSupportModal">
      <div class="icon icon-support-icon"></div>
      <div class="text">NEED HELP ?</div>
    </a> -->
  </div>

  <teleport to="body" v-if="showSupportModal">
    <!-- <ContactSupportModal @closeTriggered="toggleSupportModal" /> -->
  </teleport>
</template>

<script lang="ts" setup>
import { ref, watch, inject, onMounted, computed } from "vue";
import { Emitter } from "mitt";
import { useRoute } from "vue-router";
import { useColor, useProfile } from "@packages/hooks";
import { BaseTopbar, BaseSidebar, AlertTopbar } from "@packages/uikit";
import { sidebarRoutes } from "@/shared/utilities/sidebar-routes";
import { useAuthStore } from "@/modules/auth/store";
import { useGlobalStore } from "@/modules/global/store";
// import ContactSupportModal from "@/shared/modals/contact-support-modal.vue";

// Define the type of the event bus
type Events = {
  triggerSidebar: void;
};

const route = useRoute();

const authStore = useAuthStore();
const { switchAppMode } = useGlobalStore();

const { setPageBackgroundColor } = useColor();
const profileUtil = new useProfile(authStore);

const eventBus = inject<Emitter<Events>>("eventBus");
const showMobileSidebar = ref<boolean>(false);

const showAlertTop = ref<boolean>(false);
const alertTopText = ref<string>("");
const alertTopActionText = ref<string>("");
const alertTopActionRoute = ref<string>("");

const morAccountType = computed(() => {
  const userProfile = profileUtil?.getUser();
  return userProfile?.morAccountType;
});

const toggleMobileSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value;
};

const showSupportModal = ref(false);

const toggleSupportModal = () => {
  showSupportModal.value = !showSupportModal.value;
};

const getActivationStatus = () => {
  if (
    profileUtil.getBusinessActivatedStatus() !== "true" ||
    morAccountType.value === "aggregator"
  ) {
    showAlertTop.value = true;

    if (profileUtil.getBusiness()?.activateMyBusiness) {
      alertTopText.value = "Your business compliance is in review.";
      alertTopActionText.value = "View compliance";
      alertTopActionRoute.value = "/compliance/compliance-summary";
    } else {
      alertTopText.value = "You are on Sandbox mode";
      alertTopActionText.value = "Activate business";
      alertTopActionRoute.value = "/compliance/business-profile";
    }
  } else {
    showAlertTop.value = false;
  }
};

watch(route, () => {
  if (showMobileSidebar.value) {
    showMobileSidebar.value = false;
  }
});

onMounted(() => {
  eventBus?.on("triggerSidebar", () => toggleMobileSidebar());
  getActivationStatus();
});

// Set page background color
setPageBackgroundColor("#ffffff");
</script>

<style lang="scss" scoped>
.base-layout {
  @apply relative w-full flex justify-between items-start;

  .sidebar-area {
    @apply fixed w-[18%] xl:w-[20%] lg:w-[24%] mdLg:w-0 mdLg:hidden h-full top-0 left-0;
  }

  .visible-sidebar-area {
    @apply fixed h-screen w-[35%] md:w-[45%] sm:w-[60%] xs:w-[70%] block z-50 animate-drift-left;
    z-index: 999;

    .sidebar-mobile-overlay {
      @apply fixed inset-0 w-full h-full bg-neutral-900/40 transition duration-300 ease-in-out;
    }
  }

  .main-content-area {
    @apply relative w-[82%] xl:w-[80%] lg:w-[76%] mdLg:w-full left-[18%] xl:left-[20%] lg:left-[24%] mdLg:left-0;

    .topbar-area {
      @apply fixed top-0 w-[82%] xl:w-[80%] lg:w-[76%] mdLg:w-full;
      z-index: 99;
    }

    .main-content {
      @apply relative top-[70px] mt-3.5 pt-4 w-full h-full pb-7 px-9 xl:px-6 mdLg:px-4 bg-neutral-10;
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
