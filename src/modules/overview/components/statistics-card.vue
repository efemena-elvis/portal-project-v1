<template>
  <div class="statistics-card">
    <div class="card-content">
      <div class="data-section">
        <p class="label">{{ label }}</p>
        <p class="value">{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  bgColor: {
    type: String,
    default: "bg-white",
  },
});
</script>

<style lang="scss" scoped>
.statistics-card {
  @apply h-[150px] rounded-xl bg-white border border-grey-100 px-6 py-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow;

  .card-content {
    @apply flex items-center gap-x-4 w-full;

    .icon-section {
      @apply flex-shrink-0;

      .icon-wrapper {
        @apply w-12 h-12 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600;

        i {
          @apply text-xl;
        }

        :deep(svg) {
          @apply w-6 h-6;
        }
      }
    }

    .data-section {
      @apply flex flex-col justify-center flex-1;

      .label {
        @apply text-sm font-medium text-grey-600 mb-1;
      }

      .value {
        @apply text-2xl font-bold text-grey-900;
      }
    }
  }
}
</style>
