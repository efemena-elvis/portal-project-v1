<template>
  <div class="product-order-item">
    <div class="product-order-item--left">
      <img :src="product.image" :alt="product.name" />
    </div>

    <div class="product-order-item--right">
      <div class="product-order-info">
        <div class="mb-3">
          <div class="info-top">{{ product.name }}</div>
          <div class="category text-grey-600/90 text-[13px]">
            {{ product.category }}
          </div>
        </div>

        <div class="info-bottom">
          <div class="product-amount">
            <span class="mr-0.5">ZMW</span
            ><span>{{ formatNumber(product.amount) }}</span>
          </div>
          <div class="multiplier">x</div>
          <div class="product-unit">
            {{ product.quantity || 1 }} UNIT{{
              (product.quantity || 1) > 1 ? "S" : ""
            }}
          </div>
        </div>
      </div>

      <div class="pt-1 product-order-amount">
        <span class="mr-0.5">ZMW</span
        ><span>{{
          formatNumber(product.amount * (product.quantity || 1))
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useString } from "@packages/hooks";

interface IProductOrderItem {
  product: any;
}

defineProps<IProductOrderItem>();

const { formatNumber } = useString();
</script>

<style lang="scss" scoped>
.product-order-item {
  @apply w-full h-auto flex justify-between items-start gap-x-3 lg:gap-x-2 py-5 first-of-type:pt-0.5 last-of-type:pb-0 border-b border-b-grey-200/75 last-of-type:border-b-0;

  .product-order-item--left {
    @apply relative size-[74px] min-w-[74px] min-h-[74px] bg-[#f0f0f1] rounded-lg flex justify-center items-center;

    img {
      @apply w-auto h-[70px];
    }
  }

  .product-order-item--right {
    @apply w-full flex justify-between items-start gap-x-3;

    .product-order-info {
      @apply flex flex-col justify-start items-start;

      .info-top {
        @apply text-[14.5px] lg:text-[14px] sm:text-[14px] font-semibold text-grey-800;
      }

      .info-bottom {
        @apply flex justify-start items-center gap-x-2 text-[13px] sm:text-[12px] font-medium text-neutral-400/80;

        .multiplier {
          @apply text-sm;
        }
      }
    }

    .product-order-amount {
      @apply text-[14.25px] sm:text-[14px] font-semibold text-grey-700;
    }
  }
}
</style>
