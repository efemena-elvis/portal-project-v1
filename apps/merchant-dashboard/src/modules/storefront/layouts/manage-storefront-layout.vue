<template>
  <div class="manage-storefront-layout">
    <!-- BACK BTN -->
    <div
      class="btn btn-sm btn-secondary back-btn"
      @click="router.push({ name: 'RedstoneStorefront' })"
    >
      <div class="text-lg icon icon-caret-left"></div>
      Back
    </div>

    <div class="top-row">
      <div class="page-nav-row">
        <router-link
          :to="`/storefront/overview/${storefrontId}?storeSlug=${storefrontSlug}`"
          class="nav-item"
          activeClass="nav-item-active"
          exactActiveClass="nav-item-active"
        >
          <div class="nav-item-icon icon-shop"></div>
          <div class="nav-item-text">Overview</div>
        </router-link>

        <router-link
          :to="`/storefront/products/${storefrontId}?storeSlug=${storefrontSlug}`"
          class="nav-item"
          activeClass="nav-item-active"
          exactActiveClass="nav-item-active"
        >
          <div class="nav-item-icon icon-file"></div>
          <div class="nav-item-text">Products</div>
        </router-link>

        <router-link
          :to="`/storefront/orders/${storefrontId}?storeSlug=${storefrontSlug}`"
          class="nav-item"
          activeClass="nav-item-active"
          exactActiveClass="nav-item-active"
        >
          <div class="nav-item-icon icon-directbox-notif"></div>
          <div class="nav-item-text">Orders</div>
        </router-link>
      </div>
    </div>

    <div class="bottom-row">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const storefrontId = ref(route.params.storeId);
const storefrontSlug = ref(route.query.storeSlug);
</script>

<style lang="scss" scoped>
.manage-storefront-layout {
  @apply -mt-4;

  .back-btn {
    @apply w-max mb-6 h-10 py-2 px-4 pr-5 text-grey-800/80 border border-grey-300/70 text-[12.75px] sm:mt-3.5 hover:bg-grey-200/50;
  }

  .top-row {
    @apply border-b border-b-grey-200/70 mb-9;

    .page-nav-row {
      @apply w-max h-full flex justify-start items-center;

      .nav-item {
        @apply flex justify-start items-center gap-x-2.5 py-2.5 px-5 sm:px-3.5 text-grey-600;

        .nav-item-icon {
          @apply relative text-xl sm:text-lg;
        }

        .nav-item-text {
          @apply relative text-[14px] sm:text-[13.5px];
        }

        &-active {
          @apply text-green-600 border-b-2 border-b-green-600;

          .nav-item-icon {
            @apply text-green-600 top-[1px];
          }

          .nav-item-text {
            @apply font-medium top-[1px];
          }
        }
      }
    }
  }
}
</style>
