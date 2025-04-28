<template>
  <div class="tax-block">
    <div class="title-row">Tax records</div>

    <!-- DATA ROW -->
    <div class="data-row">
      <div class="data-item">
        <div class="data-title-row">
          <div class="data-country">Zambia</div>

          <div class="data-status data-status--active">
            <div class="bullet"></div>
            <div class="text">Active</div>
          </div>
        </div>

        <div class="data-amount">
          <div>ZK</div>
          <div>0</div>
        </div>

        <div class="data-meta">COLLECTED TAX</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const feature = ref();
</script>

<style lang="scss" scoped>
.tax-block {
  @apply bg-grey-50/80 px-6 py-5 rounded-2xl w-full h-auto;

  .title-row {
    @apply font-semibold text-lg text-grey-900 mb-5;
  }

  .data-row {
    @apply flex justify-start items-center gap-4;

    .data-item {
      @apply flex flex-col justify-start items-start gap-1;

      .data-title-row {
        @apply flex justify-start items-center gap-2 mb-3;

        .data-country {
          @apply text-sm font-medium text-teal-800;
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
        @apply text-xs text-grey-600;
      }
    }
  }
}
</style>
