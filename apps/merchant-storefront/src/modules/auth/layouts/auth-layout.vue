<template>
  <div class="auth-layout">
    <!-- AUTH LAYOUT LEFT -->
    <div class="auth-layout--left">
      <!-- STORO LOGO -->
      <img
        :src="renderImg('storo-logo-white.svg')"
        alt="Storo Logo"
        class="logo"
      />

      <!-- COONTENT AREA -->
      <div class="content-area">
        <!-- TITLE TEXT -->
        <h1 class="title-text">Your Gateway to Seamless Sales</h1>

        <!-- DESCRIPTION TEXT -->
        <p class="description-text">
          Set up fast and start selling in minutes.
        </p>
      </div>

      <!-- BASE AREA -->
      <div class="base-area w-full">
        <authTestimonialCard />
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
import authTestimonialCard from "@/modules/auth/components/auth-testimonial-card.vue";

const { renderImg } = useImage();
const { setPageBackgroundColor } = useColor();

setPageBackgroundColor("#ffffff");
</script>

<style lang="scss" scoped>
.auth-layout {
  @apply relative w-screen h-screen;

  &--left {
    @apply fixed left-0 w-[42%] lg:w-[40%] mdLg:hidden h-full py-14 px-16 xl:px-14 lg:px-10 flex flex-col justify-between items-start;
    background: linear-gradient(
      180deg,
      #0b2e16 0%,
      #021e0b 47.5%,
      #0b2e16 100%
    );

    .logo {
      @apply w-[116px] h-auto;
    }

    .content-area {
      @apply relative flex flex-col justify-start items-start gap-6 w-full;

      .title-text {
        @apply text-white text-[45px] lg:text-[40px] leading-[56px] lg:leading-[48px] font-bold;
      }

      .description-text {
        @apply text-grey-100 text-[19px] xl:text-lg;
      }
    }
  }

  &--right {
    @apply absolute right-0 w-[58%] lg:w-[60%] mdLg:w-full sm:px-[14%] xs:px-[5%] h-full;
  }
}
</style>
