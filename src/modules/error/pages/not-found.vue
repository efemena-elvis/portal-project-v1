<template>
  <div class="error">
    <div class="error__content">
      <h1 class="error__title">404 - Page Not Found</h1>
      <p class="error__description">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <p class="error__action">
        <router-link to="/" class="error__link">Go back to home</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.error {
  @apply flex items-center justify-center h-screen bg-grey-10;

  &__content {
    @apply max-w-[400px] mx-auto text-center;
  }

  &__title {
    @apply text-6xl font-bold text-grey-900;
  }

  &__description {
    @apply text-xl font-medium mt-4 text-grey-700;
  }

  &__action {
    @apply mt-8;
  }

  &__link {
    @apply text-blue-600 hover:underline;
  }
}
</style>
