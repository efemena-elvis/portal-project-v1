<template>
  <div class="auth-layout">
    <!-- AUTH LAYOUT LEFT -->
    <div class="auth-layout--left">
      <!-- REDSTONE LOGO -->
      <img
        :src="renderImg('redstone-logo-light.png')"
        alt="Redstone Logo"
        class="logo"
      />

      <!-- COONTENT AREA -->
      <div class="content-area">
        <!-- TITLE TEXT -->
        <h1 class="title-text">One payment platform for all transactions.</h1>

        <!-- DESCRIPTION TEXT -->
        <p class="description-text">
          Effortlessly set up a preferred payment route to collect payments from
          your customers.
        </p>
      </div>
    </div>

    <!-- AUTH LAYOUT RIGHT -->
    <div class="auth-layout--right">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useColor } from "@packages/hooks";
import { useImage } from "@/shared/composables";

const { renderImg } = useImage();
const { setPageBackgroundColor } = useColor();

setPageBackgroundColor("#ffffff");
</script>

<style lang="scss" scoped>
.auth-layout {
  @apply relative w-screen h-screen;

  &--left {
    @apply fixed left-0 w-[45%] lg:w-[40%] mdLg:hidden h-full pt-16 px-16 xl:px-14 lg:px-10 bg-teal-900;

    .logo {
      @apply w-[200px] xl:w-[160px] h-auto;
    }

    .content-area {
      @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-start items-start gap-6 w-full px-16 xl:px-14 lg:px-10;

      .title-text {
        @apply text-white text-[46px] lg:text-[40px] leading-[60px] lg:leading-[48px] font-bold;
      }

      .description-text {
        @apply text-grey-100 text-xl xl:text-lg;
      }
    }
  }

  &--right {
    @apply absolute right-0 w-[55%] lg:w-[60%] mdLg:w-full sm:px-[14%] xs:px-[5%] h-full;
  }
}
</style>
