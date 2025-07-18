<template>
  <div class="layout-wrapper">
    <div class="transition duration-300 ease-in-out submitted-layout">
      <!-- ICON IMAGE -->
      <div class="icon-img">
        <img src="@images/pending-icon.png" alt="emptyComplianceSection" />
      </div>

      <!-- TITLE TEXT -->
      <div class="title-text">
        Merchant onboarding completed! Verification pending.
      </div>

      <!-- DESCRIPTION TEXT -->
      <div class="description-text">
        <p>
          We are currently verifying your merchants, you can continue to add
          more merchant while the verification process is ongoing.
        </p>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="flex gap-8 mt-8">
        <router-link to="/overview" class="btn btn-md btn-secondary">
          Go to Dashboard
        </router-link>

        <router-link
          :to="{ name: 'AggregatorBusinessProfile' }"
          class="btn btn-md btn-primary"
        >
          Add Merchants
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.layout-wrapper {
  @apply w-full h-auto sm:pt-1 flex justify-center sm:justify-start items-start;

  .submitted-layout {
    @apply w-[36%] xl:w-[40%] lg:w-[45%] md:w-1/2 sm:w-full pt-8 flex flex-col justify-center items-center gap-y-6;

    .icon-img {
      img {
        @apply w-[100px] lg:w-[70px] sm:w-[60px] h-auto;
      }
    }

    .title-text {
      @apply text-center text-teal-900/85 font-semibold text-[22px] lg:text-xl sm:text-[18px] w-[75%] mdLg:w-4/5 sm:w-[85%];
    }

    .description-text {
      @apply flex flex-col gap-y-4 text-center text-grey-600 w-[90%] xl:w-full;

      p {
        @apply text-[15.5px] lg:text-[14.5px] leading-[24px];
      }
    }
  }
}
</style>
