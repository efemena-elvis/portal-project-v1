<template>
  <div
    class="auth-wrapper"
    :class="[
      center_placement ? 'place-center' : 'place-top',
      hasBottomPadding && 'pb-24',
    ]"
  >
    <div class="w-full">
      <!-- BRAND LOGO -->
      <VesicashLogo v-if="show_logo" class="brand-logo" />

      <!-- TITLE TEXT -->
      <div
        class="title-text"
        :class="[
          center_title ? 'text-center' : '',
          meta_text ? 'mb-2.5' : 'mb-9',
        ]"
      >
        {{ title_text }}
      </div>

      <div
        class="description-text"
        :class="center_title ? 'text-center' : ''"
        v-if="meta_text"
        v-html="meta_text"
      ></div>

      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useAppVariant } from "@packages/hooks";
import { VesicashLogo } from "@packages/uikit";

const appVariant = ref<string>(useAppVariant());

defineProps({
  title_text: {
    type: String,
    required: true,
  },
  meta_text: {
    type: String,
    required: false,
  },
  center_title: {
    type: Boolean,
    default: false,
  },
  center_placement: {
    type: Boolean,
    default: true,
  },
  show_logo: {
    type: Boolean,
    default: false,
  },
  hasBottomPadding: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.auth-wrapper {
  @apply relative w-[55%] lg:w-[65%] sm:w-full mx-auto h-full bg-[#ffffff] p-8 rounded-[14px];

  .brand-logo {
    @apply w-[132px] h-auto mb-8;
  }

  .title-text {
    @apply text-2xl sm:text-[24px] font-semibold text-grey-800 text-center;
  }

  .description-text {
    @apply text-[14.5px] sm:text-[13.75px] text-grey-700/85 mb-7 text-center;
  }
}

.place-center {
  @apply flex justify-center items-center;
}

.place-top {
  @apply mt-24 pb-28;
}
</style>
