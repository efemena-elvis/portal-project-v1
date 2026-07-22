<template>
  <div class="full-page-sidebar" v-if="routeList.length">
    <div class="sidebar-data">
      <router-link
        :to="{ name: route.route }"
        class="sidebar-data-item"
        :class="
          activeRouteCategory === route.category
            ? 'sidebar-data-item--active'
            : ''
        "
        v-for="(route, index) in routeList"
        :key="index"
      >
        <div class="item-outer-ring">
          <div class="item-inner-ring"></div>
        </div>

        <div class="item-text">{{ route.name }}</div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
type IPageRouteType = {
  name: string;
  route: string;
  category: string;
  metadata: any;
};

withDefaults(
  defineProps<{ routeList: IPageRouteType[]; activeRouteCategory: string }>(),
  {
    routeList: () => [],
    activeRouteCategory: "",
  },
);
</script>

<style lang="scss" scoped>
.full-page-sidebar {
  @apply fixed w-[20%] mdLg:hidden;

  .sidebar-data {
    @apply relative flex flex-col justify-start items-start gap-8 after:absolute after:inset-0 after:w-9 after:-left-1 after:h-[106%] after:-top-[3%] after:bg-teal-50 after:p-1 after:rounded-full;

    .sidebar-data-item {
      @apply relative z-10 flex justify-start items-center gap-4;

      .item-outer-ring {
        @apply size-7 min-w-7 min-h-7 bg-neutral-10 border border-grey-300 rounded-full flex justify-center items-center;

        .item-inner-ring {
          @apply size-[18px] min-w-[18px] min-h-[18px] bg-grey-400 rounded-full;
        }
      }

      .item-text {
        @apply text-grey-800/85 font-medium text-[14.755px];
      }

      &--active {
        .item-outer-ring {
          @apply border-green-500;

          .item-inner-ring {
            @apply bg-green-500;
          }
        }

        .item-text {
          @apply text-green-500;
        }
      }
    }
  }
}
</style>
