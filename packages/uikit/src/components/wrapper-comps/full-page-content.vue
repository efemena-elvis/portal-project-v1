<template>
  <div class="full-page-content">
    <div class="form-wrapper">
      <div class="form-top">
        <div class="title-text">{{ getCurrentPage?.title }}</div>
        <div class="description-text">
          {{ getCurrentPage?.description }}
        </div>

        <!-- PROCESS FLOW ROW INDICATOR -->
        <div class="flow-row" v-if="pageRouteData.length > 1">
          <router-link
            :to="{ name: flow.route }"
            activeClass="flow-item--active"
            exactActiveClass="flow-item--active"
            class="flow-item"
            v-for="(flow, index) in pageRouteData"
            :key="index"
          >
            <div class="flow-counter">{{ index + 1 }}</div>
            <div class="flow-text">{{ flow.name }}</div>
          </router-link>
        </div>
      </div>

      <!-- FORM BASE AREA -->
      <div class="form-base">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

type IPageRouteType = {
  name: string;
  route: string;
  title: string;
  description: string;
};

type IFullPageContentProps = {
  pageRouteData: IPageRouteType[];
};

const props = withDefaults(defineProps<IFullPageContentProps>(), {
  pageRouteData: () => [],
});

const route = useRoute();

const getCurrentPage = computed(() => {
  return props.pageRouteData.find((pageItem) => pageItem.route === route.name);
});
</script>

<style lang="scss" scoped>
.full-page-content {
  @apply w-[56%] xl:w-[62%] lg:w-[66%] md:w-full flex justify-center items-start mx-auto;

  .form-wrapper {
    @apply w-[70%] lg:w-[78%] mdLg:w-full;

    .form-top {
      .title-text {
        @apply text-grey-900 font-semibold text-[28px] md:text-2xl leading-[32px] mb-2.5;
      }

      .description-text {
        @apply text-grey-800/90 text-[14.75px] md:text-[14.5px] leading-[22px] md:leading-[22px] mb-7;
      }

      .flow-row {
        @apply w-full bg-grey-50 border border-grey-100 rounded-full p-2 flex justify-start items-center gap-5 overflow-auto;

        .flow-item {
          @apply flex justify-start items-center gap-3 font-medium text-grey-600 text-sm md:text-[13.5px] transition-all duration-300 ease-in-out;

          .flow-counter {
            @apply size-8 min-w-8 min-h-8 bg-neutral-10 rounded-full flex justify-center items-center text-sm transition-all duration-300 ease-in-out;
            box-shadow: -1px 1px 2px 0px rgba(168, 177, 175, 0.3);
            box-shadow: 1px -1px 2px 0px rgba(168, 177, 175, 0.3);
          }

          &--active {
            @apply text-green-500;

            .flow-counter {
              @apply bg-green-500 text-white;
            }
          }
        }
      }
    }

    .form-base {
      @apply mt-9 mb-20 md:mb-24;
    }
  }
}
</style>
