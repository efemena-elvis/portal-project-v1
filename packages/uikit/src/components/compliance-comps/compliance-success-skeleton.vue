<template>
  <div class="skeleton-image"></div>
  <div class="skeleton-input skeleton-title"></div>
  <div class="skeleton-input skeleton-subtitle"></div>
  <div class="skeleton-input skeleton-text"></div>
  <div class="skeleton-button skeleton-cta"></div>
</template>

<script setup>
// No additional logic is needed for this simple skeleton loader.
</script>

<style lang="scss" scoped>
.skeleton-image {
  @apply w-16 h-16 bg-grey-10/40 rounded-full mb-4;
  animation: shimmer 1.5s infinite linear;
  background: linear-gradient(90deg, #e8e8e8 25%, #efefef 50%, #e8e8e8 75%);
  background-size: 200% 100%;
}

.skeleton-title,
.skeleton-subtitle,
.skeleton-text,
.skeleton-cta {
  @apply bg-grey-10/40 rounded-lg;
  animation: shimmer 1.5s infinite linear;
  background: linear-gradient(90deg, #e8e8e8 25%, #efefef 50%, #e8e8e8 75%);
  background-size: 200% 100%;
}

.skeleton-title {
  @apply h-8 w-3/5 mb-2;
}

.skeleton-subtitle {
  @apply h-4 w-2/3 mb-2;
}

.skeleton-text {
  @apply h-4 w-full mb-6;
}

.skeleton-cta {
  @apply h-10 w-2/4;
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
