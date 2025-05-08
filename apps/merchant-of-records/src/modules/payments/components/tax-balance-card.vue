<template>
  <div class="tax-balance-card">
    <!-- TOP ROW -->
    <div class="top-row">
      <div class="country-data">
        <div class="country-data-flag">
          <img :src="taxData.countryFlag" :alt="taxData.countryFlag" />
        </div>
        <div class="country-data-code">{{ taxData.currencyShort }}</div>
      </div>

      <div class="item-status item-status--active">
        <div class="bullet"></div>
        <div class="text">Active</div>
      </div>
    </div>

    <!-- MID ROW -->
    <div class="mid-row">
      <div class="tax-title">May COLLECTED TAX</div>
      <div class="tax-amount">
        {{ taxData.currencySign }}{{ formatNumber(taxData.amount) }}
      </div>
    </div>

    <!-- BOTTOM ROW -->
    <div class="bottom-row">
      <!-- TOTAL TAX CARD -->
      <div class="primary-tax-card">
        <div class="card-title">TOTAL TAX COLLECTED</div>
        <div class="card-value">
          {{ taxData.currencySign }}{{ formatNumber(0) }}
        </div>
      </div>

      <div class="secondary-tax-card">
        <div class="card-title">NEXT remittance</div>
        <div class="card-value">1st, June 2025</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useString } from "@packages/hooks";

const { formatNumber } = useString();

interface ITaxData {
  countryFlag: string;
  currencyShort: string;
  currencySign: string;
  amount: string;
}

const props = withDefaults(
  defineProps<{
    taxData: ITaxData;
  }>(),
  {
    taxData: () => ({}),
  }
);
</script>

<style lang="scss" scoped>
.tax-balance-card {
  @apply w-[352px] h-auto flex flex-col justify-between items-start p-6 border border-grey-200/90 rounded-2xl;

  .top-row {
    @apply flex justify-between items-center gap-4 mb-6;

    .country-data {
      @apply flex justify-start items-center gap-1.5;

      .country-data-flag {
        @apply relative size-5 rounded-full overflow-hidden;

        img {
          @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-11;
        }
      }

      .country-data-code {
        @apply text-[15px] font-medium text-grey-500;
      }
    }

    .item-status {
      @apply flex justify-center items-center gap-1 py-1 px-2.5 rounded-3xl;

      .bullet {
        @apply size-[5px] rounded-full;
      }

      .text {
        @apply text-xs font-medium;
      }

      &--active {
        @apply bg-green-100/85 text-green-700;

        .bullet {
          @apply bg-green-700;
        }
      }

      &--inactive {
        @apply bg-red-100/85 text-red-700;

        .bullet {
          @apply bg-red-700;
        }
      }
    }

    .item-text {
      @apply text-grey-600 text-xs;
    }
  }

  .mid-row {
    @apply mb-6 flex flex-col justify-start items-start gap-y-2;

    .tax-title {
      @apply text-xs text-grey-600 uppercase;
    }

    .tax-amount {
      @apply text-xl text-teal-800 font-semibold;
    }
  }

  .bottom-row {
    @apply relative flex flex-col justify-start items-start gap-y-4;

    .primary-tax-card {
      @apply w-full flex justify-between items-center gap-4 bg-yellow-50/75 border border-yellow-200/60 rounded-md px-3.5 py-2.5;
    }

    .secondary-tax-card {
      @apply w-full flex justify-between items-center gap-4;
    }

    .card-title {
      @apply text-xs text-grey-700/80 uppercase;
    }

    .card-value {
      @apply text-sm text-teal-800 font-semibold;
    }
  }
}
</style>
