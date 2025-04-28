<template>
  <div class="notification-item-data">
    <div class="item-img">
      <div
        class="icon icon-shopping-cart text-teal-800 text-xl font-medium"
      ></div>
    </div>

    <div class="item-info">
      <div class="item-info-top">
        <span class="font-semibold">Purchase</span> from Efemena Elvis
      </div>

      <div class="item-info-bottom">
        <div class="">#321231</div>
        <div class="">/</div>
        <div class="">3 days ago</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.notification-item-data {
  @apply flex justify-start items-center gap-x-2 px-4 py-3 cursor-pointer transition duration-100 ease-in-out border-b border-b-grey-200/80 hover:bg-grey-50/90;

  .item-img {
    @apply min-h-10 min-w-10 size-10 rounded-full border border-grey-200/80 flex justify-center items-center;
  }

  .item-info {
    @apply flex flex-col justify-center items-start gap-y-1;

    &-top {
      @apply text-xs text-grey-800;
    }

    &-bottom {
      @apply flex justify-start items-center gap-x-1 text-[11px] text-grey-500;
    }
  }
}
</style>
