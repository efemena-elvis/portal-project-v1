<template>
  <div class="overview-content">
    <div class="overview-content--top">
      <div class="overview-content--top--left">
        <!-- TITLE ROW -->
        <div class="title-row">
          <div class="title-text">Total Balance</div>
          <div class="icon icon-eye"></div>
        </div>

        <div class="balance-amount">
          <span class="mr-0.5">ZMW</span><span>5,280.00</span>
        </div>

        <div class="metric-stat-row">
          <div class="stat-value">ZMW540 (10.2%)</div>
          <div class="stat-ref">Past 30 days</div>
        </div>
      </div>

      <div class="overview-content--top--right">
        <!-- <button class="btn btn-sm btn-primary">Payout</button> -->
      </div>
    </div>

    <div class="overview-content--bottom">
      <BarChart />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarChart } from "@packages/uikit";
</script>

<style lang="scss" scoped>
.overview-content {
  @apply border border-grey-200/90 overflow-hidden rounded-xl p-6;

  &--top {
    @apply flex justify-between items-center gap-x-2 mb-[34px];

    &--left {
      @apply flex flex-col justify-center items-start gap-2;

      .title-row {
        @apply flex justify-start items-center gap-x-2.5 mb-1;

        .title-text {
          @apply text-sm text-grey-600 font-medium;
        }

        .icon {
          @apply relative top-[1px] text-grey-600 text-[14px] cursor-pointer;
        }
      }

      .balance-amount {
        @apply text-2xl text-grey-800 font-bold;
      }

      .metric-stat-row {
        @apply flex justify-start items-center gap-x-2 text-sm;

        .stat-value {
          @apply text-green-600 font-semibold;
        }

        .stat-ref {
          @apply text-grey-500;
        }
      }
    }

    &--right {
    }
  }

  &--bottom {
  }
}
</style>
