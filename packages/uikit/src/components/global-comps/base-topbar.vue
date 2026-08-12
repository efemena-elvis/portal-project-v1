<template>
  <div class="topbar">
    <div class="topbar--left">
      <div class="topbar--left-menu" @click="triggerMenuSidebar">
        <div class="icon icon-menu"></div>
      </div>
    </div>

    <div class="topbar--right">
      <!-- MODE TOGGLER -->
      <div class="relative right-0">
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
            <router-link to="/change-password" class="app-dropdown-item">
              <div class="text-lg text-red-600 icon icon-pen-edit"></div>
              <div class="text-red-600 text">Change Password</div>
            </router-link>
          </div>
          <div class="dropdown-wrapper">
            <router-link to="/logout" class="app-dropdown-item">
              <div class="text-lg text-red-600 icon icon-logout"></div>
              <div class="text-red-600 text">Sign Out</div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, inject } from "vue";
import { useRoute } from "vue-router";
import { Emitter } from "mitt";
import { useClickOutside } from "@packages/hooks";

// Define the type of the event bus
type Events = {
  triggerSidebar: void;
  environmentChange: string;
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

const eventBus = inject<Emitter<Events>>("eventBus");

watch(route, () => {
  toggleNotificationDropdown(false);
  toggleProfileDropdown(false);
  toggleActionDropdown(false);
});

// UPDATE ENVIRONMENT MODE
const activeMode = ref<string>("live");

const updateActiveMode = (mode: string) => {

  activeMode.value = mode;
  eventBus?.emit("environmentChange", mode);
};

const canSwtchMode = () => {
  updateActiveMode(activeMode.value === "live" ? "test" : "live");
};

const triggerMenuSidebar = () => {
  eventBus?.emit("triggerSidebar");
};

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
  toggleNotificationDropdown,
);
useClickOutside(dialogProfileRef, togglerProfileRef, toggleProfileDropdown);
useClickOutside(dialogActionRef, togglerActionRef, toggleActionDropdown);
</script>

<style lang="scss" scoped>
.topbar {
  @apply relative px-9 xl:px-6 mdLg:px-4 py-5 mdLg:py-4 sm:px-3 sm:py-2 flex flex-wrap justify-between sm:flex-col-reverse items-center h-auto  bg-grey-50;

  &--left {
    @apply flex justify-start items-center gap-x-2.5 w-1/2 sm:w-full sm:flex-wrap sm:gap-x-3 sm:gap-y-2;

    &-menu {
      @apply hidden mdLg:block text-3xl sm:text-2xl cursor-pointer text-grey-500/90 sm:absolute top-8;
    }

    &-wrapper {
      @apply flex flex-col justify-center items-start mdLg:gap-y-0.5 w-full;
    }
  }

  &--right {
    @apply flex justify-end items-center  right-2 gap-x-6 sm:gap-x-3 w-2/5 sm:w-full sm:mt-3 sm:justify-between sm:flex-wrap;

    .notification-wrapper {
      @apply flex justify-center items-center text-neutral-500 hover:text-green-800 relative cursor-pointer;
    }

    .notification-dropdown {
      @apply w-[340px] -right-[45px] pb-0 sm:right-0 sm:left-auto;

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
        @apply text-[13.5px] xs:text-[12.5px] capitalize font-medium sm:text-xs;
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
