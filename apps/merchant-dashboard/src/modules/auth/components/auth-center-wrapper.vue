<template>
  <div
    class="account-area"
    :class="[
      center_placement ? 'items-center' : 'items-start',
      getContentWidth,
    ]"
  >
    <!-- ICON WRAPPER -->
    <div class="icon-wrapper-outer" v-if="icon_display_type">
      <div class="icon-wrapper-inner">
        <div class="icon" :class="icon_display_type"></div>
      </div>
    </div>

    <!-- TITLE TEXT -->
    <h2
      class="title-text"
      :class="{ 'title-text-left-align': !center_placement }"
    >
      {{ title_text }}
    </h2>

    <!-- DESCRIPTION TEXT -->
    <p
      class="description-text"
      :class="{ 'description-text-left-align': !center_placement }"
      v-if="meta_text"
      v-html="meta_text"
    ></p>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAppVariant } from "@packages/hooks";

const appVariant = ref<string>(useAppVariant());

const getContentWidth = computed(() => {
  return appVariant.value === "alexpay" ? "w-3/5" : "";
});

defineProps({
  title_text: {
    type: String,
    required: true,
  },
  meta_text: {
    type: String,
    required: false,
  },
  center_placement: {
    type: Boolean,
    default: true,
  },
  icon_display_type: {
    type: String,
    default: null,
  },
});
</script>

<style lang="scss" scoped>
.account-area {
  @apply flex flex-col justify-start items-center mx-auto;

  .icon-wrapper-outer {
    @apply relative size-[66px] rounded-full mb-5 flex justify-center items-center bg-green-100/40 shadow-sm;

    .icon-wrapper-inner {
      @apply relative z-10 size-[44px] rounded-full flex justify-center items-center bg-green-100/70 shadow-sm;

      .icon {
        @apply absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-2xl text-green-500/80;
      }
    }
  }

  .title-text {
    @apply text-center text-3xl xl:text-[26px] sm:text-[24px] font-bold sm:font-semibold text-grey-800 mb-4;

    &-left-align {
      @apply text-left;
    }
  }

  .description-text {
    @apply w-[70%] mdLg:w-full mx-auto text-center text-[14.5px] sm:text-[13.75px] text-grey-700/85 mb-10;

    &-left-align {
      @apply text-left w-4/5 mx-[unset];
    }
  }
}
</style>
