<template>
  <div class="skeleton-loader">
    <div class="skeleton-input skeleton-title"></div>
    <div class="skeleton-input"></div>
    <div class="skeleton-input"></div>
    <div class="skeleton-input"></div>
    <div class="skeleton-buttons">
      <div class="skeleton-button"></div>
      <div class="skeleton-button"></div>
    </div>
  </div>
</template>

<script setup>
// No additional logic is needed for this simple skeleton loader.
</script>

<style lang="scss" scoped>
.skeleton-loader {
  @apply flex flex-col gap-y-5 sm:gap-y-4 my-0 mx-auto w-full;

  .skeleton-input,
  .skeleton-button {
    @apply bg-grey-10/40 rounded-lg;
    animation: shimmer 1.5s infinite linear;
    background: linear-gradient(90deg, #e8e8e8 25%, #efefef 50%, #e8e8e8 75%);
    background-size: 200% 100%;
  }

  .skeleton-input {
    @apply w-full h-12 sm:h-10;
  }

  .skeleton-title {
    @apply h-5 w-3/5 mb-1;
  }

  .skeleton-buttons {
    @apply flex gap-x-4 justify-between items-center mt-8 sm:mt-6;

    .skeleton-button {
      @apply h-12 w-[30%] sm:w-[40%];
    }
  }
}

@keyframes shimmer {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 100% 0;
  }
}
</style>
