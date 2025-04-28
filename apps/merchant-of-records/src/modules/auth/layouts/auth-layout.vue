<template>
  <div class="auth-layout">
    <!-- AUTH LAYOUT LEFT -->
    <div class="auth-layout--left">
      <!-- VESICASH LOGO -->
      <img
        :src="renderImg('vesicash-feather-brand.svg')"
        alt="Vesicash Logo"
        class="logo"
      />

      <!-- COONTENT AREA -->
      <div class="content-area">
        <!-- TITLE TEXT -->
        <h1 class="title-text">Merchant of Record for businesses</h1>

        <!-- DESCRIPTION TEXT -->
        <p class="description-text">
          Access multiple markets across Africa in minutes.
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
    @apply fixed left-0 w-[45%] lg:w-[40%] mdLg:hidden h-full pt-16 px-20 xl:px-14 lg:px-10;
    background: linear-gradient(
      180deg,
      #0b2e16 0%,
      #021e0b 47.5%,
      #0b2e16 100%
    );

    .logo {
      @apply w-[178px] xl:w-[160px] h-auto;
    }

    .content-area {
      @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-start items-start gap-6  w-full px-20 xl:px-14 lg:px-10;

      .title-text {
        @apply text-white text-[50px] xl:text-[46px] lg:text-[40px] leading-[64px] xl:leading-[56px] lg:leading-[48px] font-bold;
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
