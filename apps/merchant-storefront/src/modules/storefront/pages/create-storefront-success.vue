<template>
  <div class="layout-wrapper">
    <div class="submitted-layout transition duration-300 ease-in-out">
      <!-- ICON IMAGE -->
      <img src="@images/success.png" alt="success" class="pulse-animation" />

      <!-- TITLE TEXT -->
      <div class="title-text">Storefront created successfully</div>

      <!-- DESCRIPTION TEXT -->
      <div class="description-text">
        Great work! You've just unlocked your storefront. Time to personalize
        and start building momentum. You can click on
        <span class="text-grey-900 font-medium">continue</span> to get started.
      </div>

      <!-- ACTION BUTTON -->
      <div class="action-row mt-5">
        <button
          class="btn btn-secondary w-[160px]"
          @click="continueToDashboard"
        >
          Skip for now
        </button>

        <button class="btn btn-primary w-[150px]" @click="continueToStoreSetup">
          Continue
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const continueToDashboard = () => router.push({ name: "StoroOverview" });
const continueToStoreSetup = () => router.push({ name: "SetupStoreDetails" });
</script>

<style lang="scss" scoped>
.layout-wrapper {
  @apply w-full h-auto sm:pt-1 flex justify-center sm:justify-start items-start;

  .submitted-layout {
    @apply w-[36%] xl:w-[40%] lg:w-[45%] md:w-1/2 sm:w-full pt-8 flex flex-col justify-center items-center gap-y-6;

    img {
      @apply w-[100px] lg:w-[70px] sm:w-[60px] h-auto;
    }

    .title-text {
      @apply text-center text-teal-900/85 font-semibold text-[22px] lg:text-xl sm:text-[18px] w-[75%] mdLg:w-4/5 sm:w-[85%];
    }

    .description-text {
      @apply text-[15.5px] lg:text-[14.5px] leading-[24px] text-center text-grey-600 w-[90%] xl:w-full;
    }

    .action-row {
      @apply w-full flex justify-center items-center gap-x-7;
    }
  }

  // Pulse animation
  .pulse-animation {
    animation: pulse-grow 0.8s ease-out forwards;
    transform-origin: center;
  }

  @keyframes pulse-grow {
    0% {
      transform: scale(0.8);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
}
</style>
