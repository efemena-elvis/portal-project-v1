<template>
  <div class="tab-bar-row">
    <router-link
      :to="{ name: route.routeLinkName }"
      class="tab-item"
      activeClass="tab-item-active"
      exactActiveClass="tab-item-active"
      v-for="(route, index) in routes"
      :key="index"
      >{{ route.routeTitle }}</router-link
    >
  </div>
</template>

<script setup lang="ts">
import { ISideNavType } from "@packages/models";

defineProps<{
  routes: ISideNavType[];
}>();
</script>

<style lang="scss" scoped>
.tab-bar-row {
  @apply w-full h-auto flex justify-start items-center gap-8 mt-2 mb-10 border-b border-b-grey-200/70;

  .tab-item {
    @apply p-2.5 text-sm font-medium text-grey-700 cursor-pointer;

    &-active {
      @apply text-green-500 border-b-2 border-b-green-500;
    }
  }
}
</style>
