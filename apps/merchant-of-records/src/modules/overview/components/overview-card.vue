<template>
  <div class="overview-card">
    <div class="top-row">
      <div class="country-flag">
        <img :src="wallet.countryFlag" :alt="wallet.countryFlag" />
      </div>

      <div class="country-currency">{{ wallet.currencyShort }}</div>
    </div>

    <div class="bottom-row">
      <span class="mr-[1.5px]">{{ wallet.currencySign }}</span
      ><span>{{ formatNumber(wallet.amount) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useString } from "@packages/hooks";

const { formatNumber } = useString();

const props = defineProps({
  wallet: {
    type: Object,
    default: () => ({
      countryFlag: "",
      currencyShort: "",
      currencySign: "",
      amount: 0,
    }),
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.overview-card {
  @apply w-[256px] h-[100px] rounded-xl bg-teal-900/95 px-6 py-5 flex flex-col justify-between items-start gap-y-4;

  .top-row {
    @apply flex justify-start items-center gap-x-2;

    .country-flag {
      @apply relative size-6 min-h-6 min-w-6 rounded-full;

      img {
        @apply absolute w-full h-full object-cover;
      }
    }

    .country-currency {
      @apply text-sm font-medium text-grey-500;
    }
  }

  .bottom-row {
    @apply text-white text-xl font-semibold;
  }
}
</style>
