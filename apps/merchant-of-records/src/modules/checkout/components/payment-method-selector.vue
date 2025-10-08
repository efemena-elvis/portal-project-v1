<!-- PaymentMethodSelector.vue -->
<template>
  <div class="selector-wrapper">
    <button
      @click="selectMethod('mobileMoney')"
      :class="['selector-button', { 'is-active': modelValue === 'mobileMoney' }]"
    >
      <IconMobile class="icon" />
      <span>Mobile Money</span>
    </button>

    <button
      @click="selectMethod('card')"
      :class="['selector-button', { 'is-active': modelValue === 'card' }]"
    >
      <IconCard class="icon" />
      <span>Card</span>
    </button>
  </div>
</template>

<script setup>
import IconMobile from "./icon-mobile.vue";
import IconCard from "./icon-card.vue";

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

const selectMethod = (method) => {
  emit("update:modelValue", method);
};
</script>

<style lang="scss" scoped>
.selector-wrapper {
  @apply grid grid-cols-2 gap-3 bg-gray-100 p-1 rounded-lg mb-9;

  .selector-button {
    @apply flex items-center justify-center w-full px-4 py-2.5 rounded-md;
    @apply text-sm font-semibold text-gray-600;
    @apply transition-all duration-200 ease-in-out;
    @apply focus:outline-none focus:ring-2 focus:ring-offset-2;

    .icon {
      @apply w-5 h-5 mr-2 text-gray-500;
      transition: color 0.2s ease-in-out;
    }

    &.is-active {
      @apply bg-neutral-10 shadow-sm ring-2 ring-green-200;
      @apply text-green-500;

      .icon {
        @apply text-green-500;
      }
    }

    &:not(.is-active):hover {
      @apply bg-gray-200;
    }
  }
}
</style>
