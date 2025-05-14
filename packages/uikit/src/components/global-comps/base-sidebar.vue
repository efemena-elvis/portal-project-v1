<template>
  <div class="base-sidebar">
    <!-- CLIENT BUSINESS AREA -->
    <BaseClientArea :businessProfile="businessProfile" />

    <!-- SIDEBAR ITEMS AREA -->
    <div class="sidebar-items-area">
      <!-- TOP-LEVEL CATEGORIES -->
      <div class="sidebar-item-group" v-if="sidebarRouteList.topLevel.length">
        <template
          v-for="(route, index) in sidebarRouteList.topLevel"
          :key="index"
        >
          <router-link
            :to="route.link"
            v-if="route.active"
            activeClass="active-link"
            exactActiveClass="active-link"
            class="sidebar-item"
          >
            <div class="icon" :class="route.icon"></div>
            <div class="sidebar-text">{{ route.title }}</div>
          </router-link>
        </template>
      </div>

      <!-- SUB-LEVEL CATEGORIES -->
      <template v-if="Object.keys(groupedAndFilteredRoutes).length">
        <div
          class="sidebar-item-group"
          v-for="(
            routeCategory, categoryName, index
          ) in groupedAndFilteredRoutes"
          :key="index"
        >
          <div class="sidebar-item-group-title">
            {{ categoryName }}
          </div>

          <router-link
            v-for="(route, index) in routeCategory"
            :key="index"
            :to="route.link"
            activeClass="active-link"
            exactActiveClass="active-link"
            class="sidebar-item"
          >
            <div class="icon" :class="route.icon"></div>
            <div class="sidebar-text">{{ route.title }}</div>
          </router-link>
        </div>
      </template>
    </div>

    <!-- BOTTOM-LEVEL CATEGORIES -->
    <div
      class="sidebar-bottom-area text-white text-xs"
      v-if="sidebarRouteList.bottomLevel.length"
    >
      <router-link
        v-for="(route, index) in sidebarRouteList.bottomLevel"
        :key="index"
        :to="route.link"
        activeClass="active-link"
        exactActiveClass="active-link"
        class="sidebar-item"
      >
        <div class="icon" :class="route.icon"></div>
        <div class="sidebar-text">
          {{ route.title }}
        </div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";
import { useRoute } from "vue-router";
import { ISidebarRouteType, IRouteGroupType } from "@packages/models";
import BaseClientArea from "./base-client-area.vue";

interface ISidebarProps {
  routes: ISidebarRouteType;
  businessProfile: any;
}

interface GroupedByCategory {
  [category: string]: IRouteGroupType[];
}

const props = withDefaults(defineProps<ISidebarProps>(), {
  routes: () => ({
    topLevel: [],
    subLevel: [],
    bottomLevel: [],
  }),
  businessProfile: () => ({}),
});

const profileUtil = props.businessProfile;
const sidebarRouteList = reactive<ISidebarRouteType>(props.routes);

const morAccountType = computed(() => {
  return profileUtil?.getUser?.().morAccountType ?? "merchant";
});

const groupRoutesByCategory = (items: IRouteGroupType[]): GroupedByCategory => {
  return items.reduce((grouped, item) => {
    const category = item.category || "uncategorized";
    grouped[category] ??= [];
    grouped[category].push(item);
    return grouped;
  }, {} as GroupedByCategory);
};

const groupedAndFilteredRoutes = computed(() => {
  const grouped: GroupedByCategory = groupRoutesByCategory(sidebarRouteList.subLevel);
  const filtered: GroupedByCategory = {};

  for (const category in grouped) {
    const filteredRoutes = grouped[category].filter(
      (route) => !route.type || route.type === morAccountType.value
    );
    if (filteredRoutes.length) {
      filtered[category] = filteredRoutes;
    }
  }

  return filtered;
});


</script>

<style lang="scss" scoped>
.base-sidebar {
  @apply relative bg-white border-r border-grey-200/70 h-full;
  z-index: 6999;

  .sidebar-items-area {
    @apply absolute top-0 pt-[96px] pb-28 w-full h-screen overflow-auto;

    &::-webkit-scrollbar {
      display: none;
    }

    .sidebar-item-group {
      @apply relative mb-6;

      &-title {
        @apply px-6 text-[13.5px] mb-[6px] capitalize text-grey-600;
      }
    }
  }

  .sidebar-bottom-area {
    @apply absolute w-full bottom-0 bg-white py-4;
  }

  .sidebar-item {
    @apply w-full px-6 py-2.5 text-neutral-800 flex justify-start items-center gap-x-[12px] transition duration-300 ease-in-out hover:bg-grey-100/60;

    .icon {
      @apply text-[17px];
    }

    .sidebar-text {
      @apply text-[14.5px];
    }
  }
}

.active-link {
  @apply font-semibold !text-green-600 bg-grey-50/90;
}
</style>
