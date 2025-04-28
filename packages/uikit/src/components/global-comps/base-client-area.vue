<template>
  <div class="client-area-wrapper">
    <div class="client-area">
      <div class="client-area-brand">JG</div>

      <div class="client-area-details">
        <!-- CLIENT AREA INFO -->
        <div class="client-area-info cursor-pointer">
          <div class="brand-name">Jenny's Glow</div>

          <div class="brand-id-row">
            <div class="brand-id">elvis@vesicash.com</div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="dropdown-area-wrapper"
      ref="dialogRef"
      v-if="showDropdown"
      role="dialog"
      aria-modal="true"
    >
      <router-link to="/logout" class="dropdown-area select-none">
        <div class="dropdown-item">Sign Out</div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useString, useClickOutside, useEvents } from "@packages/hooks";

const { pushToastAlert } = useEvents();

const showDropdown = ref(false);
const dialogRef = ref<HTMLElement | null>(null);
const togglerRef = ref<HTMLElement | null>(null);

const toggleDropdown = (state: boolean) => (showDropdown.value = state);
useClickOutside(dialogRef, togglerRef, toggleDropdown);

const copied = ref<boolean>(false);
const { getStringInitials } = useString();

// GET BRAND INITIALS
const getBrandInitials = (brandName: string): string =>
  getStringInitials(brandName);

// COPY MERCHANT BUSINESS ID
const copyMerchantID = async () => {
  // const { businessId } = getBusiness();
  const businessId = "123456789";
  await navigator.clipboard.writeText(businessId);

  pushToastAlert({
    message: "Merchant ID copied successfully",
    type: "success",
  });

  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
};
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
            @apply relative cursor-pointer text-grey-700/90 text-[11px] line-clamp-1 w-full;
          }
        }
      }

      .client-toggler {
        @apply text-neutral-50/55 text-sm w-[8%];
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
