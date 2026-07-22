<template>
  <div class="client-area-wrapper">
    <div class="client-area">
      <div class="client-area-brand">
        {{ getInitials(getUserDisplayName) }}
      </div>

      <div class="client-area-details">
        <!-- CLIENT AREA INFO -->
        <div class="client-area-info cursor-pointer">
          <div class="brand-name">
            {{ getUserDisplayName }}
          </div>

          <div class="brand-id-row">
            <div class="brand-id">Admin</div>
          </div>
        </div>

        <!-- DROPDOWN TOGGLER -->
        <div
          class="client-toggler"
          ref="togglerRef"
          @click="showDropdown = !showDropdown"
        >
          <div class="icon-caret-down"></div>
        </div>

        <!-- DROPDOWN -->
        <div
          class="app-dropdown"
          ref="dialogRef"
          v-if="showDropdown"
          role="dialog"
        >
          <div class="dropdown-wrapper">
            <router-link
              to="/change-password"
              class="app-dropdown-item"
              @click="showDropdown = false"
            >
              <div class="text">Change Password</div>
            </router-link>
            <!-- <div class="app-dropdown-item" @click="handleResetMfa">
              <div class="text">Reset MFA</div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useString, useClickOutside, useEvents } from "@packages/hooks";

interface IClientAreaProps {
  businessProfile: any;
  resetMfaAction: (userId: string) => Promise<any>;
}

const props = withDefaults(defineProps<IClientAreaProps>(), {
  businessProfile: () => ({}),
  resetMfaAction: async () => {
    console.warn("No resetMfaAction provided");
    return Promise.resolve(null);
  },
});

const { getStringInitials } = useString();
const { pushToastAlert, processAPIRequest } = useEvents();

const profileUtil = props.businessProfile;

const showDropdown = ref(false);
const dialogRef = ref<HTMLElement | null>(null);
const togglerRef = ref<HTMLElement | null>(null);

const toggleDropdown = (state: boolean) => (showDropdown.value = state);
useClickOutside(dialogRef, togglerRef, toggleDropdown);

const getUser = computed(() => profileUtil.getUser());

const getUserDisplayName = computed(() => {
  const user = getUser.value;
  if (!user) return "No business name";
  const first = user.firstName ?? "";
  const last = user.lastName ?? "";
  return `${first} ${last}`.trim() || "No business name";
});

const handleResetMfa = async () => {
  showDropdown.value = false;

  const userId = getUser.value?.id;
  if (!userId) return;

  const response = await processAPIRequest({
    action: () => props.resetMfaAction(userId),
    showAlert: false,
  });

  if (response?.code === 200) {
    pushToastAlert({
      message: "MFA reset successfully. Please login again.",
      type: "success",
    });
    location.href = "/logout";
  }
};

const getInitials = (brandName: string): string => getStringInitials(brandName);
</script>

<style lang="scss" scoped>
.client-area-wrapper {
  @apply relative bg-white h-auto;
  z-index: 99;

  .client-area {
    @apply relative flex justify-start items-center gap-x-2.5 px-[22px] pt-[22px] pb-[18px];

    &-brand {
      @apply relative min-w-9 min-h-9 size-9 rounded-full bg-grey-200/90 flex justify-center items-center font-medium text-[12.75px] font-semibold;
    }

    &-details {
      @apply flex justify-between items-center gap-x-1 relative w-full;

      .client-area-info {
        @apply flex flex-col justify-center items-start gap-y-[0.5px] w-[90%];

        .brand-name {
          @apply font-semibold text-[15px] leading-[22px] text-grey-800 line-clamp-1 w-full;
        }

        .brand-id-row {
          @apply relative w-[96%];

          .brand-id {
            @apply relative cursor-pointer text-grey-700/90 text-[13px] line-clamp-1 w-full text-green-500;
          }
        }
      }

      .client-toggler {
        @apply text-grey-600 text-sm w-[8%] cursor-pointer flex justify-center items-center;
      }

      .app-dropdown {
        @apply w-[180px] top-10;
      }
    }
  }

  .dropdown-area-wrapper {
    @apply relative px-3 animate-slide-down;

    .dropdown-area {
      @apply relative py-2 border-t border-t-grey-400/25;

      .dropdown-item {
        @apply text-grey-800 text-sm px-[10px] py-[10px] rounded-sm cursor-pointer transition duration-300 ease-in-out hover:bg-[#042c41];
      }
    }
  }
}
</style>
