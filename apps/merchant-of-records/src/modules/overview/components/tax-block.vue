<template>
  <div class="tax-block">
    <div class="title-row">Tax records</div>

    <!-- DATA ROW -->
    <div class="data-row">
      <div class="data-item" v-for="(item, index) in taxList" :key="index">
        <div class="data-title-row">
          <div class="data-country">
            <div class="img-wrapper">
              <img :src="item.countryFlag" :alt="item.countryFlag" />
            </div>
            <div class="data-currency">{{ item.currencyShort }}</div>
          </div>

          <!-- <div class="data-status data-status--active">
            <div class="bullet"></div>
            <div class="text">Active</div>
          </div> -->
        </div>

        <div class="data-amount">
          <div>{{ item.currencySign }}</div>
          <div>{{ formatNumber(item.amount) }}</div>
        </div>

        <div class="data-meta">COLLECTED TAX</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useString } from "@packages/hooks";

const { formatNumber } = useString();

interface ITaxList {
  countryFlag: string;
  currencyShort: string;
  currencySign: string;
  amount: number;
}

const props = withDefaults(
  defineProps<{
    taxList: ITaxList[];
  }>(),
  {
    taxList: () => [],
  }
);
</script>

<style lang="scss" scoped>
.tax-block {
  @apply bg-grey-50/80 px-6 py-5 rounded-2xl w-full h-auto;

  .title-row {
    @apply font-semibold text-lg text-grey-900 mb-5;
  }

  .data-row {
    @apply flex justify-start items-center;

    .data-item {
      @apply flex flex-col justify-start items-start gap-1 px-5 py-1 border-r border-r-grey-300/50 first-of-type:pl-0 last-of-type:pr-0 last-of-type:border-r-0;

      .data-title-row {
        @apply flex justify-start items-center gap-2 mb-3;

        .data-country {
          @apply flex justify-start items-center gap-1.5 text-sm font-medium text-teal-800;

          .img-wrapper {
            @apply relative size-5 rounded-full overflow-hidden;

            img {
              @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-11;
            }
          }

          .data-currency {
            @apply text-[14.5px] font-medium text-teal-800;
          }
        }

        .data-status {
          @apply py-1 px-2.5 rounded-3xl flex justify-center items-center gap-1;

          .bullet {
            @apply size-[5px] rounded-full;
          }

          .text {
            @apply text-xs font-medium;
          }

          &--active {
            @apply bg-green-100 text-green-800;

            .bullet {
              @apply bg-green-800;
            }
          }

          &--inactive {
            @apply bg-red-100 text-red-800;

            .bullet {
              @apply bg-red-800;
            }
          }
        }
      }

      .data-amount {
        @apply flex justify-start items-center gap-0.5 mb-1 text-lg font-semibold text-teal-800;
      }

      .data-meta {
        @apply text-xs text-grey-600/90;
      }
    }
  }
}
</style>
