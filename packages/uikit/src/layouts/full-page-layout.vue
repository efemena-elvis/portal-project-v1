<template>
  <div class="full-page-layout">
    <div class="top-area">
      <router-link
        :to="getBackRoute"
        class="icon icon-caret-left"
      ></router-link>
      <div class="divider-line"></div>
      <div class="page-title">{{ pageTitle }}</div>
    </div>

    <div class="body-area">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const pageTitle = ref<string>("");

const backRouteHistory = ref<Record<string, string>>({
  AddStoreProduct: "/products",
  all: "/overview",
});

const getBackRoute = computed(() => {
  const routeName = route.name;

  if (route.query.redirect) return `/${route.query.redirect}`;

  if (
    typeof routeName === "string" &&
    backRouteHistory.value.hasOwnProperty(routeName)
  ) {
    return backRouteHistory.value[routeName];
  }
  return backRouteHistory.value["all"];
});

// UPDATE PAGE TITLE
const updatePageTitle = () => {
  pageTitle.value = route.meta?.title as string;
};

watch(route, () => updatePageTitle(), { immediate: true });
</script>

<style lang="scss" scoped>
.full-page-layout {
  .top-area {
    @apply fixed z-20 top-0 bg-neutral-10/40 md:bg-neutral-10 w-full p-6 sm:px-4 xs:px-2 flex justify-start items-center gap-5 mb-12;

    .icon {
      @apply text-lg cursor-pointer text-grey-700;
    }

    .divider-line {
      @apply h-5 w-[1px] bg-grey-500/70;
    }

    .page-title {
      @apply text-base font-medium text-grey-900;
    }
  }

  .body-area {
    @apply relative mt-32 md:mt-28;
  }
}
</style>
