<template>
  <div class="tax-balance-card">
    <!-- TOP ROW -->
    <div class="top-row">
      <div class="item-status item-status--inactive">
        <div class="bullet"></div>
        <div class="text">Inactive</div>
      </div>

      <div class="item-text">COLLECTED TAX</div>
    </div>

    <!-- MID ROW -->
    <div class="mid-row"></div>

    <!-- BOTTOM ROW -->
    <div class="bottom-row">
      <div class="country-data">
        <div class="country-data-flag">
          <img src="https://flagsapi.com/US/flat/64.png" alt="" />
        </div>
        <div class="country-data-code">USD</div>
      </div>

      <div class="data-amount">
        <div class="data-amount-currency">$</div>
        <div class="data-amount-value">1,450</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.tax-balance-card {
  @apply w-[352px] h-auto flex flex-col justify-between items-start gap-6 p-6 border border-grey-200 rounded-2xl;

  .top-row {
    @apply flex justify-between items-center gap-4;

    .item-status {
      @apply flex justify-center items-center gap-1 py-1 px-2.5 rounded-3xl;

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

    .item-text {
      @apply text-grey-600 text-xs;
    }
  }

  .mid-row {
  }

  .bottom-row {
    @apply relative flex justify-between items-center gap-4 top-1;

    .country-data {
      @apply flex justify-start items-center gap-1;

      .country-data-flag {
        @apply relative size-6 min-h-6 min-w-6 rounded-full overflow-hidden;

        img {
          @apply absolute w-full h-full object-cover;
        }
      }

      .country-data-code {
        @apply text-[15px] font-medium text-grey-500;
      }
    }

    .data-amount {
      @apply flex justify-start items-center gap-0.5 text-grey-800 text-xl font-semibold;
    }
  }
}
</style>
