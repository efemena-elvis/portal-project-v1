<template>
  <div class="double-column-entry">
    <!-- IMAGE DISPLAY -->
    <div class="image-display" v-if="entry.displayImage">
      <img :src="entry.displayImage" :alt="entry.primaryText" />
    </div>

    <div class="content-display">
      <div class="primary-column-text" v-html="entry.primaryText"></div>
      <div class="secondary-column-text">{{ entry.secondaryText }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  entry: {
    type: Object,
    default: () => ({
      primaryText: "M1 Mackbook Pro",
      secondaryText: "Electronics",
      displayImage: "",
    }),
  },
});
</script>

<style lang="scss" scoped>
.double-column-entry {
  @apply flex justify-start items-center gap-x-3 ;

  .image-display {
    @apply relative size-[60px] min-w-[55px] min-h-[60px] bg-[#f0f0f1] rounded-lg overflow-hidden flex justify-center items-center;

    img {
      @apply w-auto h-[55px];
    }
  }

  .content-display {
    @apply flex flex-col justify-start items-start gap-y-[3px];

    .primary-column-text {
      @apply text-grey-800/90 font-semibold text-[13px];
    }

    .secondary-column-text {
      @apply text-grey-600 text-sm  ;
    }
  }
}
</style>
