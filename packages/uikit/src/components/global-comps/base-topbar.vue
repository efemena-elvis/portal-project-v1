<template>
  <div class="topbar">
    <div class="topbar--left">
      <div class="topbar--left-menu" @click="triggerMenuSidebar">
        <div class="icon icon-menu"></div>
      </div>

      <div class="topbar--left-wrapper">
        <!-- Search bar -->
        <div class="search-bar">
          <div class="search-area">
            <div class="icon icon-search-normal"></div>
            <input
              type="search"
              class="form-control"
              placeholder="Search by transactions, customer or currency data"
            />
          </div>

          <!-- Search result -->
          <div class="search-result"></div>
        </div>
      </div>
    </div>

    <div class="topbar--right">
      <!-- NOTIFICATIONS -->
      <div class="relative">
        <!-- <div
          class="notification-wrapper"
          ref="togglerNotificationRef"
          @click="toggleNotificationDropdown(!showNotificationDropdown)"
        >
          <div class="icon-notification"></div>
        </div> -->

        <div
          class="app-dropdown notification-dropdown"
          ref="dialogNotificationRef"
          v-if="showNotificationDropdown"
          role="dialog"
          aria-modal="true"
        >
          <div class="dropdown-wrapper">
            <div class="item-top">Your notifications</div>

            <div class="item-list">
              <NavNotificationItem />
              <NavNotificationItem />
            </div>

            <router-link to="/notifications" class="item-base"
              >View all notifications</router-link
            >
          </div>
        </div>
      </div>

      <!-- CREATE ACTION -->
      <div class="relative">
        <div
          class="create-action"
          ref="togglerActionRef"
          @click="toggleActionDropdown(!showActionDropdown)"
        >
          <div class="icon-add"></div>
        </div>

        <div
          class="app-dropdown action-dropdown"
          ref="dialogActionRef"
          v-if="showActionDropdown"
          role="dialog"
          aria-modal="true"
        >
          <div class="dropdown-wrapper">
            <div class="app-dropdown-item">
              <div class="text">Deploy a new market</div>
            </div>

            <div class="app-dropdown-item">
              <div class="text">Request a payout</div>
            </div>
          </div>
        </div>
      </div>

      <!-- MODE TOGGLER -->
      <div class="relative">
        <div class="mode-toggler" ref="togglerModeRef" @click="canSwtchMode">
          <div
            class="mode-toggler-control"
            :class="
              activeMode === 'live'
                ? 'toggler-control-active'
                : 'toggler-control-inactive'
            "
          >
            <div class="mode-toggler-control-pin"></div>
          </div>

          <div class="text text-grey-900">{{ activeMode }} mode</div>
        </div>
      </div>

      <!-- USER PROFILE -->
      <div class="relative">
        <div
          class="profile-wrapper"
          ref="togglerProfileRef"
          @click="toggleProfileDropdown(!showProfileDropdown)"
        >
          <div class="icon-user"></div>
          <div class="icon-caret-down"></div>
        </div>

        <div
          class="app-dropdown profile-dropdown"
          ref="dialogProfileRef"
          v-if="showProfileDropdown"
          role="dialog"
          aria-modal="true"
        >
          <div class="dropdown-wrapper">
            <router-link to="/settings/profile" class="app-dropdown-item">
              <div class="icon icon-user text-base"></div>
              <div class="text">Profile</div>
            </router-link>

            <!-- <router-link to="/settings/preferences" class="app-dropdown-item">
              <div class="icon icon-tool text-base"></div>
              <div class="text">Preferences</div>
            </router-link> -->

            <router-link to="/settings/developers" class="app-dropdown-item">
              <div class="icon icon-developer text-base"></div>
              <div class="text">Developers</div>
            </router-link>

            <!-- <router-link to="/user-support" class="app-dropdown-item">
              <div class="icon icon-chat text-base"></div>
              <div class="text">Help & Support</div>
            </router-link> -->

            <router-link to="/logout" class="app-dropdown-item">
              <div class="icon icon-logout text-lg text-red-600"></div>
              <div class="text text-red-600">Sign Out</div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, inject, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Emitter } from "mitt";
import { useEvents, useClickOutside } from "@packages/hooks";
import NavNotificationItem from "./nav-notification-item.vue";

// Define the type of the event bus
type Events = {
  triggerSidebar: void;
};

interface ITopbarProps {
  businessProfile: any;
  switchModeAction: (payload: any) => Promise<any>;
}

const props = withDefaults(defineProps<ITopbarProps>(), {
  businessProfile: () => ({}),
  switchModeAction: async (payload: any) => {
    console.warn("No upload action provided");
    return Promise.resolve(null);
  },
});

const route = useRoute();
const router = useRouter();

const eventBus = inject<Emitter<Events>>("eventBus");

const { pushToastAlert, processAPIRequest } = useEvents();

const profileUtil = props.businessProfile;

const getBusinessProfile = computed(() => profileUtil.getBusiness());
const isBusinessActivated = computed(() =>
  profileUtil.getBusinessActivatedStatus()
);

const searchQuery = ref<string>("");

watch(route, () => {
  toggleNotificationDropdown(false);
  toggleProfileDropdown(false);
  toggleActionDropdown(false);
});

// UPDATE ENVIRONMENT MODE
const activeMode = ref<string>(
  getBusinessProfile?.value?.businessMode || "test"
);

const updateActiveMode = (mode: string) => {
  triggerModeChange(mode);
  activeMode.value = mode;
};

const triggerModeChange = async (mode: string) => {
  const response = await processAPIRequest({
    action: props.switchModeAction,
    payload: { mode },
    alertHandler: {
      200: {
        message: "Business mode updated successfully",
        description: `Your business is currently running on ${mode} mode`,
        type: "success",
      },
      400: {
        message: "Failed to update business mode",
        type: "error",
      },
    },
  });
  if (response?.code === 200) {
    setTimeout(() => location.reload(), 1500);
  } else {
    activeMode.value = mode === "live" ? "test" : "live";
    pushToastAlert({
      message: "Reversed to previous business mode",
      type: "warning",
    });
  }
};

const canSwtchMode = () => {
  if (isBusinessActivated.value === "true") {
    updateActiveMode(activeMode.value === "live" ? "test" : "live");
  } else {
    pushToastAlert({
      message: "Business is not activated.",
      description: "Complete your business compliance profile",
      type: "warning",
    });
  }
};

const triggerMenuSidebar = () => {
  eventBus?.emit("triggerSidebar");
};

// SETUP DROPDOWN FUNCTIONALITY
const dialogModeRef = ref<HTMLElement | null>(null);
const togglerModeRef = ref<HTMLElement | null>(null);

const showNotificationDropdown = ref(false);
const dialogNotificationRef = ref<HTMLElement | null>(null);
const togglerNotificationRef = ref<HTMLElement | null>(null);

const showActionDropdown = ref(false);
const dialogActionRef = ref<HTMLElement | null>(null);
const togglerActionRef = ref<HTMLElement | null>(null);

const showProfileDropdown = ref(false);
const dialogProfileRef = ref<HTMLElement | null>(null);
const togglerProfileRef = ref<HTMLElement | null>(null);

const toggleNotificationDropdown = (state: boolean) =>
  (showNotificationDropdown.value = state);
const toggleProfileDropdown = (state: boolean) =>
  (showProfileDropdown.value = state);
const toggleActionDropdown = (state: boolean) =>
  (showActionDropdown.value = state);

useClickOutside(
  dialogNotificationRef,
  togglerNotificationRef,
  toggleNotificationDropdown
);
useClickOutside(dialogProfileRef, togglerProfileRef, toggleProfileDropdown);
useClickOutside(dialogActionRef, togglerActionRef, toggleActionDropdown);
</script>

<style lang="scss" scoped>
.topbar {
  @apply relative px-9 xl:px-6 mdLg:px-4 py-5 mdLg:py-4 sm:py-2 flex justify-between items-center h-auto bg-neutral-10;

  &--left {
    @apply flex justify-start items-center gap-x-2.5 w-1/2;

    &-menu {
      @apply hidden mdLg:block text-3xl sm:text-2xl cursor-pointer text-grey-500/90;
    }

    &-wrapper {
      @apply flex flex-col justify-center items-start mdLg:gap-y-0.5 w-full;

      .search-bar {
        @apply relative w-[544px];

        .search-area {
          @apply relative;

          .icon {
            @apply absolute top-1/2 -translate-y-1/2 left-4 text-base text-grey-700 z-10;
          }

          .form-control {
            @apply bg-grey-50/75 h-11 pl-11 py-5 border border-grey-100 rounded-lg focus:border-green-500/60 focus:bg-grey-50/50 placeholder:text-grey-700;
          }
        }

        .search-result {
        }
      }
    }
  }

  &--right {
    @apply flex justify-end items-center gap-x-6 xs:gap-x-2.5 w-2/5;

    .notification-wrapper {
      @apply flex justify-center items-center text-neutral-500 hover:text-green-800 relative cursor-pointer;

      .icon-notification {
        @apply text-[22px];
      }
    }

    .notification-dropdown {
      @apply w-[340px] -right-[45px] pb-0;

      .dropdown-wrapper {
        @apply after:right-[14.5%];
      }

      .item-top {
        @apply text-sm font-semibold text-center text-teal-900 p-3;
      }

      .item-list {
        @apply border-t border-t-grey-200/80;
      }

      .item-base {
        @apply text-[13px] w-full block text-center font-medium cursor-pointer p-3 text-green-600 transition duration-100 ease-in-out hover:bg-grey-50/90;
      }
    }

    .create-action {
      @apply size-[22px] min-h-[22px] min-w-[22px] bg-green-500 rounded-md flex justify-center items-center cursor-pointer;

      .icon-add {
        @apply text-white text-[22px] font-medium;
      }
    }

    .action-dropdown {
      @apply w-[180px] -right-[21px];

      .dropdown-wrapper {
        @apply after:right-[14%];
      }
    }

    .mode-toggler {
      @apply flex justify-between items-center gap-x-2 cursor-pointer;

      .mode-toggler-control {
        @apply relative p-[3px] w-11 h-6 rounded-[40px] rounded-full;

        &-pin {
          @apply absolute top-1/2 -translate-y-1/2 rounded-full bg-white h-5 w-5 cursor-pointer transition duration-100 ease-in-out;
        }
      }

      .toggler-control-inactive {
        @apply bg-grey-200/70;

        .mode-toggler-control-pin {
          @apply left-[2px];
        }
      }

      .toggler-control-active {
        @apply bg-green-500;

        .mode-toggler-control-pin {
          @apply right-0.5;
        }
      }

      .text {
        @apply text-[13.5px] xs:text-[12.5px] capitalize font-medium;
      }
    }

    .profile-wrapper {
      @apply w-max h-[34px] px-2.5 border border-grey-300 rounded-[100px] flex justify-center items-center gap-x-1 cursor-pointer transition duration-100 ease-in-out hover:border-green-500;

      .icon-user {
        @apply text-neutral-800 text-[19px] font-medium;
      }

      .icon-caret-down {
        @apply text-sm;
      }
    }

    .profile-dropdown {
      @apply w-[180px] right-0;

      .dropdown-wrapper {
        @apply after:right-[14%];
      }
    }
  }
}
</style>
