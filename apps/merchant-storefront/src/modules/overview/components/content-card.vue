<template>
  <div class="content-container">
    <div class="content-container--bottom">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  contentTitle: {
    type: String,
    default: "Content Title",
  },
});
</script>

<style lang="scss" scoped>
.content-container {
  @apply border border-grey-200/90 overflow-hidden rounded-xl;

  &--top {
    @apply px-6 py-5 border-b border-b-grey-200/90;

    .block-title {
      @apply text-grey-700 font-semibold text-sm;
    }
  }

  &--bottom {
  }
}
</style>
