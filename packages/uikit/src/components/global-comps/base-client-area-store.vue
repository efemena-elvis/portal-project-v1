<template>
  <div class="client-area-wrapper">
    <div class="client-area">
      <div class="client-area-brand">
        {{ getBrandInitials(localActiveStore?.name || "No Name") }}
      </div>

      <div
        class="client-area-details"
        ref="togglerRef"
        @click="toggleDropdown(!showDropdown)"
      >
        <!-- CLIENT AREA INFO -->
        <div class="client-area-info cursor-pointer">
          <div class="brand-name">
            {{ localActiveStore?.name || "No Name" }}
          </div>

          <div class="brand-id-row">
            <div class="brand-id">Switch Store</div>
          </div>
        </div>
      </div>

      <!-- CLIENT TOGGLER -->
      <div
        class="client-toggler"
        ref="togglerRef"
        @click="toggleDropdown(!showDropdown)"
      >
        <div
          class="icon-double-caret-fill cursor-pointer text-grey-600/75 text-sm"
        ></div>
      </div>
    </div>

    <div
      class="dropdown-area-wrapper"
      ref="dialogRef"
      v-if="showDropdown"
      role="dialog"
      aria-modal="true"
    >
      <!-- STORE LIST -->
      <div
        class="store-list"
        v-for="(store, index) in props.storeList"
        :key="index"
      >
        <div class="store-item" @click="getSingleStore(store.id)">
          <div class="store-item--left">
            <div class="store-logo">
              <div class="initial">{{ getBrandInitials(store.name) }}</div>
            </div>

            <div>
              <div class="store-name">{{ store.name }}</div>
              <!-- <div class="store-meta">ZMW {{ store.total_sales }} sales</div> -->
            </div>
          </div>

          <div class="store-item--right">
            <div class="icon icon-caret-right"></div>
          </div>
        </div>
      </div>

      <router-link to="/storefront/create" class="dropdown-area select-none">
        <div class="dropdown-item">
          <div class="icon icon-add"></div>
          Create a new Store
        </div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useString, useClickOutside, useEvents } from "@packages/hooks";

interface IClientAreaProps {
  businessProfile: any;
  storeList: any[];
  setActiveStore: (store: any) => void;
  activeStore?: any;
}

const props = withDefaults(defineProps<IClientAreaProps>(), {
  businessProfile: () => ({}),
  storeList: () => [],
  setActiveStore: () => {},
  activeStore: () => null,
});

const { pushToastAlert, processAPIRequest } = useEvents();
const { getStringInitials } = useString();

const profileUtil = props.businessProfile;

const showDropdown = ref(false);
const dialogRef = ref<HTMLElement | null>(null);
const togglerRef = ref<HTMLElement | null>(null);

const localActiveStore = ref(props.activeStore ?? null);
const hasSetInitialStore = ref(false);

const toggleDropdown = (state: boolean) => (showDropdown.value = state);
useClickOutside(dialogRef, togglerRef, toggleDropdown);

const copied = ref<boolean>(false);

const getBusinessProfile = computed(() => profileUtil.getBusiness());
const getUser = computed(() => profileUtil.getUser());

// GET BRAND INITIALS
const getBrandInitials = (brandName: string): string =>
  getStringInitials(brandName);

const getSingleStore = (storeId: string) => {
  const store = props.storeList.find((store) => store.id === storeId);
  if (store) {
    props.setActiveStore(store);
    localActiveStore.value = store;
  }

};

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

watch(
  () => props.storeList,
  (newStoreList) => {
    if (
      newStoreList.length > 0 &&
      !localActiveStore.value &&
      !hasSetInitialStore.value
    ) {
      const firstStore = newStoreList[0];
      props.setActiveStore(firstStore);
      localActiveStore.value = firstStore;
      hasSetInitialStore.value = true;
    }
  },
  { immediate: true }
);
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
        @apply flex flex-col justify-center items-start gap-y-[0.5px] w-[96%];

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
    }
  }

  .dropdown-area-wrapper {
    @apply relative animate-slide-down border border-grey-200/90 border-x-0;

    .store-list {
      @apply flex flex-col justify-start w-full;

      .store-item {
        @apply px-[22px] flex justify-between items-center py-3.5 cursor-pointer hover:bg-green-50 border-b border-b-grey-200/90 last-of-type:border-b-0 transition duration-300 ease-in-out;

        &--left {
          @apply flex justify-start items-center gap-x-2.5;

          .store-logo {
            @apply relative min-w-9 min-h-9 size-9 rounded-full bg-grey-200/90 flex justify-center items-center font-medium text-[12.75px] font-semibold;
          }

          .store-name {
            @apply text-sm text-grey-700 font-semibold;
          }

          .store-meta {
            @apply text-xs text-grey-600;
          }
        }

        &--right {
          .icon {
            @apply text-sm text-grey-600;
          }
        }
      }
    }

    .dropdown-area {
      @apply relative py-2 border-t border-t-grey-400/25;

      .dropdown-item {
        @apply text-neutral-10 font-semibold text-sm px-5 py-2.5 rounded-sm cursor-pointer transition duration-300 ease-in-out bg-green-500 hover:bg-green-700 flex justify-start items-center gap-x-1 border-t border-t-grey-200/90;

        .icon {
          @apply text-xl;
        }
      }
    }
  }
}
</style>
