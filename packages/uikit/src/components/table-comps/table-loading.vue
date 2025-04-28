<template>
  <div class="table-skeleton">
    <div class="skeleton-table-header"></div>
    <div class="skeleton-table-body"></div>
    <div class="skeleton-table-body"></div>
    <div class="skeleton-table-body"></div>
    <div class="skeleton-table-body"></div>
  </div>
</template>

<script></script>

<style lang="scss" scoped>
/* Loading Animation */
@keyframes loading {
  100% {
    transform: translateX(100%);
  }
}

.table-skeleton {
  .skeleton-table-header,
  .skeleton-table-body {
    @apply mb-4 w-full h-10 rounded-2xl relative overflow-hidden;
    background: linear-gradient(
      90deg,
      rgba(#f4f4f4, 0.75) 0.56%,
      rgba(#fbfbfb, 0.75) 96.76%
    );

    &::after {
      content: "";
      @apply relative block w-full h-full -translate-x-full;
      -webkit-background: -webkit-gradient(
        linear,
        left top,
        right top,
        from(transparent),
        color-stop(rgba(255, 255, 255, 0.8)),
        to(transparent)
      );

      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.8),
        transparent
      );

      /* Adding animation */
      animation: loading 1.15s infinite;
    }
  }

  .skeleton-table-body {
    @apply h-5 mb-3.5;
  }
}
</style>
