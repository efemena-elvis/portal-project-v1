<template>
  <div class="overview-card">
    <div class="top-row">
      <div class="country-flag">
        <img :src="wallet.countryFlag" :alt="wallet.currencyShort" />
      </div>

      <div class="country-currency">
        {{ wallet.description }} ({{ wallet.currencyShort }})
      </div>
    </div>

    <div class="bottom-row">
      <span class="mr-[1.5px]">{{ wallet.currencySign }}</span
      ><span>{{ formatNumber(wallet.amount || 0)  }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useString } from "@packages/hooks";

const { formatNumber } = useString();

defineProps({
  wallet: {
    type: Object,
    default: () => ({
      countryFlag: "",
      description: "",
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
  @apply w-[280px] h-[116px] rounded-xl bg-teal-900/95 px-6 py-5 flex flex-col justify-between items-start gap-y-3;

  .top-row {
    @apply flex justify-start items-center gap-x-2;

    .country-flag {
      @apply relative size-5 rounded-full overflow-hidden;

      img {
        @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-11;
      }
    }

    .country-currency {
      @apply text-[14px] font-medium text-grey-400/75;
    }
  }

  .bottom-row {
    @apply text-white text-2xl font-semibold;
  }
}
</style>
