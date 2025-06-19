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
              placeholder="Search across your store products or orders"
            />
          </div>

          <!-- Search result -->
          <div class="search-result"></div>
        </div>
      </div>
    </div>

    <div class="topbar--right">
      <button class="btn btn-sm btn-primary-outline !h-[40px] text-[11.5px]">
        View Store
      </button>

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
            <router-link to="/products/create" class="app-dropdown-item">
              <div class="icon icon-file"></div>
              <div class="text">Add product</div>
            </router-link>

            <router-link to="/storefront/create" class="app-dropdown-item">
              <div class="icon icon-shop"></div>
              <div class="text">Create store</div>
            </router-link>

            <div class="app-dropdown-item">
              <div class="icon icon-safe-home"></div>
              <div class="text">Configure Domain</div>
            </div>
          </div>
        </div>
      </div>

      <!-- USER PROFILE -->
      <div class="relative">
        <div
          class="profile-wrapper"
          ref="togglerProfileRef"
          @click="toggleProfileDropdown(!showProfileDropdown)"
        >
          <div class="profile-user">
            <div class="icon-user"></div>
          </div>

          <div>
            <div class="profile-name">Efemena Elvis</div>
            <div class="profile-role">Store Owner</div>
          </div>

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

            <router-link to="/user-support" class="app-dropdown-item">
              <div class="icon icon-chat text-base"></div>
              <div class="text">Help & Support</div>
            </router-link>

            <router-link to="/settings/preferences" class="app-dropdown-item">
              <div class="icon icon-cog text-base"></div>
              <div class="text">Settings</div>
            </router-link>

            <router-link
              to="/logout"
              class="app-dropdown-item bg-red-100/40 hover:!bg-red-100/70"
            >
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
        @apply relative w-[450px];

        .search-area {
          @apply relative;

          .icon {
            @apply absolute top-1/2 -translate-y-1/2 left-4 text-base text-grey-700 z-10;
          }

          .form-control {
            @apply bg-grey-50/75 h-11 pl-11 py-5 border border-grey-200/85 rounded-lg focus:border-green-500/60 focus:bg-grey-50/50 placeholder:text-grey-700;
          }
        }

        .search-result {
        }
      }
    }
  }

  &--right {
    @apply flex justify-end items-center gap-x-4 xs:gap-x-2.5 w-2/5;

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
      @apply size-[38px] min-h-[38px] min-w-[38px] bg-green-500 rounded-full flex justify-center items-center cursor-pointer transition duration-300 ease-in-out hover:bg-green-600;

      .icon-add {
        @apply text-white text-2xl font-semibold;
      }
    }

    .action-dropdown {
      @apply w-[180px] -right-[14px];

      .dropdown-wrapper {
        @apply after:right-[14%];
      }
    }

    .profile-wrapper {
      @apply flex justify-end items-center gap-x-3 cursor-pointer;

      .profile-user {
        @apply size-[38px] min-w-[38px] min-h-[38px] rounded-full border border-grey-400/80 flex justify-center items-center;

        .icon-user {
          @apply text-neutral-600 text-xl font-medium;
        }
      }

      .profile-name {
        @apply font-medium text-sm text-grey-800;
      }

      .profile-role {
        @apply text-xs text-grey-600;
      }

      .icon-caret-down {
        @apply text-sm ml-1;
      }
    }

    .profile-dropdown {
      @apply w-[200px] right-0;

      .dropdown-wrapper {
        @apply after:right-[14%];
      }
    }
  }
}
</style>
