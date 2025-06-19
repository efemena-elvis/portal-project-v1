<template>
  <div
    class="auth-wrapper"
    :class="center_placement ? 'place-center' : 'place-top'"
  >
    <div class="w-full">
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
});
</script>

<style lang="scss" scoped>
.auth-wrapper {
  @apply relative w-[55%] lg:w-[65%] sm:w-full mx-auto h-full;

  .title-text {
    @apply text-3xl sm:text-[24px] font-semibold text-grey-800;
  }

  .description-text {
    @apply text-[14.5px] sm:text-[13.75px] text-grey-700/85 mb-7;
  }
}

.place-center {
  @apply flex justify-center items-center;
}

.place-top {
  @apply mt-24 pb-28;
}
</style>
