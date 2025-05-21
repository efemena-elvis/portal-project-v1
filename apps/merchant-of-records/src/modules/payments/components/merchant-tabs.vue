<template>
  <div class="tabs-container">
    <span
      v-for="(tab, index) in tabsList"
      :key="index"
      class="tab-item"
      @click="$emit('update:activeTab', tab)"
      :class="{ active: activeTab === tab }"
    >
      {{ tab }}
      <div v-if="activeTab === tab" class="active-indicator"></div>
    </span>
  </div>
</template>

<script setup lang="ts">
const tabsList = [
  "Transactions",
  "Balances",
  "Payout history",
  "Tax record",
  "Profile",
];

defineProps<{ activeTab: string }>();
const emit = defineEmits(["update:activeTab"]);
</script>

<style scoped lang="scss">
.tabs-container {
  @apply flex gap-4 sm:gap-12 font-semibold text-[14px] border-b w-full pb-2 flex-wrap sm:flex-nowrap overflow-x-auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab-item {
  @apply cursor-pointer transition-all ease-in-out duration-300 min-w-max pr-8 text-grey-600;

  &.active {
    @apply text-green-500;
  }
}

.active-indicator {
  @apply w-full h-[1px] bg-green-500 relative top-2;
}
</style>
