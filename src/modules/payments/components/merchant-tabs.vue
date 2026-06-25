<!-- eslint-disable vue/valid-define-props -->
<template>
  <div class="tabs-container">
    <button
      v-for="(tab, index) in tabsList"
      :key="index"
      type="button"
      class="tab-item"
      @click="$emit('update:activeTab', tab)"
      :class="{ active: activeTab === tab }"
    >
      {{ tab }}
    </button>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable vue/valid-define-props */
import { defineEmits, defineProps, withDefaults } from "vue";

withDefaults(defineProps<{ activeTab: string; tabsList?: string[] }>(), {
  tabsList: () => [
    "Transactions",
    "Refunds",
    "Payouts",
    "Tax Records",
    // "Disputes",
    "Fees",
    "Profile",
  ],
});

defineEmits(["update:activeTab"]);
</script>

<style scoped lang="scss">
.tabs-container {
  @apply flex w-full items-center gap-4 overflow-x-auto rounded-lg bg-teal-100 p-3;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab-item {
  @apply h-8 min-w-[96px] cursor-pointer rounded-md px-4 text-center text-xs font-bold text-grey-600 transition-all ease-in-out duration-200;

  &.active {
    @apply bg-white text-teal-800 shadow-sm;
  }
}
</style>
