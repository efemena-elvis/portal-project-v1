<template>
  <div class="page-content-wrapper">
    <!-- TOP ROW -->
    <div class="top-row">
      <div class="top-row--left">
        <div class="page-title">{{ pageTitle }}</div>
      </div>

      <div class="top-row--right">
        <slot name="pageOptions"></slot>
      </div>
    </div>

    <!-- BOTTOM ROW -->
    <div class="bottom-row">
      <slot name="pageContent"></slot>
    </div>

    <!-- PAGINATION -->
    <template v-if="pagingData.page_count > 0">
      <Pagination
        :pageDescription="pagingDescription"
        :pagingData="pagingData"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Pagination from "./pagination.vue";


interface IPageContentType {
  pagingData?: any;
  pagingDescription?: string;
}

const props = withDefaults(defineProps<IPageContentType>(), {
  pagingDescription: "",
  pagingData: { page_count: 0 },
});

const route = useRoute();

const pageTitle = ref<string>("");

// UPDATE PAGE TITLE AND DESCRIPTION
const updatePageMeta = () => {
  const { title } = route.meta?.pageMeta as {
    title: string;
  };
  pageTitle.value = title.includes("Settings") ? "Settings" : title;
};

watch(route, () => updatePageMeta(), { immediate: true });
</script>

<style lang="scss">
.page-content-wrapper {
  @apply w-full h-full flex flex-col justify-between items-start gap-y-9 pb-10;

  .top-row {
    @apply flex sm:flex-wrap justify-between items-center gap-4 sm:gap-3 w-full -mb-4;

    &--left {
      @apply flex justify-start items-center gap-3 sm:w-full;

      .page-title {
        @apply font-bold text-grey-900 text-2xl;
      }
    }

    &--right {
      @apply flex justify-end items-center gap-3 sm:w-full;
    }
  }

  .bottom-row {
    @apply w-full;
  }
}
</style>
