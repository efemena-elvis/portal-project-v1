<template>
  <div class="relative">
    <div
      class="date-filter-row"
      ref="togglerActionRef"
      @click="toggleActionDropdown(!showActionDropdown)"
    >
      <div class="date-item">
        <div class="date-item--left font-semibold">
          <div class="date-icon icon-calendar"></div>
          <div class="date-text">Filter:</div>
        </div>

        <div class="date-item--right">
          <div class="date-text">{{ getActiveFilter }}</div>
          <div class="date-icon icon-caret-down"></div>
        </div>
      </div>
    </div>

    <div
      class="app-dropdown date-dropdown"
      ref="dialogActionRef"
      v-if="showActionDropdown"
      role="dialog"
      aria-modal="true"
    >
      <div class="dropdown-wrapper">
        <div
          class="app-dropdown-item"
          v-for="item in dateFilterList"
          :key="item.slug"
          @click="changeRouteStatus(item.slug)"
        >
          <div class="text">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useClickOutside } from "@packages/hooks";

const route = useRoute();
const router = useRouter();

const dateFilterList = ref([
  { title: "All Time", slug: "all-time", active: true },
  { title: "Yesterday", slug: "yesterday", active: false },
  { title: "Last Week", slug: "last-week", active: false },
  { title: "Last Month", slug: "last-month", active: false },
]);

const getActiveFilter = computed(() => {
  return dateFilterList.value.find((item) => item.active)?.title || "All Time";
});

const changeRouteStatus = (slug: string) => {
  // Reset all active states
  dateFilterList.value.forEach((item) => {
    item.active = item.slug === slug;
  });

  // Update the route with the selected date filter
  router.push({ name: route.name, query: { ...route.query, date: slug } });
};

watch(route, () => {
  toggleActionDropdown(false);
});

// SETUP DROPDOWN FUNCTIONALITY
const showActionDropdown = ref(false);
const dialogActionRef = ref<HTMLElement | null>(null);
const togglerActionRef = ref<HTMLElement | null>(null);

const toggleActionDropdown = (state: boolean) =>
  (showActionDropdown.value = state);

useClickOutside(dialogActionRef, togglerActionRef, toggleActionDropdown);
</script>

<style lang="scss" scoped>
.date-filter-row {
  @apply flex justify-between items-center border border-grey-200 rounded-lg overflow-hidden w-max mb-2;

  .date-item {
    @apply w-auto px-4 py-3 flex justify-center items-center gap-x-1.5 cursor-pointer transition duration-300 ease-in-out hover:bg-green-100/20;

    &--left {
      @apply flex justify-start items-center gap-x-1;
    }

    &--right {
      @apply flex justify-end items-center gap-x-1.5;
    }

    .date-icon {
      @apply text-grey-600 text-base;
    }

    .date-text {
      @apply text-grey-700 text-sm;
    }
  }
}

.date-dropdown {
  @apply w-[160px] top-14 right-0;

  .dropdown-wrapper {
    @apply after:right-[10%];
  }
}
</style>
